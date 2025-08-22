import { PartialType } from '@nestjs/mapped-types';
import { CreateTutorialDto } from './create-tutorial.dto';


export class UpdateTutorialDto extends PartialType(CreateTutorialDto) {
  // Do not allow changing author via update to prevent ownership tampering
  // author_id is intentionally omitted here
}
