import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsNotEmpty,
  IsNumber,
  IsEnum,
} from 'class-validator';
import { IGameStatus, IGameVariant } from '../game.types';
import { Exclude, Expose, Transform, Type } from 'class-transformer';
import { ReadPriceDto } from '../../price/dto/read-price.dto';

export class OwnerDto {
  @Exclude()
  password?: never;

  @Exclude()
  role?: never;

  @ApiProperty({ type: 'string', description: 'ownerId' })
  @Expose()
  id: string;

  @ApiProperty({ type: 'string', description: 'username' })
  @Expose()
  username: string;
}

export class OwnerForCardDto {
  @ApiProperty({ type: 'string', description: 'name' })
  @Expose()
  name: string;

  @ApiProperty({ type: 'string', description: 'Id' })
  @Expose()
  id: string;
}

export class CardForGameDto {
  @ApiProperty({ example: 1 })
  @Expose()
  id: number;

  @ApiProperty({ type: OwnerForCardDto })
  @Expose()
  @Type(() => OwnerForCardDto)
  owner: OwnerForCardDto;
}

export class ReadGameDto {
  @ApiProperty({ example: 1 })
  @Expose()
  id: number;

  @ApiProperty({ example: 'Game 1' })
  @Expose()
  name: string;

  @ApiPropertyOptional({ example: 'Game 1 description' })
  @Expose()
  description?: string;

  @ApiPropertyOptional({ type: ReadPriceDto })
  @Expose()
  @Type(() => ReadPriceDto)
  cinquinaPrice?: ReadPriceDto;

  @ApiPropertyOptional({ type: ReadPriceDto })
  @Expose()
  @Type(() => ReadPriceDto)
  bingoPrice?: ReadPriceDto;

  @ApiPropertyOptional({ type: ReadPriceDto })
  @Expose()
  @Type(() => ReadPriceDto)
  miniBingoPrice?: ReadPriceDto;

  @ApiProperty({ enum: IGameVariant, example: IGameVariant.NAPOLETANA })
  @Expose()
  variant: IGameVariant;

  @ApiProperty({ enum: IGameStatus, example: IGameStatus.CREATED })
  @Expose()
  gameStatus: IGameStatus;

  @ApiProperty({ type: OwnerForCardDto })
  @Type(() => OwnerForCardDto)
  @Expose()
  owner: OwnerForCardDto;

  @Exclude()
  extractions?: never;

  @ApiProperty({ type: [OwnerForCardDto] })
  @Type(() => OwnerForCardDto)
  @Expose()
  allowedUsers?: OwnerForCardDto[];

  @ApiProperty({ example: 1 })
  @Expose()
  currentNumber: number;

  @ApiProperty({
    example: 50,
    minimum: 1,
    maximum: 99,
    description: 'Maximum number of cards',
  })
  @Expose()
  maxCards: number;

  @ApiPropertyOptional({ type: CardForGameDto })
  @Expose()
  @Type(() => CardForGameDto)
  @Transform(({ value, obj }) => {
    if (obj.currentNumber >= obj.cinquinaNumber) return value;
    return undefined;
  })
  cinquinaCard?: CardForGameDto;

  @ApiPropertyOptional({ type: CardForGameDto })
  @Expose()
  @Type(() => CardForGameDto)
  @Transform(({ value, obj }) => {
    if (obj.currentNumber >= obj.bingoNumber) return value;
    return undefined;
  })
  bingoCard?: CardForGameDto;

  @ApiPropertyOptional({ type: CardForGameDto })
  @Expose()
  @Type(() => CardForGameDto)
  @Transform(({ value, obj }) => {
    if (obj.currentNumber >= obj.miniBingoNumber) return value;
    return undefined;
  })
  miniBingoCard?: CardForGameDto;

  @ApiProperty({ example: 65 })
  @Expose()
  @Transform(({ value, obj }) => {
    if (obj.currentNumber >= obj.cinquinaNumber) return value;
    return undefined;
  })
  cinquinaNumber: number;

  @ApiProperty({ example: 87 })
  @Expose()
  @Transform(({ value, obj }) => {
    if (obj.currentNumber >= obj.bingoNumber) return value;
    return undefined;
  })
  bingoNumber: number;

  @ApiProperty({ example: 88 })
  @Expose()
  @Transform(({ value, obj }) => {
    if (obj.currentNumber >= obj.miniBingoNumber) return value;
    return undefined;
  })
  miniBingoNumber: number;

  @ApiProperty({ type: [Number] })
  @Expose()
  extractedNumbers: number[];

  @ApiPropertyOptional({ example: new Date() })
  @Expose()
  startTs?: Date;

  @ApiPropertyOptional({ example: new Date() })
  @Expose()
  endTs?: Date;

  @ApiProperty({ example: new Date() })
  @Expose()
  createTs: Date;

  @ApiPropertyOptional({ example: 10 })
  @Expose()
  duration?: number;
}
