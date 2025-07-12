// apps/api/src/auth/google.strategy.ts
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

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
    profile: {
      name?: { givenName?: string; familyName?: string };
      emails?: Array<{ value: string }>;
      photos?: Array<{ value: string }>;
      [key: string]: any;
    },
    done: VerifyCallback,
  ): Promise<any> {
    const { name, emails, photos } = profile;
    // TODO: Check DB, tạo user nếu chưa có
    const user = {
      email: emails?.[0]?.value || '',
      firstName: name?.givenName || '',
      lastName: name?.familyName || '',
      picture: photos?.[0]?.value || '',
      // Thường không cần trả accessToken/refreshToken ra ngoài
      accessToken,
      refreshToken,
    };
    done(null, user);
  }
}
