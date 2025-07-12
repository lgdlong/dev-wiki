// apps/api/src/auth/google.strategy.ts
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleProfile } from './interfaces/google-profile.interface'; // Đường dẫn tương đối tuỳ cấu trúc
import { RawGoogleProfile } from './interfaces/raw-google-profile.interface';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(configService: ConfigService) {
    super({
      clientID: configService.getOrThrow<string>('GOOGLE_CLIENT_ID'),
      clientSecret: configService.getOrThrow<string>('GOOGLE_CLIENT_SECRET'),
      callbackURL: configService.getOrThrow<string>('GOOGLE_CALLBACK_URL'),
      scope: ['email', 'profile'],
      // passReqToCallback: true,
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: RawGoogleProfile,
    done: VerifyCallback,
  ) {
    // Dùng interface GoogleProfile
    const user: GoogleProfile = {
      googleId: profile.id,
      email: profile.emails?.[0]?.value || profile._json?.email || '',
      emailVerified: profile._json?.email_verified ?? true,
      name: profile.displayName || profile._json?.name || '',
      givenName: profile._json?.given_name || profile.name?.givenName || '',
      avatar: profile.photos?.[0]?.value || profile._json?.picture || '',
      provider: profile.provider,
    };
    // TODO: Lưu user vào DB hoặc check tồn tại, sinh JWT cho user này...
    done(null, user);
  }
}
