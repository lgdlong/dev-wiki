import { IsEmail, IsNotEmpty, MinLength, IsString } from 'class-validator';

export class RegisterUserDto {
  @IsNotEmpty({ message: 'Email is required!' })
  @IsEmail({}, { message: 'Please provide a valid email!' })
  email: string;

  @IsNotEmpty({ message: 'Name is required!' })
  @IsString({ message: 'Name must be a string!' })
  name: string;

  @IsNotEmpty({ message: 'Password is required!' })
  @MinLength(8, { message: 'Password must be at least 8 characters.' })
  password: string;
}
