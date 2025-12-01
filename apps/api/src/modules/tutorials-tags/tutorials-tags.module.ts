import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TutorialTagsService } from './tutorials-tags.service';
import { TutorialTagsController } from './tutorials-tags.controller';
import { TutorialTag } from './entities/tutorials-tag.entity';
import { Tutorial } from '../tutorials/entities/tutorials.entity';
import { Tag } from '../tags/entities/tag.entity';
import { Account } from '../account/entities/account.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TutorialTag, Tutorial, Tag, Account])],
  controllers: [TutorialTagsController],
  providers: [TutorialTagsService],
  exports: [TutorialTagsService],
})
export class TutorialTagsModule {}
