import { Test, TestingModule } from '@nestjs/testing';
import { CardGateway } from './card.gateway';
import { CardService } from './card.service';

describe('CardGateway', () => {
  let gateway: CardGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CardGateway, CardService],
    }).compile();

    gateway = module.get<CardGateway>(CardGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
