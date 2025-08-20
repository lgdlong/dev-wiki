import { AccountService } from '../account/account.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { AccountRole } from '../../shared/enums/account-role.enum';
import { AuthAccountResponse } from './interfaces/auth-account-response.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly accountService: AccountService,
    private readonly jwtService: JwtService,
  ) {}

  // validateUser là tên hàm chuẩn của Passport Local Strategy
  // Hàm này sẽ được gọi khi người dùng đăng nhập
  // Không thay đổi tên hàm này để Passport có thể nhận diện
  async validateUser(
    email: string,
    pass: string,
  ): Promise<{
    access_token: string;
    account: AuthAccountResponse;
  }> {
    // 1. Tìm tài khoản theo email
    const account = await this.accountService.findByEmail(email);

    // 2. Kiểm tra tài khoản có tồn tại không và mật khẩu có khớp không
    if (!account) {
      throw new UnauthorizedException('Invalid credentials!');
    }

    // So sánh mật khẩu đã hash bằng bcrypt với mật khẩu người dùng nhập vào
    const isMatch = await bcrypt.compare(pass, account.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials!');
    }

    // 3. Tạo JWT token
    // Tạo payload cho JWT, có thể thêm thông tin khác nếu cần
    const payload: JwtPayload = {
      sub: account.id,
      email: account.email,
      role: account.role,
      name: account.name,
    };

    return {
      // Sử dụng JwtService để tạo token từ payload
      // access_token là tên chuẩn, có thể đổi nếu cần
      access_token: await this.jwtService.signAsync(payload),
      // Tra trả thông tin tài khoản đã loại bỏ mật khẩu
      account: {
        id: account.id,
        email: account.email,
        role: account.role,
        name: account.name,
        avatar_url: account.avatar_url,
      },
    };
  }

  async register(dto: RegisterUserDto) {
    // Let AccountService.create() handle all validation and processing
    // (email normalization, existence checking, password hashing)
    await this.accountService.create({
      ...dto,
      role: AccountRole.USER, // Default role for registration
    });

    // Return success message without exposing user data
    return {
      message: 'Registration successful! Please login to continue.',
    };
  }

  // Handle Google login: create user if not exists, then generate JWT
  async handleGoogleLogin(googleProfile: {
    googleId: string;
    email: string;
    name: string;
    avatar?: string;
    provider: string;
    emailVerified?: boolean;
  }): Promise<{
    access_token: string;
    account: AuthAccountResponse;
  }> {
    // 1. Check if user exists by email
    let account = await this.accountService.findByEmail(googleProfile.email);

    // 2. If user doesn't exist, create a new one
    if (!account) {
      // Create a new account for Google user
      // Generate a random password for Google users (they won't use it)
      const randomPassword =
        Math.random().toString(36).slice(-12) +
        Math.random().toString(36).slice(-12);

      account = await this.accountService.create({
        email: googleProfile.email,
        name: googleProfile.name,
        password: randomPassword, // Google users won't use this password
        role: AccountRole.USER, // Default role for Google users
      });

      // Update avatar if provided
      if (googleProfile.avatar && account.id) {
        await this.accountService.update(account.id, {
          avatar_url: googleProfile.avatar,
        });
        account.avatar_url = googleProfile.avatar;
      }
    }

    // 3. Generate JWT token with the database user ID
    const payload: JwtPayload = {
      sub: account.id, // Use database user ID, not googleId
      email: account.email,
      role: account.role,
      name: account.name,
      avatar: account.avatar_url,
      provider: googleProfile.provider,
    };

    return {
      access_token: this.jwtService.sign(payload),
      account: {
        id: account.id,
        email: account.email,
        role: account.role,
        name: account.name,
        avatar_url: account.avatar_url,
      },
    };
  }

  // Tạo JWT từ GoogleProfile hoặc Account
  generateJwt(payload: JwtPayload) {
    // Có thể tuỳ chỉnh payload cho phù hợp
    return this.jwtService.sign(payload);
  }
}
