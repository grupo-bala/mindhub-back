import { Test, TestingModule } from '@nestjs/testing';
import { AskController } from './ask.controller';
import { AskService } from './ask.service';

describe('AskController', () => {
  let controller: AskController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AskController],
      providers: [AskService],
    }).compile();

    controller = module.get<AskController>(AskController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
