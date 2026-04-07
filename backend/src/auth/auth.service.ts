import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma.service'; // Importe seu service
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService
  ) { }

  async signUp(data: RegisterDto) {
    const userExists = await this.prisma.usuarios.findUnique({
      where: { email: data.email }
    });

    if (userExists) {
      throw new BadRequestException('Email já cadastrado');
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(data.password, salt);

    try {
      const newUser = await this.prisma.$transaction(async (tx) => {
        const user = await tx.usuarios.create({
          data: {
            email: data.email,
            nome: data.name,
            senha_hash: hashedPassword,
            created_at: new Date()
          }
        });

        await tx.dietas.create({
          data: {
            nomeDieta: "Dieta principal",
            userId: user.id,
            created_at: new Date()
          },
        });
        return user;
      })

      const { senha_hash, ...result } = newUser;
      return result;

    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Erro ao criar conta e dieta. Tente novamente.');
    }
  }

  async signIn(data: LoginDto): Promise<{ access_token: string }> {
    const user = await this.prisma.usuarios.findUnique({
      where: { email: data.email }
    });

    if (!user || !user.senha_hash) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const isMatch = await bcrypt.compare(data.password, user.senha_hash);

    if (!isMatch) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const payload = { sub: user.id, email: user.email };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
