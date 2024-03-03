import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/User.entity';
import { Repository, UpdateResult } from 'typeorm';
import { ObjectId } from 'mongodb';
import { UpdateUserDto } from './dto/update-user.dto';

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

  async FindById(id: string): Promise<User> {
    const user = await this.usersRepository.findOneOrFail({
      where: { _id: new ObjectId(id) },
    });

    if (!user) {
      throw new NotFoundException(null);
    }

    return user;
  }

  async Update(id: string, user: UpdateUserDto): Promise<UpdateResult> {
    const userSearched = await this.FindById(id);

    if (userSearched) {
      const updatedUser = await this.usersRepository.update(
        userSearched._id,
        user,
      );

      return updatedUser;
    }
  }
}
