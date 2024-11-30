import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { ReadUserDto } from '../../auth/dto/read-user.dto';
import { ReadGameDto } from '../../game/dto/read-game.dto';
import { IGameStatus } from '../../game/game.types';

export class ReadGameForCardDto
  implements Pick<ReadGameDto, 'id' | 'gameStatus'>
{
  @Expose()
  id: number;
  @Expose()
  gameStatus: IGameStatus;
}

export class ReadUserForCardDto
  implements Pick<ReadUserDto, 'id' | 'username'>
{
  @Expose()
  id: number;
  @Expose()
  username: string;
}
export class ReadCardDto {
  @ApiProperty({ example: 1 })
  @Expose()
  id: number;

  @ApiProperty({ example: '2021-01-01' })
  @Expose()
  date: Date;

  @ApiProperty({ type: ReadUserForCardDto })
  @Expose()
  @Type(() => ReadUserForCardDto)
  owner: ReadUserForCardDto;

  @ApiProperty({ example: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] })
  @Expose()
  numbers: number[];

  @ApiProperty({ type: ReadGameForCardDto })
  @Type(() => ReadGameForCardDto)
  @Expose()
  game: typeof ReadGameForCardDto;
}
