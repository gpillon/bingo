import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UsersService } from './users.service';
import { UserController } from './user.controller';
import { AuthModule } from './auth.module';
import { RolesGuard } from './roles.guard';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    forwardRef(() => AuthModule),
    JwtModule.register({
      secret: process.env.JWT_SECRET || '23978b45fcy239b4fcw390cr', // Use an environment variable for this in production
      signOptions: { expiresIn: '60m' },
    }),
  ],
  providers: [UsersService, RolesGuard],
  exports: [UsersService, RolesGuard, JwtModule],
  controllers: [UserController],
})
export class UsersModule {}