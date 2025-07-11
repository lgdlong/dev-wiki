import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { AccountRole, AccountStatus } from '@dev-wiki/enums'; // Adjust the import path as necessary

@Entity()
export class Account {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  name: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  avatar_url: string;

  @Column({ type: 'enum', enum: AccountRole })
  role: AccountRole;

  @Column({ type: 'enum', enum: AccountStatus })
  status: AccountStatus;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
