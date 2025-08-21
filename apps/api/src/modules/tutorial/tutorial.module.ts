import { Module } from '@nestjs/common';
import { TutorialService } from './tutorial.service';
import { TutorialController } from './tutorial.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tutorial } from './entities/tutorial.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Tutorial])],
  controllers: [TutorialController],
  providers: [TutorialService],
  exports: [TutorialService], // để xài module khác
})
export class TutorialModule {}
