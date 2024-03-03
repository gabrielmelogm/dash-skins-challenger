import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/User.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async Store(user: CreateUserDto): Promise<User> {
    const getUser = await this.FindByEmail(user.email);

    if (getUser) throw new ConflictException('User with email already exists');

    const createdUser = this.usersRepository.create(user);
    return await this.usersRepository.save(createdUser);
  }

  async FindByEmail(email: string): Promise<User> {
    try {
      return await this.usersRepository.findOneOrFail({
        where: { email },
      });
    } catch (error) {
      new NotFoundException();
      return null;
    }
  }
}
