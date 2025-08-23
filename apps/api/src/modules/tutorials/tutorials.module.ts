import { Module } from '@nestjs/common';
import { TutorialService } from './tutorials.service';
import { TutorialController } from './tutorials.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tutorial } from './entities/tutorials.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Tutorial])],
  controllers: [TutorialController],
  providers: [TutorialService],
  exports: [TutorialService], // để xài module khác
})
export class TutorialModule {}
