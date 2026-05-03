import { IsString, IsNotEmpty, IsNumber, IsBoolean, IsOptional, IsPositive } from 'class-validator';

export class CreateDietDto {
  @IsString()
  @IsNotEmpty({ message: 'O nome da dieta é obrigatório' })
  nomeDieta: string;

  @IsNumber()
  @IsPositive()
  caloriasTot: number;

  @IsNumber()
  @IsPositive()
  proteinaAlvo: number;

  @IsNumber()
  @IsPositive()
  carboidratoAlvo: number;

  @IsNumber()
  @IsPositive()
  gorduraAlvo: number;

  @IsBoolean()
  @IsOptional()
  Ativa?: boolean;
}
