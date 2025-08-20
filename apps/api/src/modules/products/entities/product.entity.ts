import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Account } from '../../account/entities/account.entity';

@Entity({ name: 'products' })
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', nullable: false })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ name: 'logo_url', nullable: true })
  logoUrl: string;

  @Column({ name: 'homepage_url', nullable: true })
  homepageUrl: string;

  @Column({ name: 'github_url', nullable: true })
  githubUrl: string;

  @Column({ type: 'text', nullable: true })
  pros: string;

  @Column({ type: 'text', nullable: true })
  cons: string;

  @Column({ name: 'created_by', nullable: false })
  createdBy: number;

  @ManyToOne(() => Account)
  @JoinColumn({ name: 'created_by' })
  creator: Account;

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
