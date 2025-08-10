import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'videos' })
export class Video {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'youtube_id', nullable: false, unique: true })
  youtubeId: string;

  @Column({ type: 'text', nullable: false })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ name: 'thumbnail_url', type: 'text', nullable: true })
  thumbnailUrl: string;

  @Column({ type: 'bigint', nullable: true, comment: 'duration in seconds' })
  duration: number;

  @Column({ name: 'uploader_id', type: 'bigint', nullable: true })
  uploaderId: number;

  @Column({ name: 'channel_title', type: 'text', nullable: true })
  channelTitle: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  @Column({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;
}
