import { Module } from '@nestjs/common';
import { MealsService } from './meals.service';
import { MealsController } from './meals.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  providers: [MealsService, PrismaService],
  controllers: [MealsController],
})
export class MealsModule { }
