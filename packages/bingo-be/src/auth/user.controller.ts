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
    const returnUsers = plainToInstance(ReadUserDto, users);
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
    return this.authService.login(req.user);
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
    const returnUser = plainToInstance(User, user);
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
    const returnUser = plainToInstance(User, user);
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
    await this.usersService.delete(+id);
  }
}
