import { AccountService } from './../account/account.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { AccountRole } from 'src/common/enums/account-role.enum';
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

  // Tạo JWT từ GoogleProfile hoặc Account
  generateJwt(payload: JwtPayload) {
    // Có thể tuỳ chỉnh payload cho phù hợp
    return this.jwtService.sign(payload);
  }
}
