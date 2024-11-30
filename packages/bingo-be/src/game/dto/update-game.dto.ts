import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsNotEmpty,
  IsNumber,
  IsEnum,
} from 'class-validator';
import { IGameStatus } from '../game.types';

export class UpdateGameDto {
  @ApiProperty({ required: false })
  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  id: number;

  @ApiProperty({ required: false, enum: IGameStatus })
  @IsOptional()
  @IsEnum(IGameStatus)
  @IsNotEmpty()
  gameStatus?: IGameStatus;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  model?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  type?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  plate?: string;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  @IsNotEmpty()
  year?: number;
}
