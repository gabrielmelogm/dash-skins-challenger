import * as request from 'supertest';

import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ObjectId } from 'mongodb';

import { UsersModule } from '../src/modules/users/users.module';
import { User } from '../src/modules/users/entities/User.entity';
import { UsersController } from '../src/modules/users/users.controller';
import { UsersService } from '../src/modules/users/users.service';
import { ormConfig } from '../src/database/ormconfig';

describe('UsersController (e2e)', () => {
  let app: INestApplication;
  let user: User;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(ormConfig),
        TypeOrmModule.forFeature([User]),
        UsersModule,
      ],
      controllers: [UsersController],
      providers: [UsersService],
    }).compile();

    app = moduleFixture.createNestApplication();
    user = {
      _id: new ObjectId(),
      name: faker.person.firstName(),
      email: faker.internet.email(),
      age: faker.number.int({ min: 18, max: 90 }),
      avatar: faker.internet.url(),
    };
    await app.init();
  });

  it('/users (POST)', async () => {
    const response = await request(app.getHttpServer())
      .post('/users')
      .send(user)
      .expect(HttpStatus.CREATED);

    const createdUser = response.body;

    expect(createdUser).toHaveProperty('_id');
  });

  afterAll(async () => {
    await app.close();
  });
});
