import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ColorService } from '../services/color.service';
import { ColorType, CreateColorInput, UpdateColorInput } from '../dto/color.dto';
@Resolver()
export class ColorResolver {
  constructor(private readonly colorService: ColorService) {}

  @Query(() => [ColorType])
  async colorsAll(): Promise<ColorType[]> {
    return this.colorService.findAll();
  }
  @Query(() => [ColorType])
  async colorsPaginated(
    @Args('page', { type: () => Number, nullable: false }) page: number = 1,
    @Args('limit', { type: () => Number, nullable: true }) limit: number = 5,
  ): Promise<ColorType[]> {
    return await this.colorService.findPagination(page, limit);
  }
  @Query(() => ColorType || null)
  async colorByName(
    @Args('name', { type: () => String, nullable: true }) name: string = 'Yellow',
  ): Promise<ColorType | null> {
    return await this.colorService.findByName(name);
  }

  @Mutation(() => ColorType)
  async createColor(@Args('input') input: CreateColorInput): Promise<ColorType> {
    return this.colorService.create(input);
  }

  @Mutation(() => ColorType)
  async updateColor(@Args('input') input: UpdateColorInput): Promise<ColorType> {
    return await this.colorService.updateById(input.id, input);
  }

  @Mutation(() => String)
  async deleteColor(@Args('id') id: string): Promise<string> {
    await this.colorService.deleteById(id);
    return `Color with ID ${id} deleted`;
  }
}
