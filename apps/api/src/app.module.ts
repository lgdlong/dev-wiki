import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TutorialModule } from './tutorial/tutorial.module';
import { AccountModule } from './account/account.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from './account/entities/account.entity';
import { Tutorial } from './tutorial/entities/tutorial.entity';

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
        entities: [Account, Tutorial],
        synchronize: true,
        ssl: {
          rejectUnauthorized: false, // Required for Render.com hosted databases
        },
        // ssl:
        //   process.env.NODE_ENV === 'production'
        //     ? {
        //         rejectUnauthorized: true,
        //       }
        //     : {
        //         rejectUnauthorized: false,
        //       }, // Only for development
        connectTimeoutMS: 60000, // 60 seconds
        acquireTimeoutMillis: 60000,
        timeout: 60000,
        retryAttempts: 5,
        retryDelay: 3000,
        // Connection pool settings for external database
        extra: {
          max: 10, // maximum number of connections in pool
          min: 2, // minimum number of connections in pool
          acquireTimeoutMillis: 60000, // timeout for acquiring connection
          idleTimeoutMillis: 600000, // 10 minutes idle timeout
          connectionTimeoutMillis: 60000,
        },
      }),
    }),
    AccountModule,
    TutorialModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
