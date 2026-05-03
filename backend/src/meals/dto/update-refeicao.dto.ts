import { IsOptional, IsInt, Min, Max } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { CreateRefeicaoDto } from './create-refeicao.dto';

export class UpdateRefeicaoDto extends PartialType(CreateRefeicaoDto) {
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(6)
  diaDaSemana?: number;
}