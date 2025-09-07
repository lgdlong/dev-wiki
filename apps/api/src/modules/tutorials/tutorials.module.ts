import { Module } from '@nestjs/common';
import { TutorialService } from './tutorials.service';
import { TutorialController } from './tutorials.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tutorial } from './entities/tutorials.entity';
import { TutorialMapper } from './mappers/tutorials.mapper';

@Module({
  imports: [TypeOrmModule.forFeature([Tutorial])],
  controllers: [TutorialController],
  providers: [TutorialService, TutorialMapper],
  exports: [TutorialService], // để xài module khác
})
export class TutorialModule {}
