import { IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class GameIdDto {
  @ApiProperty({
    description: 'The id of the game',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  id: number;
}
