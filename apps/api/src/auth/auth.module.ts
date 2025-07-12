import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AccountModule } from 'src/account/account.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { AppService } from 'src/app.service';

@Module({
  imports: [
    AccountModule,
    PassportModule,
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: '24h',
        },
      }),
      inject: [ConfigService],
      global: true,
    }),
  ],
  exports: [AuthService],
  controllers: [AuthController],
  providers: [LocalStrategy, AuthService, JwtStrategy, AppService],
})
export class AuthModule {}
