import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Game } from './game/entities/game.entity';
import { Card } from './card/entities/card.entity';
import { GameModule } from './game/game.module';
import { CardModule } from './card/card.module';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from './auth/auth.module';
import { User } from './auth/user.entity';
import { RouterModule } from '@nestjs/core';
import { UsersModule } from './auth/users.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConstantsModule } from './constants/constants.module';
import { PriceModule } from './price/price.module';
import { Price } from './price/entities/price.entity';

@Module({
  imports: [
    GameModule,
    CardModule,
    ConstantsModule,
    PriceModule,
    RouterModule.register([
      {
        path: 'api',
        children: [
          {
            path: 'games',
            module: GameModule,
          },
          {
            path: 'cards',
            module: CardModule,
          },
          {
            path: 'users',
            module: UsersModule,
          },
          {
            path: 'prices',
            module: PriceModule,
          },
          {
            path: 'constants',
            module: ConstantsModule,
          },
        ],
      },
    ]),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db/database.sqlite',
      entities: [Game, Card, User, Price],
      synchronize: true,
    }),
    AuthModule,
    TypeOrmModule.forFeature([Game, Card, Price]),
    PassportModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
