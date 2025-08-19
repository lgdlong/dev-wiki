import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TutorialModule } from './tutorial/tutorial.module';
import { AccountModule } from './account/account.module';
import { ProductsModule } from './products/products.module';
import { VideosModule } from './videos/videos.module';
import { TagsModule } from './tags/tags.module';
import { CategoriesModule } from './categories/categories.module';
import { CommentsModule } from './comments/comments.module';
import { VotesModule } from './votes/votes.module';
import { ProductCategoriesModule } from './product-categories/product-categories.module';
import { TutorialTagsModule } from './tutorial-tags/tutorial-tags.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from './account/entities/account.entity';
import { Tutorial } from './tutorial/entities/tutorial.entity';
import { Product } from './products/entities/product.entity';
import { Video } from './videos/entities/video.entity';
import { Tag } from './tags/entities/tag.entity';
import { Category } from './categories/entities/category.entity';
import { Comment } from './comments/entities/comment.entity';
import { Vote } from './votes/entities/vote.entity';
import { ProductCategory } from './product-categories/entities/product-category.entity';
import { TutorialTag } from './tutorial-tags/entities/tutorial-tag.entity';
import { AuthModule } from './auth/auth.module';
import { GoogleStrategy } from './auth/google.strategy';
import { VideoTagsModule } from './video-tags/video-tags.module';

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
        ],
        autoLoadEntities: true,
        synchronize: true,
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
