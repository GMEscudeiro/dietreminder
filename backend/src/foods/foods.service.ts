import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class FoodsService {
  constructor(private prisma: PrismaService) { }

  async findAll(search?: string) {
    return this.prisma.alimentos.findMany({
      orderBy: { descricao: 'asc' },
      where: {
        descricao: {
          contains: search || '',
          mode: 'insensitive',
        },
      },
      take: 10,
      select: {
        id: true,
        descricao: true,
        energia_kcal: true,
        Prote_na__g_: true,
        Carboidrato__g_: true,
        Lip_deos__g_: true
      }
    });
  }
}
