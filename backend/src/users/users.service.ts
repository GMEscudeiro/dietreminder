import { Injectable } from '@nestjs/common';
import { User } from 'src/auth/interfaces/user.interface';


@Injectable()
export class UsersService {
  public users: User[] = [];

  async findOne(email: string): Promise<User | undefined> {
    return this.users.find(user => user.email === email);
  }
}

