import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';
import { config } from '../config';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService, 
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByUsername(username); 
    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: User) {
    const payload = {
      username: user.username,
      role: user.role,
      sub: user.id,
      name: user.name,
      email: user.email,
    };
    return {
      access_token: this.jwtService.sign(payload, {
        secret: config.jwtSecret,
        expiresIn: '1000d',
      }),
    };
  }

  async validateToken(token: string): Promise<User | null> {
    try {
      const payload = this.jwtService.verify(token);
      return this.usersService.findOneByUsername(payload.username);
    } catch (error) {
      // console.log(error);
      return null;
    }
  }
}
