import { Controller, Get, Post, Patch, Body, UseGuards, Request, Param, NotFoundException } from '@nestjs/common';
import { DietsService } from './diets.service';
import { AuthGuard } from '../auth/auth.guard';
import { CreateDietDto } from './dto/create-diet.dto';
import { UpdateDietDto } from './dto/update-diet.dto';

@Controller('diets')
@UseGuards(AuthGuard)
export class DietsController {
  constructor(private readonly dietsService: DietsService) { }

  @Get()
  async findAll(@Request() req) {
    return this.dietsService.findAllByUser(req.user.sub);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req) {
    const dieta = await this.dietsService.findOne(id, req.user.sub);
    if (!dieta) {
      throw new NotFoundException('Dieta não encontrada.');
    }
    return dieta;
  }

  @Post()
  async create(@Request() req, @Body() createDietDto: CreateDietDto) {
    return this.dietsService.create(req.user.sub, createDietDto);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Request() req, @Body() updateDietDto: UpdateDietDto) {
    return this.dietsService.update(id, req.user.sub, updateDietDto);
  }
}
