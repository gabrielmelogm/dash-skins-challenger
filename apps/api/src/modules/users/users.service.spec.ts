import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker';

import { UsersService } from './users.service';
import { User } from './entities/User.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { ObjectId } from 'mongodb';

describe('Users Service', () => {
  let usersService: UsersService;
  let usersRepository: Repository<User>;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();

    usersService = app.get<UsersService>(UsersService);
    usersRepository = app.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be able the service is defined', () => {
    expect(usersService).toBeDefined();
  });

  describe('Store', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUserDto = {
        name: faker.person.firstName(),
        age: faker.number.int({ min: 18, max: 100 }),
        email: faker.internet.email(),
        avatar: faker.internet.url(),
      };

      jest.spyOn(usersService, 'FindByEmail').mockResolvedValue(null);
      jest
        .spyOn(usersRepository, 'create')
        .mockReturnValue(createUserDto as User);
      jest
        .spyOn(usersRepository, 'save')
        .mockResolvedValue(createUserDto as User);

      const result = await usersService.Store(createUserDto);

      expect(result).toEqual(createUserDto);
    });

    it('should throw ConflictException when trying to create a user with an existing email', async () => {
      const existingUser: User = {
        _id: new ObjectId(),
        name: faker.person.firstName(),
        age: 35,
        email: 'existing@example.com',
        avatar: faker.internet.url(),
      };

      const createUserDto: CreateUserDto = {
        name: faker.person.firstName(),
        age: faker.number.int({ min: 18, max: 100 }),
        email: existingUser.email,
        avatar: faker.internet.url(),
      };

      jest.spyOn(usersService, 'FindByEmail').mockResolvedValue(existingUser);

      try {
        await usersService.Store(createUserDto);
      } catch (error) {
        expect(error).toBeInstanceOf(ConflictException);
        expect(error.message).toBe('User with email already exists');
      }
    });
  });

  describe('FindByEmail', () => {
    it('should find a user by email', async () => {
      const email = faker.internet.email();
      const user = {
        _id: new ObjectId(),
        name: faker.person.firstName(),
        age: faker.number.int({ min: 18, max: 100 }),
        email,
        avatar: faker.internet.url(),
      };

      jest
        .spyOn(usersRepository, 'findOneOrFail')
        .mockResolvedValue(user as User);

      const result = await usersService.FindByEmail(email);

      expect(result).toEqual(user);
    });
    it('should not be able get a user with nonexistent email', async () => {
      const email = faker.internet.email();

      jest
        .spyOn(usersRepository, 'findOneOrFail')
        .mockRejectedValueOnce(new NotFoundException());

      await expect(usersService.FindByEmail(email)).resolves.toEqual(null);
    });
  });

  describe('Update', () => {
    it.todo('should be able update a user');
    it.todo('should not be able update a does not exist user');
    it.todo('should not be able update email');
  });
});
