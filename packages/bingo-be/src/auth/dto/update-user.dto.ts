import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({
    description: 'Username must be at least 3 characters long',
    minLength: 3,
    maxLength: 200,
    required: false,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(200)
  @IsOptional()
  username?: string;

  @ApiProperty({
    description: 'Password must be at least 8 characters long',
    minLength: 8,
    maxLength: 200,
    required: false,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(200)
  @IsOptional()
  password?: string;

  @ApiProperty({ enum: ['user', 'admin'] })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  role?: 'user' | 'admin';

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  email?: string;
}
