import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateDietDto } from './dto/create-diet.dto';
import { UpdateDietDto } from './dto/update-diet.dto';

@Injectable()
export class DietsService {
  constructor(private prisma: PrismaService) { }

  async findAllByUser(userId: string) {
    return this.prisma.dietas.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        nomeDieta: 'asc',
      },
    });
  }

  async findOne(id: string, userId: string) {
    return this.prisma.dietas.findFirst({
      where: {
        id,
        userId: userId,
      },
    });
  }

  async create(userId: string, data: CreateDietDto) {
    if (data.Ativa) {
      await this.desativarOutrasDietas(userId);
    }

    return this.prisma.dietas.create({
      data: {
        ...data,
        userId,
        created_at: new Date(),
      },
    });
  }

  async update(id: string, userId: string, data: UpdateDietDto) {
    if (data.Ativa) {
      await this.desativarOutrasDietas(userId);
    }

    return this.prisma.dietas.update({
      where: {
        id,
        userId,
      },
      data,
    });
  }

  private async desativarOutrasDietas(userId: string) {
    await this.prisma.dietas.updateMany({
      where: {
        userId,
        Ativa: true,
      },
      data: {
        Ativa: false,
      },
    });
  }
}
