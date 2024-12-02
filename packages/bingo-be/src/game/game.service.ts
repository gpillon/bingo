import {
  forwardRef,
  Inject,
  Injectable,
  Logger,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, FindManyOptions, Repository } from 'typeorm';
import { Game } from './entities/game.entity';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';

import { IGameStatus, VARIANTS } from './game.types';
import { GameGateway } from './game.gateway';
import { GenerateExtractions } from '../utlis/gen-numbers.funtion';
import { CardService } from '../card/card.service';
import { CreateCardDto } from '../card/dto/create-card.dto';
import { Card } from '../card/entities/card.entity';
import { ReadGameDto } from './dto/read-game.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class GameService {
  private readonly logger = new Logger(GameService.name);
  private readonly commonRelations = [
    'cinquinaCard',
    'bingoCard',
    'miniBingoCard',
    'owner',
    'allowedUsers',
    'cinquinaPrice',
    'bingoPrice',
    'miniBingoPrice',
  ];
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
    await this.gameRepository.save(game);
    this.gameGateway.emitGameAdded(game);
    return game;
  }

  async findAll(userFilter?: number): Promise<Game[]> {
    const select: FindManyOptions<Game> = {};
    if (userFilter) {
      select.where = [
        { owner: { id: userFilter } },
        { allowedUsers: { id: userFilter } },
      ];
      select.relations = this.commonRelations;
    }
    const games = await this.gameRepository.find(select);
    return games;
    //this needs to be optimized
    return Promise.all(
      games.map(async (game) => {
        return this.findOne(game.id);
      }),
    );
  }

  async findOne(id: number): Promise<Game> {
    return this.gameRepository.findOne({
      where: { id },
      relations: this.commonRelations,
    });
  }

  async generateCards(game: Game, force: boolean = false) {
    game.allowedUsers.forEach(async (user) => {
      const userCards = await this.cardService.findAll({
        gameId: game.id,
        ownerId: user.id,
      });
      if (force) {
        //delete all cards
        for (let i = 0; i < userCards.length; i++) {
          await this.cardService.remove(userCards[i].id);
        }
      }
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

  private checkCinquina(
    cards: { id: number; numbers: number[][] }[],
    extractions: number[],
  ): { id: number; numberLength: number; rowIdx: number } | boolean {
    // remove 90 hard code
    const checker = (arr: number[], target: number[]) =>
      target.every((v: number) => arr.includes(v));

    const mappedCards = cards.map((card) => ({
      id: card.id,
      transposed: card.numbers.map((row: number[]) =>
        row.filter((num) => num !== -1).map((num) => num),
      ),
    }));
    let cinquine:
      | boolean
      | { id: number; numberLength: number; rowIdx: number } = true;

    for (let i = 5; i <= 90; i++) {
      for (let cardIdx = 0; cardIdx < mappedCards.length; cardIdx++) {
        const card = mappedCards[cardIdx];
        for (let rowIdx = 0; rowIdx < card.transposed.length; rowIdx++) {
          const row = card.transposed[rowIdx];
          if (checker(extractions.slice(0, i), row)) {
            if (cinquine === true)
              cinquine = { id: card.id, numberLength: i, rowIdx: rowIdx };
            else if (!!cinquine) cinquine = false;
            else cinquine = { id: card.id, numberLength: i, rowIdx: rowIdx };
          }
        }
        if (cinquine === false) break;
      }
      if ((!!cinquine && cinquine !== true) || cinquine === false) break;
    }
    return cinquine;
  }

  private checkBingo(
    cards: { id: number; numbers: number[][] }[],
    extractions: number[],
  ): { id: number; numberLength: number } | boolean {
    // remove 90 hard code
    const checker = (arr: number[], target: number[]) =>
      target.every((v: number) => arr.includes(v));

    const mappedCards = cards.map((card) => ({
      id: card.id,
      allNumbers: card.numbers
        .reduce((acc, row) => [...acc, ...row], [])
        .filter((num) => num !== -1),
    }));
    let bingo: boolean | { id: number; numberLength: number } = true;
    for (let i = 5; i <= 90; i++) {
      for (let cardIdx = 0; cardIdx < mappedCards.length; cardIdx++) {
        const card = mappedCards[cardIdx];
        if (checker(extractions.slice(0, i), card.allNumbers)) {
          if (bingo === true) bingo = { id: card.id, numberLength: i };
          else if (!!bingo) bingo = false;
          else bingo = { id: card.id, numberLength: i };
        }
        if (bingo === false) break;
      }
      if ((!!bingo && bingo !== true) || bingo === false) break;
    }
    return bingo;
  }

  private async calculateGameAchievements(
    game: Game,
  ): Promise<Partial<Game> | boolean> {
    let cards: Card[] = [];
    const maxAttempts = 50;
    let attempts = 0;
    do {
      await new Promise((resolve) => setTimeout(resolve, 200));
      cards = await this.cardService.findAll({ gameId: game.id });
      attempts++;
    } while (cards.length === 0 && attempts < maxAttempts);
    const updates: Partial<Game> = {};
    const strippedCards = cards.map((card) => ({
      id: card.id,
      numbers: card.numbers as any,
    }));

    const cinquina = this.checkCinquina(strippedCards, game.extractions);
    if (cinquina === false) {
      return false;
    } else if (cinquina !== true) {
      if (cinquina) {
        updates.cinquinaCard = { id: cinquina.id } as Card;
        updates.cinquinaNumber = cinquina.numberLength;
      }
    }

    const bingo = this.checkBingo(strippedCards, game.extractions);
    if (bingo === false) {
      return false;
    } else if (bingo !== true) {
      updates.bingoCard = { id: bingo.id } as Card;
      updates.bingoNumber = bingo.numberLength;
    } else {
      return updates;
    }
    const excludedCards = strippedCards.filter((card) => card.id !== bingo.id);

    const miniBingo = this.checkBingo(excludedCards, game.extractions);
    if (miniBingo !== true && miniBingo) {
      updates.miniBingoCard = { id: miniBingo.id } as Card;
      updates.miniBingoNumber = miniBingo.numberLength;
    }
    return updates;
  }

  async update(
    id: number,
    updateGameDto: UpdateGameDto & DeepPartial<Game>,
  ): Promise<Game> {
    const game = await this.gameRepository.findOne({
      where: { id },
      relations: this.commonRelations,
    });

    if (updateGameDto.gameStatus) {
      switch (updateGameDto.gameStatus) {
        case IGameStatus.RUNNING:
          updateGameDto.startTs = new Date().toISOString();
          let achievements: boolean | Partial<Game> = true;
          let attempts = 0;
          do {
            await this.generateCards(game, !achievements);

            achievements = await this.calculateGameAchievements(game);
            attempts++;
          } while (!achievements && attempts < 3);
          console.log('attempts', attempts);
          console.log('achievements', achievements);
          // Calculate initial achievements after generating cards
          Object.assign(updateGameDto, achievements);
          break;
        case IGameStatus.CREATED:
          updateGameDto.startTs = null;
          updateGameDto.currentNumber = 0;
          updateGameDto.cinquinaCard = null;
          updateGameDto.bingoCard = null;
          updateGameDto.miniBingoCard = null;
          updateGameDto.cinquinaNumber = null;
          updateGameDto.bingoNumber = null;
          updateGameDto.miniBingoNumber = null;
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

    const updatedGame = await this.gameRepository.findOne({
      where: { id },
      relations: this.commonRelations,
    });

    this.gameGateway.emitGameUpdate(updatedGame);
    return updatedGame;
  }

  async remove(id: number): Promise<void> {
    const game = await this.gameRepository.findOne({ where: { id } });
    const emitGame = { ...plainToInstance(ReadGameDto, game) };
    if (game) {
      await this.gameRepository.delete(id);
      this.gameGateway.emitGameDeleted(id, emitGame);
    }
  }

  async extract(id: number): Promise<Game> {
    const game = await this.gameRepository.findOne({
      where: { id },
      relations: this.commonRelations,
    });
    if (game.gameStatus !== IGameStatus.RUNNING)
      throw new UnprocessableEntityException(
        `Game is not running (${game.gameStatus})`,
      );
    const gameVariant = VARIANTS[game.variant];
    if (game.currentNumber >= gameVariant.max)
      throw new UnprocessableEntityException('Already Extraced all numbers');

    // Update current number
    await this.gameRepository.update(game.id, {
      currentNumber: game.currentNumber + 1,
    });

    const finalGame = await this.gameRepository.findOne({
      where: { id },
      relations: this.commonRelations,
    });
    this.gameGateway.emitGameUpdate(finalGame);
    return finalGame;
  }
}
