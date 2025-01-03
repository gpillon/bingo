import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GameService } from './game.service';
import { UseGuards, Inject, forwardRef } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { WsAuthGuard } from '../auth/ws-auth.guard';
import { Game } from './entities/game.entity';
import { plainToInstance } from 'class-transformer';
import { ReadGameDto } from './dto/read-game.dto';

@WebSocketGateway({
  cors: true,
  namespace: 'game'
})
@UseGuards(WsAuthGuard)
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    @Inject(forwardRef(() => GameService))
    private readonly gameService: GameService,
    private readonly authService: AuthService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      const token =
        client.handshake.auth.token || client.handshake.headers.authorization;
      const user = await this.authService.validateToken(token);

      if (!user) {
        client.disconnect();
        return;
      }

      client.data.user = user;

      // Join user to their personal room
      client.join(`user_${user.id}`);
      console.log(`Client connected: ${client.id}`);
    } catch (error) {
      client.disconnect();
      console.error(error);
    }
  }

  handleDisconnect(client: Socket) {
    // Cleanup if needed
    try {
      client.leave(`user_${client.data.user.id}`);
      console.log(`Client disconnected: ${client.id}`);
    } catch (error) {
      console.error('error leaving user room', client.data.user); 
    }
  }

  emitGameUpdate(game: Game) {
    const gameToEmit = plainToInstance(ReadGameDto, game);
    this.server.to(`user_${game.owner.id}`).emit('gameUpdate', gameToEmit);
    game.allowedUsers?.forEach((user) => {
      this.server.to(`user_${user.id}`).emit('gameUpdate', gameToEmit);
    });
  }

  emitGameDeleted(gameId: number, game: ReadGameDto) {
    // Notify owner and all allowed users about the deletion
    const gameToEmit = plainToInstance(ReadGameDto, game);
    this.server.to(`user_${game.owner.id}`).emit('gameDeleted', gameId);
    game.allowedUsers?.forEach((user) => {
      this.server.to(`user_${user.id}`).emit('gameDeleted', gameToEmit);
    });
  }

  emitGameAdded(game: Game) {
    const gameToEmit = plainToInstance(ReadGameDto, game);
    this.server.to(`user_${game.owner.id}`).emit('gameAdded', gameToEmit);
    game.allowedUsers?.forEach((user) => {
      this.server.to(`user_${user.id}`).emit('gameAdded', gameToEmit);
    });
  }

  @SubscribeMessage('extract')
  async handleExtraction(
    @ConnectedSocket() client: Socket,
    @MessageBody() gameId: number,
  ) {
    const game = await this.gameService.extract(gameId);

    // Notify owner
    this.server.to(`user_${game.owner.id}`).emit('extraction', game);

    // Notify allowed users
    game.allowedUsers?.forEach((user) => {
      this.server.to(`user_${user.id}`).emit('extraction', game);
    });

    return plainToInstance(ReadGameDto, game);
  }
}
