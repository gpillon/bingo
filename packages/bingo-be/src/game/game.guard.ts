import {
  Injectable,
  CanActivate,
  ExecutionContext,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Game } from './entities/game.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
@Injectable()
export class GameGuard implements CanActivate {
  constructor(
    @InjectRepository(Game)
    private gameRepository: Repository<Game>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const gameId = request.params.id;

    const game = await this.gameRepository.findOneBy({ id: gameId });
    if (!game) throw new NotFoundException(`Game ${gameId} Not Found`);

    if (request.user.role === 'admin') {
      return true;
    }
    if (
      game.owner.id != request.user.userId &&
      !game.allowedUsers.map((user) => user.id).includes(request.user.userId)
    ) {
      throw new UnauthorizedException(`Not Allowed`);
    }

    return true;
  }
}
