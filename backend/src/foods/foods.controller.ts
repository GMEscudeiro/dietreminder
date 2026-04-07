import { Controller, Get, Query } from '@nestjs/common';
import { FoodsService } from './foods.service';

@Controller('foods')
export class FoodsController {
  constructor(private readonly foodsService: FoodsService) { }

  @Get()
  async getAll(@Query('search') search?: string) {
    // Passamos o termo de busca para o service
    return this.foodsService.findAll(search);
  }
}
