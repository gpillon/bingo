import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  SetMetadata,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

import { AuthGuard } from '@nestjs/passport';
import { GameService } from './game.service';
import { Game } from './entities/game.entity';
import { CreateGameDto } from './dto/create-game.dto';
import { User } from 'src/auth/user.entity';
import { UpdateGameDto } from './dto/update-game.dto';
import { GameGuard } from './game.guard';
import { plainToInstance } from 'class-transformer';
import { ReadGameDto } from './dto/read-game.dto';
import { RolesGuard } from '../auth/roles.guard';

@ApiTags('Game')
@Controller()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiBearerAuth()
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new game' })
  @ApiResponse({
    status: 201,
    description: 'The game has been successfully created.',
    type: Game,
  })
  @SetMetadata('roles', ['admin'])
  create(@Body() createGameDto: CreateGameDto) {
    console.log(createGameDto);
    return this.gameService.create(createGameDto);
  }

  @Post(':id/extract')
  @ApiOperation({ summary: 'Extract Number a new game' })
  @ApiResponse({
    status: 201,
    description: 'The game has been successfully created.',
    type: Game,
  })
  @SetMetadata('roles', ['admin'])
  async extract(@Param('id') id: string) {
    const game = await this.gameService.extract(+id);
    return plainToInstance(ReadGameDto, game);
  }

  @Get()
  @ApiOperation({ summary: 'Get all games' })
  @ApiResponse({
    status: 200,
    description: 'Return all games.',
    type: [Game],
  })
  @SetMetadata('roles', ['admin', 'user'])
  async findAll(@Req() req: Request & { user: User }) {
    let userFilter = null;
    const user = req.user;
    if (user.role !== 'admin') userFilter = user.id;
    const games = await this.gameService.findAll(userFilter);
    return plainToInstance(ReadGameDto, games);
  }

  @Get(':id')
  @UseGuards(GameGuard)
  @ApiOperation({ summary: 'Get a game by id' })
  @ApiResponse({
    status: 200,
    description: 'Return the game.',
    type: Game,
  })
  async findOne(@Param('id') id: string) {
    const game = await this.gameService.findOne(+id);
    return plainToInstance(ReadGameDto, game);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a game' })
  @ApiResponse({
    status: 200,
    description: 'The game has been successfully updated.',
    type: Game,
  })
  async update(@Param('id') id: string, @Body() updateGameDto: UpdateGameDto) {
    const game = await this.gameService.update(+id, updateGameDto);
    return plainToInstance(ReadGameDto, game);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a game' })
  @ApiResponse({
    status: 200,
    description: 'The game has been successfully deleted.',
  })
  remove(@Param('id') id: string) {
    return this.gameService.remove(+id);
  }
}
