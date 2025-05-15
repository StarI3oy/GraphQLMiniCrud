import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
@Entity()
export class Color {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column({ unique: true })
  @Field()
  c_name: string;

  @Column()
  @Field()
  c_hex: string;

  @Column()
  @Field()
  c_rgb: string;
}
