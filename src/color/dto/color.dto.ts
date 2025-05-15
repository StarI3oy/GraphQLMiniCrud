import { InputType, Field, PartialType, ObjectType, ID } from '@nestjs/graphql';

@ObjectType()
export class ColorType {
  @Field(() => ID)
  id: string;

  @Field()
  c_name: string;

  @Field()
  c_hex: string;

  @Field()
  c_rgb: string;
}

@InputType()
export class CreateColorInput {
  @Field()
  c_name: string;

  @Field()
  c_hex: string;

  @Field()
  c_rgb: string;
}

@InputType()
export class UpdateColorInput extends PartialType(CreateColorInput) {
  @Field()
  id: string;
}
