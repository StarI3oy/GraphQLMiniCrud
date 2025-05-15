/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { ColorService } from './color.service';
import { DeleteResult, Repository } from 'typeorm';
import { Color } from '../entities/color.entities';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateColorInput } from '../dto/color.dto';

const mockColor: Color = {
  id: '1',
  c_name: 'red',
  c_hex: '#FF0000',
  c_rgb: 'rgb(255,0,0)',
};

describe('ColorService', () => {
  let service: ColorService;
  let repository: Repository<Color>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ColorService,
        {
          provide: getRepositoryToken(Color),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<ColorService>(ColorService);
    repository = module.get<Repository<Color>>(getRepositoryToken(Color));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new color', async () => {
      const input: CreateColorInput = {
        c_name: 'blue',
        c_hex: '#0000FF',
        c_rgb: 'rgb(0,0,255)',
      };

      jest.spyOn(repository, 'create').mockReturnValue(mockColor);
      jest.spyOn(repository, 'save').mockResolvedValue(mockColor);

      const result = await service.create(input);

      expect(repository.create).toHaveBeenCalledWith(input);
      expect(repository.save).toHaveBeenCalledWith(mockColor);
      expect(result).toEqual(mockColor);
    });
  });

  describe('findall', () => {
    it('should find all colors', async () => {
      jest.spyOn(repository, 'find').mockResolvedValue([mockColor]);
      const result = await service.findAll();

      expect(repository.find).toHaveBeenCalled();
      expect(result).toContainEqual(mockColor);
    });
  });
  describe('findOneByName', () => {
    it('should return a color by name', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(mockColor);

      const result = await service.findByName(mockColor.c_name);

      expect(repository.findOne).toHaveBeenCalledWith({ where: { c_name: mockColor.c_name } });
      expect(result).toEqual(mockColor);
    });

    it('should return null if color not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      const result = await service.findByName('null');

      expect(repository.findOne).toHaveBeenCalledWith({ where: { c_name: 'null' } });
      expect(result).toBeNull();
    });
  });
  describe('findPaginated', () => {
    it('should return paginated colors', async () => {
      const page = 1;

      jest.spyOn(repository, 'find').mockResolvedValue([mockColor]);

      const result = await service.findPagination(page);

      expect(repository.find).toHaveBeenCalledWith({
        take: 5,
        skip: page - 1,
      });
      expect(result).toContainEqual(mockColor);
    });
  });
  describe('delete', () => {
    it('should delete a color by ID', async () => {
      jest.spyOn(repository, 'delete').mockResolvedValue({ affected: 1, raw: {} } as DeleteResult);

      const result = await service.deleteById(mockColor.id);

      expect(repository.delete).toHaveBeenCalledWith({ id: mockColor.id });
      expect(result.affected).toBe(1);
    });
  });
});
