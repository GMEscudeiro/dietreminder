import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateRefeicaoDto } from './dto/create-refeicao.dto';
import { UpdateRefeicaoDto } from './dto/update-refeicao.dto';

@Injectable()
export class MealsService {
  constructor(private prisma: PrismaService) { }

  async findAllByDiet(dietaId: string, diaDaSemana?: number) {
    const where: any = { dietaId };

    // Se vier o dia da semana, filtra apenas refeições daquele dia
    // OU refeições sem dia definido (aparecem sempre)
    if (diaDaSemana !== undefined && diaDaSemana !== null) {
      where.OR = [
        { dia_da_semana: diaDaSemana },
        { dia_da_semana: null },
      ];
    }

    return this.prisma.refeicoes.findMany({
      where,
      include: {
        alimentos_refeicoes: {
          include: {
            alimentos: true,
          },
        },
      },
      orderBy: {
        horario: 'asc',
      },
    });
  }

  async create(dto: CreateRefeicaoDto) {
    const dias = dto.diasDaSemana && dto.diasDaSemana.length > 0
      ? dto.diasDaSemana
      : [null]; // null = sem dia específico (aparece todos os dias)

    // Cria uma refeição clone para cada dia selecionado
    const criadas = await Promise.all(
      dias.map((dia) =>
        this.prisma.refeicoes.create({
          data: {
            nome: dto.nome,
            dietaId: dto.dietaId,
            created_at: new Date(),
            horario: new Date(`1970-01-01T${dto.horario}Z`),
            dia_da_semana: dia,
            alimentos_refeicoes: {
              create: dto.itens.map(item => ({
                alimento_id: BigInt(item.alimentoId),
                quantidade: item.quantidade,
              })),
            },
          },
          include: {
            alimentos_refeicoes: {
              include: { alimentos: true },
            },
          },
        })
      )
    );

    return criadas;
  }

  async update(id: string, dto: UpdateRefeicaoDto) {
    return this.prisma.$transaction(async (tx) => {
      await tx.refeicoes.update({
        where: { id },
        data: {
          nome: dto.nome,
          dietaId: dto.dietaId,
          horario: dto.horario ? new Date(`1970-01-01T${dto.horario}:00Z`) : undefined,
          dia_da_semana: dto.diaDaSemana !== undefined ? dto.diaDaSemana : undefined,
        },
      });

      if (dto.itens) {
        await tx.alimentos_refeicoes.deleteMany({
          where: { refeicao_id: id },
        });

        await tx.alimentos_refeicoes.createMany({
          data: dto.itens.map((item) => ({
            refeicao_id: id,
            alimento_id: BigInt(item.alimentoId),
            quantidade: item.quantidade,
          })),
        });
      }

      return tx.refeicoes.findUnique({
        where: { id },
        include: { alimentos_refeicoes: { include: { alimentos: true } } },
      });
    });
  }

  async updateStatus(id: string, concluida: boolean) {
    return this.prisma.refeicoes.update({
      where: { id },
      data: { concluida },
      include: {
        alimentos_refeicoes: {
          include: { alimentos: true },
        },
      },
    });
  }
}
