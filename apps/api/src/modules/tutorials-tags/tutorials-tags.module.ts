import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TutorialTagsService } from './tutorials-tags.service';
import { TutorialTagsController } from './tutorials-tags.controller';
import { TutorialTag } from './entities/tutorials-tag.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TutorialTag])],
  controllers: [TutorialTagsController],
  providers: [TutorialTagsService],
  exports: [TutorialTagsService],
})
export class TutorialTagsModule {}
