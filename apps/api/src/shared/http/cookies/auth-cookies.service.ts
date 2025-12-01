import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Response } from 'express';
import { AuthAccountResponse } from '../../../modules/auth/interfaces/auth-account-response.interface';
import { DEFAULT_FRONTEND_URL } from '../../constants';

@Injectable()
export class AuthCookiesService {
  private readonly isProd: boolean;
  private readonly frontendUrl: string;

  constructor(private readonly config: ConfigService) {
    this.isProd = this.config.get<string>('NODE_ENV') === 'production';
    this.frontendUrl =
      this.config.get<string>('FRONTEND_URL') || DEFAULT_FRONTEND_URL;
  }

  /** Set both JWT + role cookies after a successful login */
  applyLoginCookies(
    res: Response,
    payload:
      | { access_token: string; account: AuthAccountResponse } // for OAuth case
      | { access_token: string; account: { role: string } }, // for /login case
  ) {
    this.setTokenCookie(res, payload.access_token);
    this.setRoleCookie(res, payload.account.role);
  }

  setTokenCookie(res: Response, token: string) {
    res.cookie('token', token, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: this.isProd,
      maxAge: 60 * 60 * 24 * 7, // 1 week (ms accepted by Express)
    });
  }

  setRoleCookie(res: Response, role: string) {
    res.cookie('role', role, {
      path: '/',
      httpOnly: false, // vẫn cho client đọc (backward compatibility)
      sameSite: 'lax',
      secure: this.isProd,
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });
  }

  /** Clear all auth-related cookies */
  clearAuthCookies(res: Response) {
    res.clearCookie('token', {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: this.isProd,
    });

    res.clearCookie('role', {
      path: '/',
      httpOnly: false,
      sameSite: 'lax',
      secure: this.isProd,
    });
  }

  /** Safe getter để dùng ở controller khác */
  getFrontendUrl(): string {
    return this.frontendUrl;
  }
}
