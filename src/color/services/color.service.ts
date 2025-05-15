import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { Color } from '../entities/color.entities';
import { UpdateColorInput, CreateColorInput } from '../dto/color.dto';

@Injectable()
export class ColorService {
  constructor(
    @InjectRepository(Color)
    private readonly colorRepository: Repository<Color>,
  ) {}

  ping(): string {
    return 'Database is connected';
  }
  async create(input: CreateColorInput): Promise<Color> {
    const color = this.colorRepository.create(input);
    const savedColor = await this.colorRepository.save(color);
    return { ...savedColor };
  }
  async findAll(): Promise<Color[]> {
    return await this.colorRepository.find();
  }
  async findPagination(skip: number, take: number = 5): Promise<Color[]> {
    return await this.colorRepository.find({ take, skip: skip - 1 });
  }
  async findByName(c_name: string): Promise<Color | null> {
    return await this.colorRepository.findOne({ where: { c_name } });
  }
  async updateById(id: string, input: UpdateColorInput): Promise<Color> {
    await this.colorRepository.update({ id }, input);
    return await this.colorRepository.findOneByOrFail({ id });
  }
  async deleteById(id: string): Promise<DeleteResult> {
    return await this.colorRepository.delete({ id });
  }
}
