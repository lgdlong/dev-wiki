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
import { MeResponseDto } from './dto/me-response.dto';
import { GoogleOAuthGuard } from '../../core/guards/google-oauth.guard';
import { JwtAuthGuard } from '../../core/guards/jwt-auth.guard';
import { GetUser } from '../../core/decorators/get-user.decorator';
import { Account } from '../account/entities/account.entity';
import { AppService } from '../../app.service';
import { ConfigService } from '@nestjs/config';
import { DEFAULT_FRONTEND_URL } from '../../shared/constants';
import { Response, Request } from 'express';
import { AuthAccountResponse } from './interfaces/auth-account-response.interface';

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
  async login(@Body() dto: LoginDto, @Res() res: Response) {
    const email = dto.email.toLowerCase();
    const password = dto.password.trim();
    const data = await this.authService.validateUser(email, password);
    // Set cookie 'role' for normal login
    res.cookie('role', data.account.role, {
      path: '/',
      httpOnly: false,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });
    return res.json(data);
  }

  // Lấy thông tin người dùng hiện tại
  @Get('me')
  @UseGuards(JwtAuthGuard)
  getCurrentUser(@GetUser() user: Account): MeResponseDto {
    // Loại bỏ password khỏi response
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
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
  googleAuthRedirect(@Req() req: Request, @Res() res: Response) {
    try {
      // Get result from Google OAuth strategy
      const result = this.appService.googleLogin(req);

      if (!('user' in result)) {
        const frontendUrl =
          this.configService.get<string>('FRONTEND_URL') ||
          DEFAULT_FRONTEND_URL;
        return res.redirect(`${frontendUrl}?error=google_auth_failed`);
      }

      // The strategy now returns the login result with access_token and account
      const loginResult = result.user as unknown as {
        access_token: string;
        account: AuthAccountResponse;
      };

      // Validate login result
      if (!loginResult.access_token || !loginResult.account) {
        const frontendUrl =
          this.configService.get<string>('FRONTEND_URL') ||
          DEFAULT_FRONTEND_URL;
        return res.redirect(`${frontendUrl}?error=incomplete_login_data`);
      }

      // Trước khi redirect về FE, set cookie "role"
      res.cookie('role', loginResult.account.role, {
        path: '/',
        httpOnly: false, // middleware đọc được, client-side cũng đọc được nếu muốn
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7, // 1 tuần
      });

      // Redirect to frontend with token in URL params
      const FE_CALLBACK =
        (this.configService.get<string>('FRONTEND_URL') ||
          DEFAULT_FRONTEND_URL) + '/google-callback';

      // Encode the token and user data for URL
      const redirectUrl = `${FE_CALLBACK}?token=${encodeURIComponent(loginResult.access_token)}&provider=google&name=${encodeURIComponent(loginResult.account.name || '')}&email=${encodeURIComponent(loginResult.account.email)}&role=${encodeURIComponent(loginResult.account.role)}`;

      return res.redirect(redirectUrl);
    } catch (err) {
      console.error('Google login redirect error:', err);
      const frontendUrl =
        this.configService.get<string>('FRONTEND_URL') || DEFAULT_FRONTEND_URL;
      return res.redirect(`${frontendUrl}?error=internal_error`);
    }
  }

  // Logout: remove the 'role' cookie
  @Post('logout')
  logout(@Res() res: Response) {
    res.clearCookie('role', {
      path: '/',
      httpOnly: false,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });
    return res.json({ message: 'Logged out successfully' });
  }
}
