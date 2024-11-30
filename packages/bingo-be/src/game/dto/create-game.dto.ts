import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsArray,
  IsEnum,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { User } from '../../auth/user.entity';
import { Transform, Type } from 'class-transformer';
import { IGameVariant } from '../game.types';

export class CreateGameDto {

  @ApiProperty({ type: [Number] })
  @IsArray()
  @IsOptional()
  @Type(() => User)
  @Transform(({ value }) => value.map((id: number) => ({ id })))
  allowedUsers?: Partial<User>[];

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsEnum(IGameVariant)
  @IsNotEmpty()
  variant: IGameVariant;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  prize?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  prizeImage?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  image?: string;
}
