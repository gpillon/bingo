import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  Res,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { SetMetadata } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { Response } from 'express';
import { PriceService } from './price.service';
import { CreatePriceDto } from './dto/create-price.dto';
import { ReadPriceDto } from './dto/read-price.dto';
import { plainToInstance } from 'class-transformer';
import { UpdatePriceDto } from './dto/update-price.dto';

@ApiTags('Prices')
@Controller()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiBearerAuth()
export class PriceController {
  constructor(private readonly priceService: PriceService) {}

  @Post()
  @SetMetadata('roles', ['admin'])
  @ApiOperation({ summary: 'Create a new price' })
  async create(@Body() createPriceDto: CreatePriceDto) {
    const price = await this.priceService.create(createPriceDto);
    return plainToInstance(ReadPriceDto, price, {
      excludeExtraneousValues: true,
    });
  }

  @Get()
  @ApiOperation({ summary: 'Get all prices' })
  @SetMetadata('roles', ['admin'])
  async findAll() {
    const prices = await this.priceService.findAll();
    return plainToInstance(ReadPriceDto, prices, {
      excludeExtraneousValues: true,
    });
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a price' })
  async update(
    @Param('id') id: string,
    @Body() updatePriceDto: UpdatePriceDto,
  ) {
    const price = await this.priceService.update(+id, updatePriceDto);
    return plainToInstance(ReadPriceDto, price, {
      excludeExtraneousValues: true,
    });
  }

  @Post(':id/image')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @SetMetadata('roles', ['admin'])
  @UseInterceptors(FileInterceptor('image'))
  @ApiOperation({ summary: 'Upload price image' })
  async uploadImage(
    @Param('id') id: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 2 * 1024 * 1024 }), // 2MB
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    const price = await this.priceService.uploadImage(+id, file);
    return plainToInstance(ReadPriceDto, price, {
      excludeExtraneousValues: true,
    });
  }

  @Delete(':id/image')
  @SetMetadata('roles', ['admin'])
  @ApiOperation({ summary: 'Delete price image' })
  async deleteImage(@Param('id') id: string) {
    return this.priceService.deleteImage(+id);
  }

  @Get(':id/image')
  @ApiOperation({ summary: 'Get price image' })
  async getImage(@Param('id') id: string, @Res() res: Response) {
    const image = await this.priceService.getImage(+id);
    res.set('Content-Type', 'image/jpeg');
    res.send(image);
  }

  @Delete(':id')
  @SetMetadata('roles', ['admin'])
  @ApiOperation({ summary: 'Delete a price' })
  remove(@Param('id') id: string) {
    return this.priceService.remove(+id);
  }
}
