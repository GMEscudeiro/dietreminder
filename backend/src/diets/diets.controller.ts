import { Controller, Get, UseGuards, Request, Param, NotFoundException } from '@nestjs/common';
import { DietsService } from './diets.service';
import { AuthGuard } from '../auth/auth.guard';

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
}
