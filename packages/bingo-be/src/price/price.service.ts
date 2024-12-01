import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Price } from './entities/price.entity';
import { CreatePriceDto } from './dto/create-price.dto';
import { ReadPriceDto } from './dto/read-price.dto';

@Injectable()
export class PriceService {
  constructor(
    @InjectRepository(Price)
    private priceRepository: Repository<Price>,
  ) {}

  async create(createPriceDto: CreatePriceDto): Promise<Price> {
    const price = this.priceRepository.create(createPriceDto);
    return this.priceRepository.save(price);
  }

  async findAll(): Promise<Price[]> {
    return this.priceRepository.find();
  }

  async findOne(id: number): Promise<Price> {
    const price = await this.priceRepository.findOne({ where: { id } });
    if (!price) {
      throw new NotFoundException(`Price #${id} not found`);
    }
    return price;
  }

  async update(
    id: number,
    updatePriceDto: Partial<CreatePriceDto>,
  ): Promise<Price> {
    const price = await this.findOne(id);
    Object.assign(price, updatePriceDto);
    return this.priceRepository.save(price);
  }

  async remove(id: number): Promise<void> {
    const price = await this.findOne(id);
    await this.priceRepository.remove(price);
  }

  async uploadImage(id: number, file: Express.Multer.File): Promise<Price> {
    if (file.size > 2 * 1024 * 1024) { // 2MB limit
      throw new BadRequestException('File size exceeds 2MB limit');
    }

    const price = await this.findOne(id);
    price.image = file.buffer;
    price.hasImage = true;
    return this.priceRepository.save(price);
  }

  async deleteImage(id: number): Promise<void> {
    const price = await this.findOne(id);
    price.image = null;
    price.hasImage = false;
    await this.priceRepository.save(price);
  }

  async getImage(id: number): Promise<Buffer> {
    const price = await this.findOne(id);
    if (!price.image) {
      throw new NotFoundException('Image not found');
    }
    return price.image;
  }
} 