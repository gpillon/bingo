import { ApiProperty, PickType } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsNotEmpty,
  IsNumber,
  IsEnum,
} from 'class-validator';
import { IGameStatus } from '../game.types';
import { ReadPriceDto } from '../../price/dto/read-price.dto';
import { Type } from 'class-transformer';


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

  @ApiProperty({ required: false, type: ReadPriceDto })
  @IsOptional()
  @IsNotEmpty()
  @Type(() => ReadPriceDto)
  cinquinaPrice?: Pick<ReadPriceDto, 'id'>;

  @ApiProperty({ required: false, type: PickType(ReadPriceDto, ['id']) })
  @IsOptional()
  @IsNotEmpty()
  @Type(() => ReadPriceDto)
  bingoPrice?: Pick<ReadPriceDto, 'id'>;

  @ApiProperty({ required: false, type: PickType(ReadPriceDto, ['id']) })
  @IsOptional()
  @IsNotEmpty()
  @Type(() => ReadPriceDto)
  miniBingoPrice?: Pick<ReadPriceDto, 'id'>;
}
