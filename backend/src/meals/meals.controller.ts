import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { MealsService } from './meals.service';
import { CreateRefeicaoDto } from './dto/create-refeicao.dto';
import { UpdateRefeicaoDto } from './dto/update-refeicao.dto';

@Controller('meals')
export class MealsController {
  constructor(private readonly mealsService: MealsService) { }

  @Post()
  async create(@Body() createRefeicaoDto: CreateRefeicaoDto) {
    return this.mealsService.create(createRefeicaoDto);
  }

  @Get()
  async findAll(
    @Query('dietaId') dietaId: string,
    @Query('diaDaSemana') diaDaSemana?: string,
  ) {
    if (!dietaId) {
      return [];
    }
const dia = diaDaSemana !== undefined ? parseInt(diaDaSemana, 10) : undefined;
const diaFinal = dia !== undefined && !isNaN(dia) ? dia : undefined;
return this.mealsService.findAllByDiet(dietaId, diaFinal);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateRefeicaoDto: UpdateRefeicaoDto) {
    return this.mealsService.update(id, updateRefeicaoDto);
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body('concluida') concluida: boolean,
  ) {
    return this.mealsService.updateStatus(id, concluida);
  }
}
