import { Module } from '@nestjs/common';
import { AskService } from './ask.service';
import { AskController } from './ask.controller';

@Module({
  controllers: [AskController],
  providers: [AskService],
})
export class AskModule {}
