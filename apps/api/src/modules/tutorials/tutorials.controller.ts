// apps/api/src/modules/tutorials/tutorials.controller.ts
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
  ParseIntPipe,
} from '@nestjs/common';
import { TutorialService } from './tutorials.service';
import { CreateTutorialDto } from './dto/create-tutorials.dto';
import { UpdateTutorialDto } from './dto/update-tutorials.dto';
import { JwtAuthGuard } from 'src/core/guards/jwt-auth.guard';
import { GetUserId } from 'src/core/decorators/get-user-id.decorator';
import { Tutorial } from './entities/tutorials.entity';
import { TutorialDetailDto, TutorialListItemDto } from './dto/tutorials.dto';

@Controller('tutorials')
export class TutorialController {
  constructor(private readonly tutorialService: TutorialService) {}

  // ====== CREATE (yêu cầu đăng nhập) ======
  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Body() dto: CreateTutorialDto,
    @GetUserId() authorId: number,
  ): Promise<Tutorial> {
    if (!Number.isFinite(authorId))
      throw new UnauthorizedException('Invalid user');
    return this.tutorialService.create(dto, authorId);
  }

  // ====== PUBLIC GETS ======
  @Get()
  findAll(): Promise<TutorialListItemDto[]> {
    console.log('[BE] GET /tutorials called');
    return this.tutorialService.findAll(); // trả về TutorialListItemDto[]
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<TutorialDetailDto> {
    return this.tutorialService.findOne(+id); // trả về TutorialDetailDto
  }

  @Get('slug/:slug')
  findOneBySlug(@Param('slug') slug: string): Promise<TutorialDetailDto> {
    return this.tutorialService.findOneBySlug(slug); // trả về TutorialDetailDto
  }

  // ====== UPDATE / DELETE (nên yêu cầu đăng nhập) ======
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTutorialDto,
    @GetUserId() userId: number, // chỉ lấy id nếu muốn (lỗi nếu @GetUser('id'))
  ): Promise<Tutorial> {
    if (!Number.isFinite(userId))
      throw new UnauthorizedException('Invalid user');
    // tuỳ chính sách: có thể check quyền sở hữu trong service
    return this.tutorialService.update(+id, dto, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @GetUserId() userId: number,
  ): Promise<{ id: number }> {
    if (!Number.isFinite(userId))
      throw new UnauthorizedException('Invalid user');
    return this.tutorialService.remove(+id, userId);
  }
}
