// src/video-tags/entities/video-tag.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Unique,
  CreateDateColumn,
  Index,
  Column,
  JoinColumn,
} from 'typeorm';
import { Video } from '../../videos/entities/video.entity';
import { Tag } from '../../tags/entities/tag.entity';

@Entity('video_tags')
@Unique(['video', 'tag'])
@Index('idx_video_tags_video_id', ['video'])
@Index('idx_video_tags_tag_id', ['tag'])
export class VideoTag {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Video, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'video_id' })
  video: Video;

  @ManyToOne(() => Tag, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tag_id' })
  tag: Tag;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column({ name: 'created_by', type: 'int', nullable: true })
  createdBy?: number | null;
}
