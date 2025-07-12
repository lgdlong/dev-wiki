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
import { GoogleOAuthGuard } from 'src/common/guards/google-oauth.guard';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { Account } from 'src/account/entities/account.entity';
import { AppService } from 'src/app.service';
import { ConfigService } from '@nestjs/config';
import { DEFAULT_FRONTEND_URL } from 'src/common/constants';
import { Response, Request } from 'express';
import { GoogleProfile } from './interfaces/google-profile.interface';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { AccountRole } from 'src/common/enums/account-role.enum';

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
  async googleAuthRedirect(@Req() req: Request, @Res() res: Response) {
    try {
      // Get user data from Google OAuth
      const result = this.appService.googleLogin(req);

      if (!('user' in result)) {
        const frontendUrl =
          this.configService.get<string>('FRONTEND_URL') ||
          DEFAULT_FRONTEND_URL;
        return res.redirect(`${frontendUrl}?error=google_auth_failed`);
      }

      const user: GoogleProfile = result.user;

      // Create JWT payload for Google user
      const payload: JwtPayload = {
        sub: user.googleId, // Use googleId as sub for Google users
        email: user.email,
        role: AccountRole.USER, // Default role for Google login
        name: user.name,
        avatar: user.avatar,
        provider: user.provider ?? 'google',
      };

      // Generate JWT token
      const access_token = this.authService.generateJwt(payload);

      // Redirect to frontend with token in URL params
      const FE_CALLBACK =
        (this.configService.get<string>('FRONTEND_URL') ||
          DEFAULT_FRONTEND_URL) + '/google-callback';

      // Encode the token and user data for URL
      const redirectUrl = `${FE_CALLBACK}?token=${encodeURIComponent(access_token)}&provider=google&name=${encodeURIComponent(user.name)}&email=${encodeURIComponent(user.email)}`;

      return res.redirect(redirectUrl);
    } catch (err) {
      console.error('Google login redirect error:', err);
      const frontendUrl =
        this.configService.get<string>('FRONTEND_URL') || DEFAULT_FRONTEND_URL;
      return res.redirect(`${frontendUrl}?error=internal_error`);
    }
  }
}
