
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersController } from './users.controller';
import { User } from './entities/User.entity';
import { UsersService } from './users.service';
import { ormConfig } from '../../database/ormconfig';
import { UsersModule } from './users.module';

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forRoot(ormConfig), TypeOrmModule.forFeature([User]), UsersModule],
      controllers: [UsersController],
      providers: [UsersService]
    }).compile();

    usersController = app.get<UsersController>(UsersController);
    usersService = app.get<UsersService>(UsersService)
  });

  it('should be able the controller is defined', () => {
    expect(usersController).toBeDefined()
  })

  describe('Users Controller - Success', () => {
    it.todo('should be able create a new user')
    it.todo('should be able get a user by email')
    it.todo('should be able update a user')
  });

  describe('Users Controller - Error', () => {
    it.todo('should not be able create a new user with same email')
    it.todo('should not be able get a user with nonexistent email')
    it.todo('should not be able update a does not exist user')
    it.todo('should not be able update a user with same email of other user')
  })
});
