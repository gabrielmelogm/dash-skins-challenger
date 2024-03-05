import * as request from 'supertest'

import { faker } from '@faker-js/faker'
import { HttpStatus, INestApplication } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { TypeOrmModule } from '@nestjs/typeorm'

import { JwtModule } from '@nestjs/jwt'
import { testOrmConfig } from '../src/database/ormconfig'
import { CreateUserDto } from '../src/modules/users/dto/create-user.dto'
import { User } from '../src/modules/users/entities/User.entity'
import { UsersController } from '../src/modules/users/users.controller'
import { UsersModule } from '../src/modules/users/users.module'
import { UsersService } from '../src/modules/users/users.service'

describe('UsersController (e2e)', () => {
	let app: INestApplication
	let userService: UsersService

	beforeAll(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [
				TypeOrmModule.forRoot(testOrmConfig),
				TypeOrmModule.forFeature([User]),
				UsersModule,
				JwtModule.register({ secret: faker.string.uuid() }),
			],
			controllers: [UsersController],
			providers: [
				{
					provide: UsersService,
					useValue: {
						Store: jest.fn(),
						FindAll: jest.fn(),
						FindById: jest.fn(),
						Update: jest.fn(),
					},
				},
			],
		}).compile()

		app = moduleFixture.createNestApplication()
		await app.init()

		userService = moduleFixture.get<UsersService>(UsersService)
	})

	it('(POST) /users', async () => {
		const fakeToken = faker.string.uuid()

		const createUserDto: CreateUserDto = {
			name: faker.person.firstName(),
			email: faker.internet.email(),
			age: faker.number.int({ min: 18, max: 90 }),
			avatar: faker.internet.url(),
			password: faker.internet.password(),
		}

		const response = await request(app.getHttpServer())
			.post('/users')
			.set('Authorization', `Bearer ${fakeToken}`)
			.send(createUserDto)
			.expect(HttpStatus.CREATED)

		expect(userService.Store).toHaveBeenCalledWith(createUserDto)
	})

	it('(GET) /users', async () => {
		const listUsers: User[] = []

		for (let i: number; i < 2; i++) {
			const data = await request(app.getHttpServer())
				.post('/users')
				.send({
					name: faker.person.firstName(),
					email: faker.internet.email(),
					age: faker.number.int({ min: 18, max: 90 }),
					avatar: faker.internet.url(),
				})
				.expect(HttpStatus.CREATED)
			listUsers.push(data.body)
		}

		const response = await request(app.getHttpServer())
			.get('/users')
			.expect(HttpStatus.OK)

		const users: User[] = response.body

		expect(Array.isArray(users)).toBe(true)

		for (const user of users) {
			expect(user).toHaveProperty('_id')
			expect(user).toHaveProperty('name')
			expect(user).toHaveProperty('email')
			expect(user).toHaveProperty('age')
			expect(user).toHaveProperty('avatar')
		}
	})

	it('(GET) /users/:id', async () => {
		const createUserResponse = await request(app.getHttpServer())
			.post('/users')
			.send({
				name: faker.person.firstName(),
				email: faker.internet.email(),
				age: faker.number.int({ min: 18, max: 90 }),
				avatar: faker.internet.url(),
			})
			.expect(HttpStatus.CREATED)

		const userId = createUserResponse.body._id

		const response = await request(app.getHttpServer())
			.get(`/users/${userId}`)
			.expect(HttpStatus.OK)

		const userSearched = response.body

		expect(userSearched).toHaveProperty('_id')
	})

	it('(PUT) /users/:id', async () => {
		const createUserResponse = await request(app.getHttpServer())
			.post('/users')
			.send({
				name: faker.person.firstName(),
				email: faker.internet.email(),
				age: faker.number.int({ min: 18, max: 90 }),
				avatar: faker.internet.url(),
			})
			.expect(HttpStatus.CREATED)

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
		}

		const userId = createUserResponse.body._id

		const response = await request(app.getHttpServer())
			.put(`/users/${userId}`)
			.send({
				name: faker.person.firstName(),
				email: faker.internet.email(),
				age: faker.number.int({ min: 18, max: 90 }),
				avatar: faker.internet.url(),
			})
			.expect(HttpStatus.OK)

		const updatedUser = response.body

		expect(updatedUser).toStrictEqual(expectedResponse)
	})

	afterAll(async () => {
		await app.close()
	})
})
