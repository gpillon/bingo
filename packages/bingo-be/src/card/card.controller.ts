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
import { CardService } from './card.service';
import { Card } from './entities/card.entity';
import { CreateCardDto } from './dto/create-card.dto';
import { Query } from '@nestjs/common';
import { QueryParamsDto } from './dto/query-params.dto';
import { ReadCardDto } from './dto/read-card.dto';
import { plainToInstance } from 'class-transformer';
import { User } from 'src/auth/user.entity';
import { CardGuard } from './card.guard';
import { RolesGuard } from '../auth/roles.guard';

@ApiTags('Cards')
@Controller()
@UseGuards(AuthGuard('jwt'))
@UseGuards(RolesGuard)
@ApiBearerAuth()
export class CardController {
  constructor(private readonly cardService: CardService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new card' })
  @ApiResponse({
    status: 201,
    description: 'The card has been successfully created.',
    type: Card,
  })
  create(@Body() createCardDto: CreateCardDto, @Req() req: Request) {
    const owner = (req as any).user as User;
    return this.cardService.create({ ...createCardDto, owner });
  }

  @Get()
  @ApiOperation({ summary: 'Get all cards' })
  @ApiResponse({
    status: 200,
    description: 'Return all cards.',
    type: ReadCardDto,
    isArray: true,
  })
  async findAll(@Query() params: QueryParamsDto, @Req() req: Request) {
    let cards = await this.cardService.findAll(params);
    const user = (req as any).user;
    if (user.role !== 'admin') {
      cards = cards.filter((card) => card.owner.id === user.userId);
      cards = cards.filter((card) =>
        card.game.allowedUsers.map((user) => user.id).includes(user.userId),
      );
    }
    return plainToInstance(ReadCardDto, cards, {
      excludeExtraneousValues: true,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a card by id' })
  @ApiResponse({
    status: 200,
    description: 'Return the card.',
    type: ReadCardDto,
  })

  @UseGuards(CardGuard)
  async findOne(@Param('id') id: string) {
    const card = await this.cardService.findOne(+id);
    return plainToInstance(ReadCardDto, card, {
      excludeExtraneousValues: true,
    });
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a card' })
  @ApiResponse({
    status: 200,
    description: 'The card has been successfully updated.',
    type: ReadCardDto,
  })
  @UseGuards(CardGuard)
  @SetMetadata('roles', ['admin'])
  update(@Param('id') id: string, @Body() updateCardDto: CreateCardDto) {
    return this.cardService.update(+id, updateCardDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a card' })
  @ApiResponse({
    status: 200,
    description: 'The card has been successfully deleted.',
  })
  remove(@Param('id') id: string) {
    return this.cardService.remove(+id);
  }
}
