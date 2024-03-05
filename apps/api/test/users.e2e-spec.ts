import * as request from 'supertest'

import { faker } from '@faker-js/faker'
import { HttpStatus, INestApplication } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { TypeOrmModule } from '@nestjs/typeorm'

import { ConfigModule } from '@nestjs/config'
import { testOrmConfig } from '../src/database/ormconfig'
import { RegExHelper } from '../src/helpers/regex.helper'
import { AuthModule } from '../src/modules/auth/auth.module'
import { CreateUserDto } from '../src/modules/users/dto/create-user.dto'
import { User } from '../src/modules/users/entities/User.entity'
import { UsersController } from '../src/modules/users/users.controller'
import { UsersModule } from '../src/modules/users/users.module'
import { UsersService } from '../src/modules/users/users.service'
import { user } from './user.factory'

describe('UsersController (e2e)', () => {
	let app: INestApplication
	let userService: UsersService
	let authToken: string

	beforeAll(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [
				ConfigModule.forRoot({
					isGlobal: true,
				}),
				TypeOrmModule.forRoot(testOrmConfig),
				UsersModule,
				AuthModule,
			],
			controllers: [],
		}).compile()

		app = moduleFixture.createNestApplication()
		await app.init()

		userService = app.get<UsersService>(UsersService)

		await userService
			.FindByEmail(user.email)
			.then((res) => {
				return res
			})
			.catch(async () => {
				await userService.Store({
					name: user.name,
					email: user.email,
					age: user.age,
					avatar: user.avatar,
					password: user.password,
				})
			})

		const response = await request(app.getHttpServer())
			.post('/auth/login')
			.send({ email: user.email, password: user.password })
			.expect(HttpStatus.CREATED)

		expect(response.body).toHaveProperty('token')

		authToken = `Bearer ${response.body.token}`
	})

	beforeEach(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [
				TypeOrmModule.forRoot(testOrmConfig),
				TypeOrmModule.forFeature([User]),
				UsersModule,
				AuthModule,
			],
			controllers: [UsersController],
			providers: [UsersService],
		}).compile()

		app = moduleFixture.createNestApplication()
		await app.init()
	})

	it('(POST) /users', async () => {
		const createUserDto: CreateUserDto = {
			name: faker.person.firstName(),
			email: faker.internet.email(),
			age: faker.number.int({ min: 18, max: 90 }),
			avatar: faker.image.urlLoremFlickr(),
			password: 'Senha@123',
		}

		const response = await request(app.getHttpServer())
			.post('/users')
			.set('Authorization', authToken)
			.send(createUserDto)
			.expect(HttpStatus.CREATED)

		const createdUser = response.body

		expect(createdUser).toHaveProperty('_id')
	})

	it('(GET) /users', async () => {
		const listUsers: User[] = []

		for (let i: number; i < 2; i++) {
			const createUserDto: CreateUserDto = {
				name: faker.person.firstName(),
				email: faker.internet.email(),
				age: faker.number.int({ min: 18, max: 90 }),
				avatar: faker.image.urlLoremFlickr(),
				password: 'Senha@123',
			}

			const data = await request(app.getHttpServer())
				.post('/users')
				.send(createUserDto)
				.expect(HttpStatus.CREATED)
			listUsers.push(data.body)
		}

		const response = await request(app.getHttpServer())
			.get('/users')
			.set('Authorization', authToken)
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
		const createUserDto: CreateUserDto = {
			name: faker.person.firstName(),
			email: faker.internet.email(),
			age: faker.number.int({ min: 18, max: 90 }),
			avatar: faker.image.urlLoremFlickr(),
			password: 'Senha@123',
		}

		const createUserResponse = await request(app.getHttpServer())
			.post('/users')
			.set('Authorization', authToken)
			.send(createUserDto)
			.expect(HttpStatus.CREATED)

		const userId = createUserResponse.body._id

		const response = await request(app.getHttpServer())
			.get(`/users/${userId}`)
			.set('Authorization', authToken)
			.expect(HttpStatus.OK)

		const userSearched = response.body

		expect(userSearched).toHaveProperty('_id')
		expect(userSearched).toHaveProperty('name')
		expect(userSearched).toHaveProperty('email')
		expect(userSearched).toHaveProperty('age')
		expect(userSearched).toHaveProperty('avatar')
	})

	it('(PUT) /users/:id', async () => {
		const createUserDto: CreateUserDto = {
			name: faker.person.firstName(),
			email: faker.internet.email(),
			age: faker.number.int({ min: 18, max: 90 }),
			avatar: faker.image.urlLoremFlickr(),
			password: 'Senha@123',
		}

		const createUserResponse = await request(app.getHttpServer())
			.post('/users')
			.set('Authorization', authToken)
			.send(createUserDto)
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

		expect(createUserResponse.body).toHaveProperty('_id')

		const userId = createUserResponse.body._id

		const response = await request(app.getHttpServer())
			.put(`/users/${userId}`)
			.set('Authorization', authToken)
			.send({
				name: faker.person.firstName(),
				email: faker.internet.email(),
				age: faker.number.int({ min: 18, max: 90 }),
				avatar: faker.image.urlLoremFlickr(),
			})
			.expect(HttpStatus.OK)

		const updatedUser = response.body

		expect(updatedUser).toStrictEqual(expectedResponse)
	})

	it('(DELETE) /users/:id', async () => {
		const createUserDto: CreateUserDto = {
			name: faker.person.firstName(),
			email: faker.internet.email(),
			age: faker.number.int({ min: 18, max: 90 }),
			avatar: faker.image.urlLoremFlickr(),
			password: 'Senha@123',
		}

		const createUserResponse = await request(app.getHttpServer())
			.post('/users')
			.set('Authorization', authToken)
			.send(createUserDto)
			.expect(HttpStatus.CREATED)

		expect(createUserResponse.body).toHaveProperty('_id')

		const userId = createUserResponse.body._id

		const expectedResponse = {
			raw: {
				acknowledged: true,
				deletedCount: 1,
			},
			affected: 1,
		}

		const response = await request(app.getHttpServer())
			.delete(`/users/${userId}`)
			.set('Authorization', authToken)
			.expect(HttpStatus.OK)

		const deletedUser = response.body

		expect(deletedUser).toStrictEqual(expectedResponse)
	})

	afterAll(async () => {
		await app.close()
	})
})
