import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { IsString } from 'class-validator';
import { ReadGameDto } from '../../game/dto/read-game.dto';

export class ReadUserMeDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  @IsString()
  username: string;

  @ApiProperty({ enum: ['user', 'admin'] })
  @IsString()
  role: 'user' | 'admin';

  @Exclude()
  password?: never;

  @ApiProperty({ type: [ReadGameDto] })
  gamesOwner?: ReadGameDto[];

  @ApiProperty({ type: [ReadGameDto] })
  gamesAllowed?: ReadGameDto[];
}
