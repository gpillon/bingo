import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PriceService } from './price.service';
import { PriceController } from './price.controller';
import { Price } from './entities/price.entity';
import { UsersModule } from '../auth/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Price]),
    UsersModule,
  ],
  providers: [PriceService],
  controllers: [PriceController],
  exports: [PriceService],
})
export class PriceModule {} 