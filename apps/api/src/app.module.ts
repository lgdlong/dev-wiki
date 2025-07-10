import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TutorialModule } from './tutorial/tutorial.module';
import { AccountModule } from './account/account.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    AccountModule,
    TutorialModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
