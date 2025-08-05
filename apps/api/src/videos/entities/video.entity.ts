import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'videos' })
export class Video {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'youtube_id', nullable: false })
  youtubeId: string;

  @Column({ type: 'text', nullable: true })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ name: 'thumbnail_url', type: 'text', nullable: true })
  thumbnailUrl: string;

  @Column({ type: 'bigint', nullable: true, comment: 'duration in seconds' })
  duration: number;

  @Column({ type: 'text', nullable: true })
  uploader: string;

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
