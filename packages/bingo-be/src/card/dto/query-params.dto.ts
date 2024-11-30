import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsNumber, Min, IsDateString } from 'class-validator';

export class QueryParamsDto {
  @ApiProperty({ required: false, format: 'number', example: 1 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  gameId?: number;

  @ApiProperty({ required: false, format: 'date', example: '2024-01-01' })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiProperty({ required: false, format: 'date', example: '2024-01-01' })
  @IsOptional()
  @IsDateString()
  endDate?: string;
}
