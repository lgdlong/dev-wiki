import { PartialType } from '@nestjs/mapped-types';
import { CreateTutorialDto } from './create-tutorial.dto';


import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreateTutorialDto } from './create-tutorial.dto';

export class UpdateTutorialDto extends PartialType(
  OmitType(CreateTutorialDto, ['author_id'] as const),
) {
  // Do not allow changing author via update to prevent ownership tampering
  // author_id is intentionally omitted here
}
