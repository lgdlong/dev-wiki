// apps/api/src/modules/tutorials/entities/tutorial.entity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { Account } from '../../account/entities/account.entity';

@Entity({ name: 'tutorials' })
export class Tutorial {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', nullable: false })
  title: string;

  @Column({ type: 'text', nullable: false }) //markdown từ Toast UI
  content: string;

  @Column({ name: 'author_id', nullable: false })
  authorId: number;

  @ManyToOne(() => Account)
  @JoinColumn({ name: 'author_id' })
  author: Account;

  @Column({ type: 'bigint', default: 0 })
  views: number;

  @Index({ unique: true })
  @Column({ type: 'text', nullable: false })
  slug: string;

  @Column({ name: 'is_published', type: 'boolean', default: true })
  isPublished: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
  updatedAt: Date;
}
