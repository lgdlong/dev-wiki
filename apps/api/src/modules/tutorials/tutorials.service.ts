// apps/api/src/modules/tutorials/tutorials.service.ts
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tutorial } from './entities/tutorials.entity';
import { CreateTutorialDto } from './dto/create-tutorials.dto';
import { UpdateTutorialDto } from './dto/update-tutorials.dto';
import { TutorialDetailDto, TutorialListItemDto } from './dto/tutorials.dto';
import { generateSlug } from '../../shared/helpers/slug';
import { TutorialTag } from '../tutorials-tags/entities/tutorials-tag.entity';
import { Tag } from '../tags/entities/tag.entity';
import { In } from 'typeorm';
import { DEFAULT_AUTHOR_NAME, DEFAULT_AVATAR_URL } from '../../shared/constants';
import { TutorialMapper } from './mappers/tutorials.mapper';

@Injectable()
export class TutorialService {
  constructor(
    @InjectRepository(Tutorial) private repo: Repository<Tutorial>,
    private readonly mapper: TutorialMapper,
  ) {}

  // ✅ Overload signatures
  create(dto: CreateTutorialDto): Promise<Tutorial>;
  create(dto: CreateTutorialDto, authorId: number): Promise<Tutorial>;

  async create(dto: CreateTutorialDto, authorId?: number): Promise<Tutorial> {
    try {
      // (tuỳ chọn) vẫn hỗ trợ body có author_id để quá độ
      type DtoWithAuthorId = CreateTutorialDto & {
        author_id?: number | string;
      };
      const fromBody = (dto as DtoWithAuthorId).author_id;

      const finalAuthorId =
        authorId ?? (fromBody !== undefined ? Number(fromBody) : undefined);

      // Nếu DB yêu cầu NOT NULL cho authorId, nên kiểm tra:
      if (finalAuthorId == null)
        throw new BadRequestException('author_id is required');

      // Validate dữ liệu (DTO đã trim, nhưng double-check)
      const titleTrimmed = dto.title.trim();
      const contentTrimmed = dto.content.trim();
      const slugTrimmed = generateSlug(titleTrimmed);

      // Kiểm tra trùng slug
      const duplicated = await this.repo.findOne({
        where: { slug: slugTrimmed },
        select: ['id'],
      });
      if (duplicated !== null) {
        throw new BadRequestException(
          'A tutorial with a similar title already exists. Please choose a different title.',
        );
      }

      // Tạo entity & lưu vào DB
      const tutorial = this.repo.create({
        title: titleTrimmed,
        content: contentTrimmed,
        authorId: finalAuthorId, // map snake_case -> camelCase
        views: 0,
        slug: slugTrimmed,
        isPublished: true,
      });

      return await this.repo.save(tutorial);
    } catch (e) {
      console.error('TutorialService.create error:', e);
      throw e; // đừng nuốt lỗi, để controller/global filter xử lý
    }
  }

  // ===================== GET ======================
  async findAll(): Promise<TutorialListItemDto[]> {
    const rows = await this.repo.find({
      select: {
        id: true,
        title: true,
        slug: true,
        createdAt: true,
        updatedAt: true,
        // content: false (không cần vì không đưa vào select)
      },
      relations: { author: true },
      order: { createdAt: 'DESC' },
    });

    return rows.map((row) => this.mapper.toListItem(row));
  }

  async findOne(id: number): Promise<TutorialDetailDto> {
    const row = await this.repo.findOne({
      where: { id },
      relations: { author: true },
      // có thể thêm select cụ thể nếu muốn kiểm soát chặt chẽ hơn
    });
    if (!row) throw new NotFoundException(`Post #${id} not found`);

    return this.mapper.toDetail(row, []);
  }

  async findOneBySlug(slug: string): Promise<TutorialDetailDto> {
    const row = await this.repo.findOne({
      where: { slug },
      relations: { author: true },
    });
    if (!row) throw new NotFoundException(`Post #${slug} not found`);

    // Lấy tags (giữ 2 query cho code rõ ràng; nếu cần tối ưu thành 1 query có thể dùng QB join)
    const tutorialTags = await this.repo.manager.find(TutorialTag, {
      where: { tutorialId: row.id },
      relations: ['tag'],
    });
    const tags: Tag[] = tutorialTags.map((tt) => tt.tag);

    return this.mapper.toDetail(row, tags);
  }

  // ===== helper: check quyền sở hữu (nếu có userId) =====
  private assertOwnership(row: Tutorial, userId?: number) {
    if (userId == null) return; // test cũ: không check
    if (row.authorId !== userId) {
      throw new ForbiddenException('Not owner of this tutorial');
    }
  }

  // ================= UPDATE =================
  update(id: number, dto: UpdateTutorialDto): Promise<Tutorial>;
  update(id: number, dto: UpdateTutorialDto, userId: number): Promise<Tutorial>;
  async update(
    id: number,
    dto: UpdateTutorialDto,
    userId?: number,
  ): Promise<Tutorial> {
    const row = await this.repo.findOne({ where: { id } });
    if (!row) throw new NotFoundException(`Post #${id} not found`);

    //this.assertOwnership(row, userId); (block update tutorial by other user)

    // Không cho sửa authorId qua body
    const {
      author_id,
      authorId,
      views,
      createdAt,
      updatedAt,
      id: _id,
      ...rest
    } = dto as any;

    // Nếu client gửi title/content nhưng là chuỗi rỗng → chặn
    if (
      'title' in rest &&
      typeof rest.title === 'string' &&
      rest.title.trim() === ''
    ) {
      throw new BadRequestException('title cannot be empty');
    }
    if (
      'content' in rest &&
      typeof rest.content === 'string' &&
      rest.content.trim() === ''
    ) {
      throw new BadRequestException('content cannot be empty');
    }

    // Chỉ merge các field được phép & có giá trị defined
    const allowed: (keyof UpdateTutorialDto)[] = ['title', 'content']; // mở rộng: 'status', 'tags'...
    for (const key of allowed) {
      const v = rest[key];
      if (typeof v !== 'undefined') {
        // đã trim ở DTO; nếu muốn đảm bảo:
        if (typeof v === 'string') (row as any)[key] = v.trim();
        else (row as any)[key] = v;
      }
    }

    // gán các field khác (vd: tags, status…)
    //Object.assign(row, rest); lấy toàn bộ object copy tất cả thuộc tính từ object này sang object khác trong khi ở trên có whitelist -> có thể xóa

    return this.repo.save(row);
  }

  // ================= REMOVE =================
  remove(id: number): Promise<{ id: number }>;
  remove(id: number, userId: number): Promise<{ id: number }>;
  async remove(id: number, userId?: number): Promise<{ id: number }> {
    const row = await this.repo.findOne({ where: { id } });
    if (!row) throw new NotFoundException(`Post #${id} not found`);

    this.assertOwnership(row, userId);

    await this.repo.remove(row);
    return { id };
  }
}
