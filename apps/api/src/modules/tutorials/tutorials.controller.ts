import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { TutorialService } from './tutorials.service';
import { CreateTutorialDto } from './dto/create-tutorials.dto';
import { UpdateTutorialDto } from './dto/update-tutorials.dto';
import { JwtAuthGuard } from 'src/core/guards/jwt-auth.guard';
import { GetUser } from 'src/core/decorators/get-user.decorator';
import { GetUserId } from 'src/core/decorators/get-user-id.decorator';

@Controller('tutorials')
export class TutorialController {
  constructor(private readonly tutorialService: TutorialService) {}

  // ====== CREATE (yêu cầu đăng nhập) ======
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateTutorialDto, @GetUserId() authorId: number) {
    if (!Number.isFinite(authorId))
      throw new UnauthorizedException('Invalid user');
    return this.tutorialService.create(dto, authorId);
  }

  // ====== PUBLIC GETS ======
  @Get()
  findAll() {
    return this.tutorialService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tutorialService.findOne(+id);
  }

  // ====== UPDATE / DELETE (nên yêu cầu đăng nhập) ======
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateTutorialDto,
    @GetUser('id') userId: number, // chỉ lấy id nếu muốn
  ) {
    if (!Number.isFinite(userId))
      throw new UnauthorizedException('Invalid user');
    // tuỳ chính sách: có thể check quyền sở hữu trong service
    return this.tutorialService.update(+id, dto, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @GetUser('id') userId: number) {
    if (!Number.isFinite(userId))
      throw new UnauthorizedException('Invalid user');
    return this.tutorialService.remove(+id, userId);
  }
}

// // FE nhấn Post -> POST /api/tutorials
// @Post()
// create(@Body() createTutorialDto: CreateTutorialDto) {
//   return this.tutorialService.create(createTutorialDto);
// }

// @Get()
// findAll() {
//   return this.tutorialService.findAll();
// }

// @Get(':id')
// findOne(@Param('id') id: string) {
//   return this.tutorialService.findOne(+id);
// }

// @Patch(':id')
// update(
//   @Param('id') id: string,
//   @Body() updateTutorialDto: UpdateTutorialDto,
// ) {
//   return this.tutorialService.update(+id, updateTutorialDto);
// }

// @Delete(':id')
// remove(@Param('id') id: string) {
//   return this.tutorialService.remove(+id);
// }
