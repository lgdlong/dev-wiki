import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { Account } from 'src/account/entities/account.entity';
import { EntityType } from 'src/common/enums/entity-type.enum';
import { VoteType } from 'src/common/enums/vote-type.enum';

@Entity({ name: 'votes' })
@Index(['userId', 'entityType', 'entityId'], { unique: true })
export class Vote {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id', nullable: false })
  userId: number;

  @ManyToOne(() => Account)
  @JoinColumn({ name: 'user_id' })
  user: Account;

  @Column({ name: 'entity_id', type: 'bigint', nullable: false })
  entityId: number;

  @Column({ name: 'entity_type', type: 'enum', enum: EntityType, nullable: false })
  entityType: EntityType;

  @Column({ name: 'vote_type', type: 'enum', enum: VoteType, nullable: false })
  voteType: VoteType;

  @Column({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}