import { AccountRole } from '../../../shared/enums/account-role.enum';
import { AccountStatus } from '../../../shared/enums/account-status.enum';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'accounts' })
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
  avatar_url?: string;

  @Column({ type: 'enum', enum: AccountRole, default: AccountRole.USER })
  role: AccountRole;

  @Column({ type: 'enum', enum: AccountStatus, default: AccountStatus.ACTIVE })
  status: AccountStatus;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
