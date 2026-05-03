import { IsString, IsNotEmpty, IsUUID, IsArray, ValidateNested, IsNumber, IsPositive, IsMilitaryTime } from 'class-validator';
import { Type } from 'class-transformer';

// DTO para cada item da lista de alimentos
export class ItemRefeicaoDto {
  @IsNotEmpty()
  @IsString() // O ID vem como string do front, mas converteremos para BigInt no Service
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

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ItemRefeicaoDto)
  itens: ItemRefeicaoDto[];
}
