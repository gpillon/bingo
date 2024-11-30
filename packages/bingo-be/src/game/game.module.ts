import { forwardRef, Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameGateway } from './game.gateway';
import { GameController } from './game.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Game } from './entities/game.entity';
import { User } from '../auth/user.entity';
import { UsersModule } from '../auth/users.module';
import { AuthModule } from '../auth/auth.module';
import { CardModule } from 'src/card/card.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Game, User]),
    UsersModule,
    AuthModule,
    forwardRef(() => CardModule),
  ],
  providers: [GameGateway, GameService],
  controllers: [GameController],
  exports: [GameService],
})
export class GameModule {}
