import { Injectable } from '@nestjs/common';
import { CreateTutorialDto } from './dto/create-tutorial.dto';
import { UpdateTutorialDto } from './dto/update-tutorial.dto';

@Injectable()
export class TutorialService {
  create(createTutorialDto: CreateTutorialDto) {
    return 'This action adds a new tutorial';
  }

  findAll() {
    return `This action returns all tutorial`;
  }

  findOne(id: number) {
    return `This action returns a #${id} tutorial`;
  }

  update(id: number, updateTutorialDto: UpdateTutorialDto) {
    return `This action updates a #${id} tutorial`;
  }

  remove(id: number) {
    return `This action removes a #${id} tutorial`;
  }
}
