import * as request from 'supertest';

import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersModule } from '../src/modules/users/users.module';
import { User } from '../src/modules/users/entities/User.entity';
import { UsersController } from '../src/modules/users/users.controller';
import { UsersService } from '../src/modules/users/users.service';
import { testOrmConfig } from '../src/database/ormconfig';
import { UpdateResult } from 'typeorm';

describe('UsersController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(testOrmConfig),
        TypeOrmModule.forFeature([User]),
        UsersModule,
      ],
      controllers: [UsersController],
      providers: [UsersService],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('(POST) /users', async () => {
    const response = await request(app.getHttpServer())
      .post('/users')
      .send({
        name: faker.person.firstName(),
        email: faker.internet.email(),
        age: faker.number.int({ min: 18, max: 90 }),
        avatar: faker.internet.url(),
      })
      .expect(HttpStatus.CREATED);

    const createdUser = response.body;

    expect(createdUser).toHaveProperty('_id');
  });

  it('(GET) /users/:id', async () => {
    const createUserResponse = await request(app.getHttpServer())
      .post('/users')
      .send({
        name: faker.person.firstName(),
        email: faker.internet.email(),
        age: faker.number.int({ min: 18, max: 90 }),
        avatar: faker.internet.url(),
      })
      .expect(HttpStatus.CREATED);

    const userId = createUserResponse.body._id;

    const response = await request(app.getHttpServer())
      .get(`/users/${userId}`)
      .expect(HttpStatus.OK);

    const userSearched = response.body;

    expect(userSearched).toHaveProperty('_id');
  });

  it('(PUT) /users/:id', async () => {
    const createUserResponse = await request(app.getHttpServer())
      .post('/users')
      .send({
        name: faker.person.firstName(),
        email: faker.internet.email(),
        age: faker.number.int({ min: 18, max: 90 }),
        avatar: faker.internet.url(),
      })
      .expect(HttpStatus.CREATED);

    const expectedResponse = {
      generatedMaps: [],
      raw: {
        acknowledged: true,
        modifiedCount: 1,
        upsertedId: null,
        upsertedCount: 0,
        matchedCount: 1,
      },
      affected: 1,
    };

    const userId = createUserResponse.body._id;

    const response = await request(app.getHttpServer())
      .put(`/users/${userId}`)
      .send({
        name: faker.person.firstName(),
        email: faker.internet.email(),
        age: faker.number.int({ min: 18, max: 90 }),
        avatar: faker.internet.url(),
      })
      .expect(HttpStatus.OK);

    const updatedUser = response.body;

    expect(updatedUser).toStrictEqual(expectedResponse);
  });

  afterAll(async () => {
    await app.close();
  });
});
