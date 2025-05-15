/* eslint-disable @typescript-eslint/unbound-method */
import { Test } from '@nestjs/testing';
import { ColorResolver } from './color.resolver';
import { ColorService } from '../services/color.service';
import { CreateColorInput, UpdateColorInput } from '../dto/color.dto';
import { NotFoundException } from '@nestjs/common';

const mockColor = {
  id: '1',
  c_name: 'red',
  c_hex: '#FF0000',
  c_rgb: 'rgb(255,0,0)',
};

describe('ColorResolver', () => {
  let resolver: ColorResolver;
  let service: ColorService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        ColorResolver,
        {
          provide: ColorService,
          useValue: {
            findAll: jest.fn().mockResolvedValue([mockColor]),
            findPagination: jest.fn().mockResolvedValue([mockColor]),
            findByName: jest.fn().mockResolvedValue(mockColor),
            create: jest.fn().mockResolvedValue(mockColor),
            updateById: jest.fn().mockResolvedValue(mockColor),
            deleteById: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    resolver = moduleRef.get<ColorResolver>(ColorResolver);
    service = moduleRef.get<ColorService>(ColorService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('colorsAll', () => {
    it('should return an array of all colors', async () => {
      const result = await resolver.colorsAll();
      expect(result).toEqual([mockColor]);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('colorsPaginated', () => {
    it('should return paginated colors', async () => {
      const result = await resolver.colorsPaginated(1);
      expect(result).toEqual([mockColor]);
      expect(service.findPagination).toHaveBeenCalledWith(1, 5);
    });
  });

  describe('colorByName', () => {
    it('should return a color by name', async () => {
      const result = await resolver.colorByName('red');
      expect(result).toEqual(mockColor);
      expect(service.findByName).toHaveBeenCalledWith('red');
    });
  });

  describe('createColor', () => {
    it('should call service.create with input', async () => {
      const input: CreateColorInput = {
        c_name: 'blue',
        c_hex: '#0000FF',
        c_rgb: 'rgb(0,0,255)',
      };
      const result = await resolver.createColor(input);
      expect(result).toEqual(mockColor);
      expect(service.create).toHaveBeenCalledWith(input);
    });
  });

  describe('updateColor', () => {
    it('should call service.update with input', async () => {
      const input: UpdateColorInput = {
        id: '1',
        c_name: 'updated-red',
        c_hex: '#FF0000',
        c_rgb: 'rgb(255,0,0)',
      };
      const result = await resolver.updateColor(input);
      expect(result).toEqual(mockColor);
      expect(service.updateById).toHaveBeenCalledWith(input.id, input);
    });

    it('should throw NotFoundException if color not found', async () => {
      jest.spyOn(service, 'updateById').mockRejectedValueOnce(new NotFoundException());

      const input: UpdateColorInput = {
        id: 'invalid-id',
        c_name: 'non-existent',
        c_hex: '#000000',
        c_rgb: 'rgb(0,0,0)',
      };

      await expect(resolver.updateColor(input)).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteColor', () => {
    it('should call service.remove with id', async () => {
      const result = await resolver.deleteColor('1');
      expect(result).toBe(`Color with ID 1 deleted`);
      expect(service.deleteById).toHaveBeenCalledWith('1');
    });

    it('should throw NotFoundException if color not found', async () => {
      jest.spyOn(service, 'deleteById').mockRejectedValueOnce(new NotFoundException());

      await expect(resolver.deleteColor('invalid-id')).rejects.toThrow(NotFoundException);
    });
  });
});
