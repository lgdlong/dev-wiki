import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterUserDto } from './dto/register-user.dto';
@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Đăng ký tài khoản
  @Post('register')
  async register(@Body() dto: RegisterUserDto) {
    // Có thể trả về thông tin user hoặc chỉ message tùy policy
    const user = await this.authService.register(dto);
    return {
      message: 'Register successful!',
      user, // hoặc chỉ trả về accessToken nếu muốn
    };
  }

  // Đăng nhập
  @Post('login')
  @HttpCode(HttpStatus.OK) // Không trả 201 cho login, chỉ trả 200
  async login(@Body() dto: LoginDto) {
    const email = dto.email.toLowerCase(); // Chuyển email về chữ thường
    const password = dto.password.trim(); // Loại bỏ khoảng trắng

    const data = await this.authService.validateUser(email, password); // Thường trả về accessToken, refreshToken, user info
    return data;
  }
}
