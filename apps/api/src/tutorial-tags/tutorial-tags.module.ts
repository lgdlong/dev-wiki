import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TutorialTagsService } from './tutorial-tags.service';
import { TutorialTagsController } from './tutorial-tags.controller';
import { TutorialTag } from './entities/tutorial-tag.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TutorialTag])],
  controllers: [TutorialTagsController],
  providers: [TutorialTagsService],
  exports: [TutorialTagsService],
})
export class TutorialTagsModule {}