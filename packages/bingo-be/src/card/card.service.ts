import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Card } from './entities/card.entity';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { QueryParamsDto } from './dto/query-params.dto';
import { GameService } from '../game/game.service';
import { User } from '../auth/user.entity';

@Injectable()
export class CardService {
  constructor(
    @InjectRepository(Card)
    private cardRepository: Repository<Card>,
    @Inject(forwardRef(() => GameService))
    private gameService: GameService,
  ) {}

  async create(createCardDto: CreateCardDto & { owner: User }): Promise<Card> {
    const game = await this.gameService.findOne(createCardDto.gameId);
    const card = this.cardRepository.create({
      ...createCardDto,
      game,
    });
    return this.cardRepository.save(card);
  }

  async findAll(
    params: QueryParamsDto & { ownerId?: number },
  ): Promise<Card[]> {
    const { gameId, startDate, endDate, ownerId } = params;
    const query = this.cardRepository.createQueryBuilder('card');
    query.leftJoinAndSelect('card.game', 'game');
    query.leftJoinAndSelect('card.owner', 'owner');
    query.leftJoinAndSelect('game.allowedUsers', 'allowedUsers');
    if (gameId) {
      query.andWhere('card.game.id = :gameId', { gameId });
    }

    if (startDate) {
      query.andWhere('card.date >= :startDate', { startDate });
    }

    if (endDate) {
      query.andWhere('card.date <= :endDate', { endDate });
    }

    if (ownerId) {
      query.andWhere('card.owner.id = :ownerId', { ownerId });
    }

    try {
      return query.getMany();
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async findOne(id: number): Promise<Card> {
    const card = await this.cardRepository.findOne({
      where: { id },
      relations: ['game', 'owner'],
      select: ['id', 'date', 'numbers', 'owner'],
    });
    if (!card) {
      throw new NotFoundException('Card not found');
    }
    return card;
  }

  async update(id: number, updateCardDto: UpdateCardDto): Promise<Card> {
    const game = await this.gameService.findOne(updateCardDto.gameId);
    const updatedCard = { ...updateCardDto, game };
    await this.cardRepository.update(id, updatedCard);

    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.cardRepository.delete(id);
  }
}
