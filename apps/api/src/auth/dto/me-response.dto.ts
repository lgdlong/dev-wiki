import { AccountRole } from 'src/common/enums/account-role.enum';
import { AccountStatus } from 'src/common/enums/account-status.enum';

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
