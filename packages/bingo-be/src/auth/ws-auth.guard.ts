import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthService } from './auth.service';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class WsAuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const client = context.switchToWs().getClient();
      const token = client.handshake.auth.token || client.handshake.headers.authorization;
      
      const user = await this.authService.validateToken(token);
      if (!user) {
        throw new WsException('Unauthorized');
      }
      
      client.data.user = user;
      return true;
    } catch {
      throw new WsException('Unauthorized');
    }
  }
} 