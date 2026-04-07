import { PartialType } from '@nestjs/mapped-types';
import { CreateRefeicaoDto } from './create-refeicao.dto';

export class UpdateRefeicaoDto extends PartialType(CreateRefeicaoDto) { }
