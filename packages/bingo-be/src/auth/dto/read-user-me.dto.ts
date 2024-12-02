import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsString } from 'class-validator';
import { ReadGameDto } from '../../game/dto/read-game.dto';

export class ReadUserMeDto {
  @ApiProperty({ description: 'The ID of the user' })
  @Expose()
  id: number;

  @ApiProperty({ description: 'The username of the user' })
  @IsString()
  @Expose()
  username: string;

  @ApiProperty({ description: 'The name of the user' })
  @IsString()
  @Expose()
  name: string;

  @ApiProperty({ description: 'The email of the user' })
  @IsString()
  @Expose()
  email: string;

  @ApiProperty({ enum: ['user', 'admin'] })
  @IsString()
  @Expose()
  role: 'user' | 'admin';

  @Exclude()  
  password?: never;

  @ApiProperty({ type: [ReadGameDto] })
  @Expose()
  gamesOwner?: ReadGameDto[];

  @ApiProperty({ type: [ReadGameDto] })
  @Expose()
  gamesAllowed?: ReadGameDto[];
}
