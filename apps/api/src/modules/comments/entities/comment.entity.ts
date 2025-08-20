import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { Account } from '../../account/entities/account.entity';
import { EntityType } from '../../../shared/enums/entity-type.enum';

@Entity({ name: 'comments' })
@Index(['entityType', 'entityId'])
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', nullable: false })
  content: string;

  @Column({ name: 'author_id', nullable: false })
  authorId: number;

  @ManyToOne(() => Account)
  @JoinColumn({ name: 'author_id' })
  author: Account;

  @Column({ name: 'parent_id', nullable: true })
  parentId: number;

  @ManyToOne(() => Comment, (comment) => comment.replies, { nullable: true })
  @JoinColumn({ name: 'parent_id' })
  parent: Comment;

  @OneToMany(() => Comment, (comment) => comment.parent)
  replies: Comment[];

  @Column({
    name: 'entity_type',
    type: 'enum',
    enum: EntityType,
    nullable: false,
  })
  entityType: EntityType;

  @Column({ name: 'entity_id', type: 'bigint', nullable: false })
  entityId: number;

  @Column({ type: 'bigint', default: 0 })
  upvotes: number;

  @Column({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
