import { IsEnum, IsOptional, IsDateString, IsString } from 'class-validator';
import { AccountStatus } from '../../../shared/enums/account-status.enum';

export class SetStatusDto {
  @IsEnum(AccountStatus)
  status: AccountStatus;

  @IsOptional()
  @IsString()
  reason?: string;

  @IsOptional()
  @IsDateString()
  expiresAt?: string | null;
}
