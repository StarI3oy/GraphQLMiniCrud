import { Module } from '@nestjs/common';
import { ColorService } from './services/color.service';
import { ColorResolver } from './resolvers/color.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Color } from './entities/color.entities';

@Module({
  imports: [TypeOrmModule.forFeature([Color])],
  providers: [ColorResolver, ColorService],
})
export class ColorModule {}
