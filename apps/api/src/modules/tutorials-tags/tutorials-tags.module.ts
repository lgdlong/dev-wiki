import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TutorialTagsService } from './tutorials-tags.service';
import { TutorialTagsController } from './tutorials-tags.controller';
import { TutorialTag } from './entities/tutorials-tag.entity';
import { Tutorial } from '../tutorials/entities/tutorials.entity';
import { Tag } from '../tags/entities/tag.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TutorialTag, Tutorial, Tag])],
  controllers: [TutorialTagsController],
  providers: [TutorialTagsService],
  exports: [TutorialTagsService],
})
export class TutorialTagsModule {}
