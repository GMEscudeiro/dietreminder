import { IsString, IsNotEmpty, IsUUID, IsArray, ValidateNested, IsNumber, IsPositive, IsMilitaryTime, IsOptional, IsInt, Min, Max, ArrayMinSize, ArrayMaxSize } from 'class-validator';
import { Type } from 'class-transformer';

// DTO para cada item da lista de alimentos
export class ItemRefeicaoDto {
  @IsNotEmpty()
  @IsString()
  alimentoId: string;

  @IsNumber()
  @IsPositive({ message: 'A quantidade deve ser um número maior que zero' })
  quantidade: number;
}

// DTO principal da Refeição
export class CreateRefeicaoDto {
  @IsString()
  @IsNotEmpty({ message: 'O nome da refeição é obrigatório' })
  nome: string;

  @IsUUID('4', { message: 'ID da dieta inválido' })
  dietaId: string;

  @IsMilitaryTime({ message: 'O horário deve estar no formato HH:mm' })
  horario: string;

  // Array de dias da semana (0=Dom, 1=Seg, ..., 6=Sáb)
  // Cada dia selecionado gera uma refeição clonada separada no banco
  @IsOptional()
  @IsArray()
  @ArrayMinSize(0)
  @ArrayMaxSize(7)
  @IsInt({ each: true })
  @Min(0, { each: true })
  @Max(6, { each: true })
  diasDaSemana?: number[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ItemRefeicaoDto)
  itens: ItemRefeicaoDto[];
}
