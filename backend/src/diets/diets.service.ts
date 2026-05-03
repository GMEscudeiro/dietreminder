import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

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
}
