import { Module } from '@nestjs/common';
import { DietsController } from './diets.controller';
import { DietsService } from './diets.service';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [DietsController],
  providers: [DietsService, PrismaService]
})
export class DietsModule { }
