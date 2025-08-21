import { PartialType } from '@nestjs/mapped-types';
import { CreateTutorialDto } from './create-tutorial.dto';
import { IsInt, IsOptional } from 'class-validator';

export class UpdateTutorialDto extends PartialType(CreateTutorialDto) {
    @IsOptional()
    @IsInt()
    author_id?: number;
}
