import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/User.entity';
import { Repository } from 'typeorm';
import { ObjectId } from 'mongodb';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async Store(user: CreateUserDto): Promise<User> {
    const getUser = await this.usersRepository.findOne({
      where: {
        email: user.email,
      },
    });

    if (getUser) throw new ConflictException('User with email already exists');

    const createdUser = this.usersRepository.create(user);
    return await this.usersRepository.save(createdUser);
  }

  async FindById(id: ObjectId): Promise<User> {
    try {
      return await this.usersRepository.findOneOrFail({
        where: { _id: id },
      });
    } catch (error) {
      new NotFoundException();
      return null;
    }
  }
}
