import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { User } from './user.entity';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { plainToInstance } from 'class-transformer';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RolesGuard } from './roles.guard';
import { SetMetadata } from '@nestjs/common';
import { UserLoginDto } from './dto/user-login.dto';
import { ReadUserDto } from './dto/read-user.dto';
import { ReadUserMeDto } from './dto/read-user-me.dto';

@Controller()
@ApiTags('Users')
export class UserController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Get()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @SetMetadata('roles', ['admin'])
  @ApiOperation({ summary: 'Get all users' })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Return all users.',
    type: [ReadUserDto],
  })
  findAll() {
    const users = this.usersService.findAll();
    const returnUsers = plainToInstance(ReadUserDto, users, {
      excludeExtraneousValues: true,
    });
    return returnUsers;
  }

  @UseGuards(AuthGuard('local'))
  @Post('login')
  @ApiOperation({ summary: 'Login' })
  @ApiResponse({
    status: 200,
    description: 'Login successful.',
    type: User,
  })
  @ApiBody({ type: UserLoginDto })
  async login(@Req() req) {
    const user = this.authService.login(req.user);
    return user;
  }

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @SetMetadata('roles', ['admin'])
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({
    status: 201,
    description: 'User registered successfully.',
    type: User,
  })
  @ApiBody({ type: CreateUserDto })
  async register(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);
    const returnUser = plainToInstance(ReadUserDto, user, {
      excludeExtraneousValues: true,
    });
    return returnUser;
  }

  @Get('me')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @SetMetadata('roles', ['admin', 'user'])
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get the current user profile' })
  @ApiResponse({
    status: 200,
    description: 'User profile retrieved successfully.',
  })
  async getProfile(@Req() req) {
    const user = await this.usersService.getProfile(req.user.id);
    const returnUser = plainToInstance(ReadUserMeDto, user, {
      excludeExtraneousValues: true,
    });
    return returnUser;
  }

  @Patch('me')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @SetMetadata('roles', ['admin', 'user'])
  @ApiOperation({ summary: 'Update the current user profile' })
  @ApiBody({ type: UpdateUserDto })
  async updateProfile(@Req() req, @Body() updateUserDto: UpdateUserDto) {
    const user = await this.usersService.updateProfile(
      req.user.id,
      updateUserDto,
    );
    const returnUser = plainToInstance(ReadUserMeDto, user, {
      excludeExtraneousValues: true,
    });
    return returnUser;
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @SetMetadata('roles', ['admin'])
  @ApiOperation({ summary: 'Update a user' })
  @ApiParam({ name: 'id', type: String, description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'User updated successfully.',
    type: User,
  })
  @ApiBody({ type: UpdateUserDto })
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const user = await this.usersService.update(+id, updateUserDto);
    const returnUser = plainToInstance(ReadUserDto, user, {
      excludeExtraneousValues: true,
    });
    return returnUser;
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @SetMetadata('roles', ['admin'])
  @ApiOperation({ summary: 'Delete a user' })
  @ApiParam({ name: 'id', type: String, description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'User deleted successfully.',
  })
  async delete(@Param('id') id: string) {
    const user = await this.usersService.delete(+id);
    const returnUser = plainToInstance(ReadUserDto, user, {
      excludeExtraneousValues: true,
    });
    return returnUser;
  }
}
