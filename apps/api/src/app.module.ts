import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TutorialModule } from './modules/tutorials/tutorials.module';
import { AccountModule } from './modules/account/account.module';
import { VideosModule } from './modules/videos/videos.module';
import { TagsModule } from './modules/tags/tags.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { CommentsModule } from './modules/comments/comments.module';
import { VotesModule } from './modules/votes/votes.module';
import { TutorialTagsModule } from './modules/tutorials-tags/tutorials-tags.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { GoogleStrategy } from './modules/auth/google.strategy';
import { VideoTagsModule } from './modules/video-tags/video-tags.module';
import databaseConfig from './config/database.config';
import { envValidationSchema } from './config/validation';
import { Account } from './modules/account/entities/account.entity';
import { Tutorial } from './modules/tutorials/entities/tutorials.entity';
import { Video } from './modules/videos/entities/video.entity';
import { Tag } from './modules/tags/entities/tag.entity';
import { Category } from './modules/categories/entities/category.entity';
import { Comment } from './modules/comments/entities/comment.entity';
import { TutorialTag } from './modules/tutorials-tags/entities/tutorials-tag.entity';
import { Vote } from './modules/votes/entities/vote.entity';
import { VideoTag } from './modules/video-tags/entities/video-tag.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
      load: [databaseConfig],
      validationSchema: envValidationSchema,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const isDev = config.get<string>('NODE_ENV') === 'development';

        return {
          type: 'postgres',
          host: config.get<string>('DB_HOST'),
          port: Number(config.get<number>('DB_PORT') ?? 5432),
          username: config.get<string>('USERNAME'),
          password: config.get<string>('PASSWORD'),
          database: config.get<string>('DB_NAME'),
          entities: [
            Account,
            Tutorial,
            Video,
            Tag,
            Category,
            Comment,
            Vote,
            TutorialTag,
            VideoTag,
          ],
          autoLoadEntities: true,
          synchronize: isDev, // chỉ tự động đồng bộ hóa CSDL ở môi trường development
          retryAttempts: 5,
          retryDelay: 3000,
          logging: isDev, // chỉ bật log ở môi trường development
          extra: {
            max: 10,
            min: 2,
            idleTimeoutMillis: 600_000,
            connectionTimeoutMillis: 60_000,
          },
        };
      },
    }),
    AccountModule,
    TutorialModule,
    VideosModule,
    TagsModule,
    CategoriesModule,
    CommentsModule,
    VotesModule,
    TutorialTagsModule,
    AuthModule,
    VideoTagsModule,
  ],
  controllers: [AppController],
  providers: [AppService, GoogleStrategy],
})
export class AppModule {}
