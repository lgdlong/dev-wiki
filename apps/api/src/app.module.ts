import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TutorialModule } from './modules/tutorial/tutorial.module';
import { AccountModule } from './modules/account/account.module';
import { ProductsModule } from './modules/products/products.module';
import { VideosModule } from './modules/videos/videos.module';
import { TagsModule } from './modules/tags/tags.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { CommentsModule } from './modules/comments/comments.module';
import { VotesModule } from './modules/votes/votes.module';
import { ProductCategoriesModule } from './modules/product-categories/product-categories.module';
import { TutorialTagsModule } from './modules/tutorial-tags/tutorial-tags.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { GoogleStrategy } from './modules/auth/google.strategy';
import { VideoTagsModule } from './modules/video-tags/video-tags.module';
import databaseConfig from './config/database.config';
import { envValidationSchema } from './config/validation';
import { Account } from './modules/account/entities/account.entity';
import { Tutorial } from './modules/tutorial/entities/tutorial.entity';
import { Product } from './modules/products/entities/product.entity';
import { Video } from './modules/videos/entities/video.entity';
import { Tag } from './modules/tags/entities/tag.entity';
import { Category } from './modules/categories/entities/category.entity';
import { Comment } from './modules/comments/entities/comment.entity';
import { TutorialTag } from './modules/tutorial-tags/entities/tutorial-tag.entity';
import { Vote } from './modules/votes/entities/vote.entity';
import { ProductCategory } from './modules/product-categories/entities/product-category.entity';
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
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST'),
        port: Number(config.get<number>('DB_PORT') ?? 5432),
        username: config.get<string>('USERNAME'),
        password: config.get<string>('PASSWORD'),
        database: config.get<string>('DB_NAME'),

        entities: [
          Account,
          Tutorial,
          Product,
          Video,
          Tag,
          Category,
          Comment,
          Vote,
          ProductCategory,
          TutorialTag,
          VideoTag,
        ],

        autoLoadEntities: true,
        synchronize: true, // ⚠️ chỉ dev mới nên bật, nhưng giờ bạn không check NODE_ENV thì luôn bật
        retryAttempts: 5,
        retryDelay: 3000,
        logging: true, // luôn bật log

        extra: {
          max: 10,
          min: 2,
          idleTimeoutMillis: 600_000,
          connectionTimeoutMillis: 60_000,
        },
      }),
    }),
    AccountModule,
    TutorialModule,
    ProductsModule,
    VideosModule,
    TagsModule,
    CategoriesModule,
    CommentsModule,
    VotesModule,
    ProductCategoriesModule,
    TutorialTagsModule,
    AuthModule,
    VideoTagsModule,
  ],
  controllers: [AppController],
  providers: [AppService, GoogleStrategy],
})
export class AppModule {}
