import { IsEmail, IsEnum, IsNotEmpty, MinLength } from 'class-validator';
import { AccountRole } from 'src/common/enums/account-role.enum';

export class CreateAccountDto {
  @IsEmail({}, { message: 'Please provide a valid email!' })
  email: string;

  @IsNotEmpty({ message: 'Name is required!' })
  name: string;

  @IsNotEmpty()
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  password: string;

  @IsNotEmpty()
  avatar_url: string;

  @IsEnum(AccountRole)
  role: AccountRole;
}
