import { forwardRef, Module } from '@nestjs/common';
import { CardService } from './card.service';
import { CardGateway } from './card.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Card } from './entities/card.entity';
import { GameModule } from '../game/game.module';
import { CardController } from './card.controller';
import { UsersModule } from '../auth/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Card]),
    forwardRef(() => GameModule),
    UsersModule,
  ],
  providers: [CardGateway, CardService],
  controllers: [CardController],
  exports: [CardService],
})
export class CardModule {}
