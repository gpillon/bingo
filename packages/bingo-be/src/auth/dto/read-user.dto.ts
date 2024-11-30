import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { IsString } from 'class-validator';

export class ReadUserDto {
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
}
