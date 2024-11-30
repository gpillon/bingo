import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { config } from '../config';
import { UsersService } from './users.service';
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
    private userService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());

    if (!roles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;
    if (!authHeader) {
      throw new UnauthorizedException('Authorization header not found');
    }

    const token = authHeader.split(' ')[1];
    const decoded = this.jwtService.verify(token, {
      secret: config.jwtSecret,
    });

    const userRole = decoded.role;
    if (!roles.includes(userRole)) {
      throw new UnauthorizedException('You do not have the required role');
    }

    request.user = await this.userService.findOne(decoded.sub);

    return true;
  }
}
