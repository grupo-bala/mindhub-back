import { PartialType } from '@nestjs/swagger';
import { CreateAskDto } from './create-ask.dto';

export class UpdateAskDto extends PartialType(CreateAskDto) {}
