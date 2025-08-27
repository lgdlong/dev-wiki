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
import { GoogleOAuthGuard } from '../../core/guards/google-oauth.guard';
import { JwtAuthGuard } from '../../core/guards/jwt-auth.guard';
import { GetUser } from '../../core/decorators/get-user.decorator';
import { Account } from '../account/entities/account.entity';
import { AppService } from '../../app.service';
import { AuthCookiesService } from '../../shared/http/cookies/auth-cookies.service';
import { buildGoogleRedirectUrl } from './auth.helpers';
import { Response, Request } from 'express';
import { AuthAccountResponse } from './interfaces/auth-account-response.interface';

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly appService: AppService,
    private readonly cookies: AuthCookiesService,
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

    // DRY: use service to set cookies
    this.cookies.applyLoginCookies(res, data);

    return res.json(data);
  }

  // Lấy thông tin người dùng hiện tại
  @Get('me')
  @UseGuards(JwtAuthGuard)
  getCurrentUser(@GetUser() user: Account, @Req() req: Request) {
    // Loại bỏ password khỏi response
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user;

    // Try to extract JWT from Authorization header or cookie
    let accessToken: string | undefined = undefined;
    const authHeader = req.headers['authorization'];
    if (authHeader && authHeader.startsWith('Bearer ')) {
      accessToken = authHeader.slice(7);
    } else {
      // Safe cookie access
      const cookies = req.cookies as Record<string, string> | undefined;
      if (cookies) {
        accessToken = cookies.token;
      }
    }

    return {
      user: userWithoutPassword,
      access_token: accessToken,
    };
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
        return res.redirect(
          `${this.cookies.getFrontendUrl()}?error=google_auth_failed`,
        );
      }

      // The strategy now returns the login result with access_token and account
      const loginResult = result.user as unknown as {
        access_token: string;
        account: AuthAccountResponse;
      };

      // Validate login result
      if (!loginResult.access_token || !loginResult.account) {
        return res.redirect(
          `${this.cookies.getFrontendUrl()}?error=incomplete_login_data`,
        );
      }

      // DRY: set cookies via service
      this.cookies.applyLoginCookies(res, loginResult);

      // DRY: build redirect URL
      const redirectUrl = buildGoogleRedirectUrl(
        this.cookies.getFrontendUrl(),
        loginResult.account,
      );

      return res.redirect(redirectUrl);
    } catch (err) {
      console.error('Google login redirect error:', err);
      return res.redirect(
        `${this.cookies.getFrontendUrl()}?error=internal_error`,
      );
    }
  }

  // Logout: remove both JWT token and role cookies
  @Post('logout')
  logout(@Res() res: Response) {
    this.cookies.clearAuthCookies(res);
    return res.json({ message: 'Logged out successfully' });
  }
}
