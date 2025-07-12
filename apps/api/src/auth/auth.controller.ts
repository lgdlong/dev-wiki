import {
  Controller,
  Get,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Res,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { GoogleOAuthGuard } from 'src/common/guards/google-oauth.guard';
import { AppService } from 'src/app.service';
import { ConfigService } from '@nestjs/config';
import { DEFAULT_FRONTEND_URL } from 'src/common/constants';
import { Response, Request } from 'express';

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly appService: AppService,
    private readonly configService: ConfigService,
  ) {}

  // Đăng ký tài khoản
  @Post('register')
  async register(@Body() dto: RegisterUserDto) {
    const user = await this.authService.register(dto);
    return {
      message: 'Register successful!',
      user,
    };
  }

  // Đăng nhập
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto) {
    const email = dto.email.toLowerCase();
    const password = dto.password.trim();
    const data = await this.authService.validateUser(email, password);
    return data;
  }

  // Bắt đầu Google OAuth
  @Get('google')
  @UseGuards(GoogleOAuthGuard)
  async googleAuth() {
    // Để trống, Passport sẽ tự động redirect sang Google
  }

  // Google OAuth callback
  @Get('google-redirect')
  @UseGuards(GoogleOAuthGuard)
  async googleAuthRedirect(@Req() req: Request, @Res() res: Response) {
    try {
      await this.appService.googleLogin(req);

      const frontendUrl =
        this.configService.get<string>('FRONTEND_URL') || DEFAULT_FRONTEND_URL;
      return res.redirect(frontendUrl);
    } catch (err) {
      // Nếu có lỗi, log và trả về thông báo
      console.error('Google login redirect error:', err);
      return res.status(500).send('Internal Server Error');
    }
  }
}
