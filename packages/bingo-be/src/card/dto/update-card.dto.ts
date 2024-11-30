import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsDate, IsEnum } from 'class-validator';
import { FuelType } from '../card.types';

export class UpdateCardDto {
  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  @IsNotEmpty()
  id?: number;

  @ApiProperty({ required: false })
  @IsDate()
  @IsOptional()
  @IsNotEmpty()
  date?: Date;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  @IsNotEmpty()
  liters?: number;

  @ApiProperty({ required: false })
  @IsEnum(FuelType)
  @IsOptional()
  @IsNotEmpty()
  fuelType?: FuelType;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  @IsNotEmpty()
  kilometers?: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  @IsNotEmpty()
  cost?: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  @IsNotEmpty()
  gameId?: number;
}
