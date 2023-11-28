import { Test, TestingModule } from '@nestjs/testing';
import { AskService } from './ask.service';

describe('AskService', () => {
  let service: AskService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AskService],
    }).compile();

    service = module.get<AskService>(AskService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
