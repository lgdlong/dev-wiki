import { Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from './entities/account.entity';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([Account])],
  exports: [TypeOrmModule, AccountService],
  controllers: [AccountController],
  providers: [AccountService, ConfigService],
})
export class AccountModule {}
