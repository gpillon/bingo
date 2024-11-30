import {
  Injectable,
  CanActivate,
  ExecutionContext,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Card } from './entities/card.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
@Injectable()
export class CardGuard implements CanActivate {
  constructor(
    @InjectRepository(Card)
    private cardRepository: Repository<Card>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const cardId = request.params.id;

    const card = await this.cardRepository.findOneBy({ id: cardId });
    if (!card) throw new NotFoundException(`Card ${cardId} Not Found`);

    if (request.user.role === 'admin') {
      return true;
    }

    if (
      card.owner.id != request.user.userId &&
      !card.game.allowedUsers
        .map((user) => user.id)
        .includes(request.user.userId)
    ) {
      throw new UnauthorizedException(`Not Allowed`);
    }


    return true;
  }
}
