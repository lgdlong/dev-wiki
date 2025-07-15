import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { Account } from 'src/account/entities/account.entity';

@Entity({ name: 'tutorials' })
export class Tutorial {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', nullable: false })
  title: string;

  @Column({ type: 'text', nullable: false })
  content: string;

  @Column({ name: 'author_id', nullable: false })
  authorId: number;

  @ManyToOne(() => Account)
  @JoinColumn({ name: 'author_id' })
  author: Account;

  @Column({ type: 'bigint', default: 0 })
  views: number;

  @Column({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
