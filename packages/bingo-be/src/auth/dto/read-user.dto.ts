import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsString } from 'class-validator';

export class ReadUserDto {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @IsString()
  @Expose()
  username: string;

  @ApiProperty({ enum: ['user', 'admin'] })
  @IsString()
  @Expose()
  role: 'user' | 'admin';

  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @Expose()
  name: string;

  @ApiProperty()
  @IsString()
  @Expose()
  email: string;

  @Exclude()
  password?: never;
}
