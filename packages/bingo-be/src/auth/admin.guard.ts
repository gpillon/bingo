import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class AdminGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (user && user.roles && user.roles.includes('admin')) {
      return true;
    } else {
      throw new UnauthorizedException(
        'You do not have the required admin role',
      );
    }
  }
}
