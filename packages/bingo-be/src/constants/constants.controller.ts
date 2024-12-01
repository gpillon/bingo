import { Controller, Get } from '@nestjs/common';
import { ConstantsService } from './constants.service';
import { ReadVariantsDto } from './dto/read-variants.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller()
@ApiTags('Constants')
export class ConstantsController {
  constructor(private readonly constantsService: ConstantsService) { }

  @Get('variants')
  @ApiResponse({
    status: 200,
    type: ReadVariantsDto,
  })
  getVariants(): ReadVariantsDto {
    return this.constantsService.gameVariants();
  }
}
