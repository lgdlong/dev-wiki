import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TutorialModule } from './tutorial/tutorial.module';
import { AccountModule } from './account/account.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from './account/entities/account.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DB_HOST'),
        port: Number(config.get('DB_PORT')),
        username: config.get('USERNAME'),
        password: config.get('PASSWORD'),
        database: config.get('DB_NAME'),
        entities: [Account],
        synchronize: true,
      }),
    }),
    AccountModule,
    TutorialModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
