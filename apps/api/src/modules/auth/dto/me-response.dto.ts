import { AccountRole } from '../../../shared/enums/account-role.enum';
import { AccountStatus } from '../../../shared/enums/account-status.enum';

export class MeResponseDto {
  id: number;
  email: string;
  name: string;
  role: AccountRole;
  avatar_url?: string;
  status: AccountStatus;
  createdAt: Date;
  updatedAt: Date;
}
