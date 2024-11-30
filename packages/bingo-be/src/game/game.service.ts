import {
  forwardRef,
  Inject,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import { Game } from './entities/game.entity';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';

import { IGameStatus, VARIANTS } from './game.types';
import { GameGateway } from './game.gateway';
import { GenerateExtractions } from 'src/utlis/gen-numbers.funtion';
import { CardService } from '../card/card.service';
import { CreateCardDto } from '../card/dto/create-card.dto';

@Injectable()
export class GameService {
  constructor(
    @InjectRepository(Game)
    private gameRepository: Repository<Game>,
    private gameGateway: GameGateway,
    @Inject(forwardRef(() => CardService))
    private cardService: CardService,
  ) {}

  async create(
    createGameDto: CreateGameDto & Partial<{ owner: { id: number } }>,
  ): Promise<Game> {
    if (!createGameDto.owner) {
      createGameDto.owner = { id: 1 };
    }
    const game = this.gameRepository.create(createGameDto) as unknown as Game;
    return this.gameRepository.save(game);
  }

  async findAll(userFilter?: number): Promise<Game[]> {
    const select: FindManyOptions<Game> = {};
    if (userFilter) {
      select.where = [
        { owner: { id: userFilter } },
        { allowedUsers: { id: userFilter } },
      ];
      select.relations = ['allowedUsers', 'owner'];
    }
    const games = await this.gameRepository.find(select);

    //this needs to be optimized
    return Promise.all(
      games.map(async (game) => {
        return this.findOne(game.id);
      }),
    );
  }

  async findOne(id: number): Promise<Game> {
    return this.gameRepository.findOne({ where: { id } });
  }

  async generateCards(game: Game) {
    game.allowedUsers.forEach(async (user) => {
      const userCards = await this.cardService.findAll({
        gameId: game.id,
        ownerId: user.id,
      });
      console.log(user.name, userCards.length, game.maxCards);
      if (userCards.length >= game.maxCards) {
        //delete
        for (let i = game.maxCards; i < userCards.length; i++) {
          await this.cardService.remove(userCards[i].id);
        }
      } else {
        //generate missing cards
        for (let i = userCards.length; i < game.maxCards; i++) {
          const card: CreateCardDto = {
            gameId: game.id,
            date: new Date(),
          };
          await this.cardService.create({ ...card, owner: user });
        }
      }
    });
  }

  async update(
    id: number,
    updateGameDto: UpdateGameDto & Partial<Game>,
  ): Promise<Game> {
    const game = await this.gameRepository.findOne({ where: { id } });

    if (updateGameDto.gameStatus) {
      switch (updateGameDto.gameStatus) {
        case IGameStatus.RUNNING:
          updateGameDto.startTs = new Date().toISOString();
          await this.generateCards(game);
          break;
        case IGameStatus.CREATED:
          updateGameDto.startTs = null;
          updateGameDto.currentNumber = 0;
          updateGameDto.extractions = JSON.stringify(
            GenerateExtractions(
              VARIANTS[game.variant].min,
              VARIANTS[game.variant].max,
            ),
          ) as any;
          break;
        case IGameStatus.CLOSED:
          updateGameDto.endTs = new Date().toISOString();
          break;
        default:
          break;
      }
    }

    const { allowedUsers, ...rest } = updateGameDto;
    await this.gameRepository
      .createQueryBuilder()
      .update(Game)
      .set(rest)
      .where('id = :id', { id })
      .execute();

    if (allowedUsers) {
      await this.gameRepository
        .createQueryBuilder()
        .relation(Game, 'allowedUsers')
        .of(game)
        .addAndRemove(
          allowedUsers.map((user) => ({ id: user })),
          game.allowedUsers,
        );
    }

    const updatedGame = await this.gameRepository.findOne({ where: { id } });
    this.gameGateway.emitGameUpdate(updatedGame);
    return updatedGame;
  }

  async remove(id: number): Promise<void> {
    const game = await this.gameRepository.findOne({ where: { id } });
    if (game) {
      await this.gameRepository.delete(id);
      this.gameGateway.emitGameDeleted(id, game);
    }
  }

  async extract(id: number): Promise<Game> {
    const game = await this.gameRepository.findOne({ where: { id } });
    if (game.gameStatus !== IGameStatus.RUNNING)
      throw new UnprocessableEntityException(
        `Game is not running (${game.gameStatus})`,
      );
    const gameVariant = VARIANTS[game.variant];
    if (game.currentNumber >= gameVariant.max - 1)
      throw new UnprocessableEntityException('Already Extraced all numbers');
    this.gameRepository.update(game.id, {
      currentNumber: game.currentNumber + 1,
    });

    const updatedGame = await this.gameRepository.findOne({ where: { id } });
    this.gameGateway.emitGameUpdate(updatedGame);
    return updatedGame;
  }
}
