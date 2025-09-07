// apps/api/src/modules/tutorials/mappers/tutorials.mapper.ts
import { Injectable } from '@nestjs/common';
import { Tutorial } from '../entities/tutorials.entity';
import { TutorialDetailDto, TutorialListItemDto } from '../dto/tutorials.dto';
import { Tag } from '../../tags/entities/tag.entity';
import {
  DEFAULT_AUTHOR_NAME,
  DEFAULT_AVATAR_URL,
} from '../../../shared/constants';

@Injectable()
export class TutorialMapper {
  toListItem(row: Tutorial): TutorialListItemDto {
    return {
      id: row.id,
      title: row.title,
      slug: row.slug,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      authorName: row.author?.name || DEFAULT_AUTHOR_NAME,
    };
  }

  toDetail(row: Tutorial, tags: Tag[] = []): TutorialDetailDto {
    return {
      id: row.id,
      title: row.title,
      content: row.content,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      authorName: row.author?.name || DEFAULT_AUTHOR_NAME,
      authorAvatarUrl: row.author?.avatar_url || DEFAULT_AVATAR_URL,
      slug: row.slug,
      views: row.views,
      isPublished: row.isPublished,
      tags,
    };
  }
}
