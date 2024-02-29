import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';

describe('UsersController', () => {
  let usersController: UsersController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
    }).compile();

    usersController = app.get<UsersController>(UsersController);
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
    it.todo('should not be able get a user without send a email')
    it.todo('should not be able update a does not exist user')
    it.todo('should not be able update a user with same email of other user')
  })
});
