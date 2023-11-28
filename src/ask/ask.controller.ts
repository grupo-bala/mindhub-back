import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AskService } from './ask.service';
import { CreateAskDto } from './dto/create-ask.dto';
import { UpdateAskDto } from './dto/update-ask.dto';

@Controller('ask')
export class AskController {
  constructor(private readonly askService: AskService) {}

  @Post()
  create(@Body() createAskDto: CreateAskDto) {
    return this.askService.create(createAskDto);
  }

  @Get()
  findAll() {
    return this.askService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.askService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAskDto: UpdateAskDto) {
    return this.askService.update(+id, updateAskDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.askService.remove(+id);
  }
}
