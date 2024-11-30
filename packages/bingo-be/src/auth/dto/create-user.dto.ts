import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'Username must be at least 3 characters long',
    minLength: 3,
    maxLength: 200,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(200)
  username: string;

  @ApiProperty({
    description: 'Password must be at least 8 characters long',
    minLength: 8,
    maxLength: 200,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(200)
  password: string;

  @ApiProperty({ enum: ['user', 'admin'] })
  @IsString()
  @IsNotEmpty()
  role: 'user' | 'admin';

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  email: string;
}
