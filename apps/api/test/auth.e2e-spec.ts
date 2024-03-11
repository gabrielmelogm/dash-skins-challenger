import { HttpStatus, INestApplication } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { Test, TestingModule } from '@nestjs/testing'
import { TypeOrmModule } from '@nestjs/typeorm'
import * as request from 'supertest'
import { testOrmConfig } from '../src/database/ormconfig'
import { AuthModule } from '../src/modules/auth/auth.module'
import { UsersModule } from '../src/modules/users/users.module'
import { UsersService } from '../src/modules/users/users.service'
import { user } from './user.factory'

describe('Auth (e2e)', () => {
	let app: INestApplication
	let userService: UsersService

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
	})

	it('(POST) /auth/login - auth user and return token', async () => {
		const response = await request(app.getHttpServer())
			.post('/auth/login')
			.send({ email: user.email, password: user.password })
			.expect(HttpStatus.CREATED)

		expect(response.body).toHaveProperty('token')
	})

	it('(POST) /auth/login - return error because has a invalid email', async () => {
		const response = await request(app.getHttpServer())
			.post('/auth/login')
			.send({ email: 'invalid_email', password: user.password })
			.expect(HttpStatus.UNAUTHORIZED)
	})

	afterAll(async () => {
		await app.close()
	})
})
