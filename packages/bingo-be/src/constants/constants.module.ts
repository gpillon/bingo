import { Module } from '@nestjs/common';
import { ConstantsService } from './constants.service';
import { ConstantsController } from './constants.controller';

@Module({
  controllers: [ConstantsController],
  providers: [ConstantsService],
})
export class ConstantsModule {}
