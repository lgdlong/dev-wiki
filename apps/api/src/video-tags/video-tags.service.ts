// src/video-tags/video-tags.service.ts
import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, QueryFailedError, Repository } from 'typeorm';
import { VideoTag } from './entities/video-tag.entity';
import { Video } from '../videos/entities/video.entity';
import { Tag } from '../tags/entities/tag.entity';
import { CreateVideoTagDto } from './dto/create-video-tag.dto';
import { UpsertVideoTagsDto } from './dto/upsert-video-tag.dto';

@Injectable()
export class VideoTagsService {
  constructor(
    @InjectRepository(VideoTag)
    private readonly videoTagRepo: Repository<VideoTag>,
    @InjectRepository(Video) private readonly videoRepo: Repository<Video>,
    @InjectRepository(Tag) private readonly tagRepo: Repository<Tag>,
  ) {}

  async attachOne(dto: CreateVideoTagDto, createdBy?: number) {
    const [video, tag] = await Promise.all([
      this.videoRepo.findOne({ where: { id: dto.videoId } }),
      this.tagRepo.findOne({ where: { id: dto.tagId } }),
    ]);
    if (!video) throw new NotFoundException('Video not found');
    if (!tag) throw new NotFoundException('Tag not found');

    const exists = await this.videoTagRepo.findOne({
      where: { video: { id: video.id }, tag: { id: tag.id } },
      relations: ['video', 'tag'],
    });
    if (exists) throw new ConflictException('Mapping already exists');

    try {
      const vt = this.videoTagRepo.create({
        video,
        tag,
        createdBy: createdBy ?? null,
      });
      return await this.videoTagRepo.save(vt);
    } catch (e) {
      // PostgreSQL duplicate key
      if (
        e instanceof QueryFailedError &&
        (e as any).driverError?.code === '23505'
      ) {
        throw new ConflictException('Mapping already exists');
      }
      throw e;
    }
  }

  async detachOne(videoId: number, tagId: number): Promise<void> {
    await this.videoTagRepo
      .createQueryBuilder()
      .delete()
      .from(VideoTag)
      .where('"video_id" = :videoId', { videoId })
      .andWhere('"tag_id" = :tagId', { tagId })
      .execute();
  }

  /**
   * Upsert toàn bộ danh sách tag cho 1 video (idempotent).
   *
   * Thuật toán:
   * - Chạy trong 1 transaction.
   * - Kiểm tra video tồn tại.
   * - Tải và xác thực toàn bộ tagIds (nếu thiếu bất kỳ tag nào → NotFound).
   * - Lấy danh sách mapping hiện tại (video_tags).
   * - Tính chênh lệch: toAdd = (nextIds - currentIds), toRemove = (currentIds - nextIds).
   * - Thêm các bản ghi mới (video_id, tag_id, created_by).
   * - Xoá các bản ghi không còn trong danh sách mới.
   * - Trả về danh sách Tag cuối cùng của video.
   *
   * Tính chất:
   * - Idempotent: Gọi nhiều lần với cùng tập tagIds sẽ cho cùng kết quả, không nhân bản.
   * - An toàn đồng thời: Chạy trong transaction → trạng thái nhất quán trong suốt quá trình upsert.
   *
   * Yêu cầu schema/index:
   * - Bảng `video_tags` có UNIQUE (video_id, tag_id).
   * - Index: (video_id), (tag_id) để tăng tốc query.
   * - Entity `VideoTag` nên @JoinColumn({ name: 'video_id' }) / { name: 'tag_id' } nếu cột FK ở dạng snake_case.
   *
   * @param dto       Đối tượng đầu vào gồm:
   *                  - videoId: number — ID của video cần upsert.
   *                  - tagIds: number[] — Danh sách ID tag muốn gắn (không cần sắp xếp, có thể rỗng).
   * @param createdBy (tùy chọn) ID user thực hiện upsert, sẽ được lưu vào cột `created_by` khi tạo bản ghi mới.
   *
   * @returns Promise<Tag[]>  Mảng Tag sau khi upsert (đã là trạng thái cuối cùng).
   *
   * @throws NotFoundException  - Khi video không tồn tại.
   * @throws NotFoundException  - Khi một hoặc nhiều tag trong dto.tagIds không tồn tại.
   * @throws ConflictException  - (hiếm) Nếu vi phạm UNIQUE do race condition khác (thường đã tránh nhờ transaction).
   *
   * @example
   * await service.upsertForVideo({ videoId: 42, tagIds: [1, 2, 3] }, currentUserId);
   * // → Gắn đúng 3 tag {1,2,3} cho video #42, các tag khác trước đó sẽ bị gỡ.
   */
  async upsertForVideo(dto: UpsertVideoTagsDto, createdBy?: number) {
    return this.videoTagRepo.manager.transaction(async (em) => {
      const videoRepo = em.getRepository(Video);
      const tagRepo = em.getRepository(Tag);
      const vtRepo = em.getRepository(VideoTag);

      const video = await videoRepo.findOne({ where: { id: dto.videoId } });
      if (!video) throw new NotFoundException('Video not found');

      const tags = dto.tagIds.length
        ? await tagRepo.find({ where: { id: In(dto.tagIds) } })
        : [];
      if (tags.length !== dto.tagIds.length)
        throw new NotFoundException('Some tags not found');

      const current = await vtRepo.find({
        where: { video: { id: video.id } },
        relations: ['tag'],
      });
      const currentIds = new Set(current.map((c) => c.tag.id));
      const nextIds = new Set(dto.tagIds);

      const toAdd = [...nextIds].filter((id) => !currentIds.has(id));
      const toRemove = [...currentIds].filter((id) => !nextIds.has(id));

      if (toAdd.length) {
        const addEntities = tags
          .filter((t) => toAdd.includes(t.id))
          .map((tag) =>
            vtRepo.create({ video, tag, createdBy: createdBy ?? null }),
          );
        await vtRepo.save(addEntities);
      }

      if (toRemove.length) {
        await vtRepo
          .createQueryBuilder()
          .delete()
          .from(VideoTag)
          .where('"video_id" = :videoId', { videoId: video.id })
          .andWhere('"tag_id" IN (:...ids)', { ids: toRemove })
          .execute();
      }

      // trả về tags cuối cùng
      const rows = await vtRepo.find({
        where: { video: { id: video.id } },
        relations: ['tag'],
        order: { id: 'ASC' },
      });
      return rows.map((r) => r.tag);
    });
  }

  async findTagsByVideo(videoId: number): Promise<Tag[]> {
    const rows = await this.videoTagRepo.find({
      where: { video: { id: videoId } },
      relations: ['tag'],
      order: { id: 'ASC' },
    });
    return rows.map((r) => r.tag);
  }

  async findVideosByTag(tagId: number) {
    const rows = await this.videoTagRepo.find({
      where: { tag: { id: tagId } },
      relations: ['video'],
      order: { id: 'ASC' },
    });
    return rows.map((r) => r.video);
  }
}
