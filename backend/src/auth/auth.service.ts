import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { User } from './interfaces/user.interface';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) { }

  async signUp(data: RegisterDto) {
    const userExists = this.usersService.users.find(user => user.email === data.email);
    if (userExists) {
      throw new BadRequestException('Email ja cadastrado');
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(data.password, salt);

    const newUser = {
      id: this.usersService.users.length + 1,
      email: data.email,
      password: hashedPassword, // Guardamos a senha criptografada
      name: data.name,
    };

    this.usersService.users.push(newUser);

    const { password, ...result } = newUser;
    return result;
  }

  async signIn(
    data: LoginDto
  ): Promise<{ access_token: string }> {
    const user = await this.usersService.findOne(data.email);
    if (!user || !(await bcrypt.compare(data.password, user.password))) {
      throw new UnauthorizedException();
    }
    const payload = { sub: user.id, email: user.email };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
