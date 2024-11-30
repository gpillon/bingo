import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsNotEmpty,
  IsNumber,
  IsEnum,
} from 'class-validator';
import { IGameStatus, IGameVariant } from '../game.types';
import { Exclude, Type } from 'class-transformer';

export class OwnerDto {
  @Exclude()
  password?: never;

  @Exclude()
  role?: never;

  @ApiProperty({ type: 'string', description: 'ownerId' })
  id: string;

  @ApiProperty({ type: 'string', description: 'username' })
  username: string;
}

export class ReadGameDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Game 1' })
  name: string;

  @ApiPropertyOptional({ example: 'Game 1 description' })
  description?: string;

  @ApiPropertyOptional({ example: 'https://bingo.com/image.png' })
  image?: string;

  @ApiPropertyOptional({ example: 'https://bingo.com/prize.png' })
  prize?: string;

  @ApiPropertyOptional({ example: 'https://bingo.com/prize.png' })
  prizeImage?: string;

  @ApiProperty({ enum: IGameVariant, example: IGameVariant.NAPOLETANA })
  variant: IGameVariant;

  @ApiProperty({ enum: IGameStatus, example: IGameStatus.CREATED })
  gameStatus: IGameStatus;

  @ApiProperty({ type: OwnerDto })
  @Type(() => OwnerDto)
  owner: OwnerDto;

  @Exclude()
  extractions?: never;

  @ApiProperty({ type: [OwnerDto] })
  @Type(() => OwnerDto)
  allowedUsers?: OwnerDto[];
  
}
