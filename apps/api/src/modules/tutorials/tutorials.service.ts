// src/posts/posts.service.ts
import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tutorial } from './entities/tutorials.entity';
import { CreateTutorialDto } from './dto/create-tutorials.dto';
import { UpdateTutorialDto } from './dto/update-tutorials.dto';

@Injectable()
export class TutorialService {
  constructor(@InjectRepository(Tutorial) private repo: Repository<Tutorial>) { }


  // ✅ Overload signatures
  create(dto: CreateTutorialDto): Promise<Tutorial>;
  create(dto: CreateTutorialDto, authorId: number): Promise<Tutorial>;


  async create(dto: CreateTutorialDto, authorId?: number): Promise<Tutorial> {
    try {
      // (tuỳ chọn) vẫn hỗ trợ body có author_id để quá độ
      type DtoWithAuthorId = CreateTutorialDto & { author_id?: number | string };
      const fromBody = (dto as DtoWithAuthorId).author_id;

      const finalAuthorId =
        authorId ??
        (fromBody !== undefined ? Number(fromBody) : undefined);

      // Nếu DB yêu cầu NOT NULL cho authorId, nên kiểm tra:
      if (finalAuthorId == null) throw new BadRequestException('author_id is required');

      const post = this.repo.create({
        title: dto.title.trim(),
        content: dto.content.trim(),
        authorId: finalAuthorId,  // map snake_case -> camelCase
        views: 0,
      });

      return await this.repo.save(post);
    } catch (e) {
      console.error('TutorialService.create error:', e);
      throw e; // đừng nuốt lỗi, để controller/global filter xử lý
    }
  }

  async findAll() {
    return this.repo.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: number) {
    const row = await this.repo.findOne({ where: { id } });
    if (!row) throw new NotFoundException(`Post #${id} not found`);
    return row;
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

    this.assertOwnership(row, userId);

    // Không cho sửa authorId qua body
    const { author_id, authorId, ...rest } = dto as any;

    if (typeof (rest as any).title === 'string') {
      const t = (rest as any).title.trim();
      if (!t) throw new BadRequestException('title cannot be empty');
      row.title = t;
    }
    if (typeof (rest as any).content === 'string') {
      const c = (rest as any).content.trim();
      if (!c) throw new BadRequestException('content cannot be empty');
      row.content = c;
    }

    // gán các field khác (vd: tags, status…)
    Object.assign(row, rest);

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


// gọn gàn với không valid
  // async create(dto: CreateTutorialDto, authorId?: number): Promise<Tutorial> {
  //   try {
  //     const post = this.repo.create({
  //       title: dto.title.trim(),
  //       content: dto.content.trim(),
  //       authorId: authorId ?? undefined,
  //       views: 0,
  //     });
  //     return this.repo.save(post);
  //   } catch (error) {
  //     console.error("error at tutorials.service" + error);
  //   }
  // }