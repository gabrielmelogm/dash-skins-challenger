import { Test, TestingModule } from '@nestjs/testing'
import { TypeOrmModule } from '@nestjs/typeorm'

import { faker } from '@faker-js/faker'
import { HttpException, HttpStatus } from '@nestjs/common'
import { ormConfig } from '../../database/ormconfig'
import { CreateUserDto } from './dto/create-user.dto'
import { User } from './entities/User.entity'
import { UsersController } from './users.controller'
import { UsersModule } from './users.module'
import { UsersService } from './users.service'

describe('UsersController', () => {
	let usersController: UsersController
	let usersService: UsersService

	beforeEach(async () => {
		const app: TestingModule = await Test.createTestingModule({
			imports: [
				TypeOrmModule.forRoot(ormConfig),
				TypeOrmModule.forFeature([User]),
				UsersModule,
			],
			controllers: [UsersController],
			providers: [UsersService],
		}).compile()

		usersController = app.get<UsersController>(UsersController)
		usersService = app.get<UsersService>(UsersService)
	})

	it('should be able the controller is defined', () => {
		expect(usersController).toBeDefined()
	})

	describe('POST - Store', () => {
		it('should return 409 Conflict if user with email already exists', async () => {
			jest
				.spyOn(usersService, 'Store')
				.mockRejectedValue(new Error('User with email already exists'))

			const createUserDto: CreateUserDto = {
				name: faker.person.firstName(),
				email: faker.internet.email(),
				age: faker.number.int({ min: 18, max: 90 }),
				avatar: faker.image.urlLoremFlickr(),
			}

			const response = {
				status: jest.fn().mockReturnThis(),
				send: jest.fn(),
			}

			await usersController.Store(createUserDto, response as any)

			expect(response.status).toHaveBeenCalledWith(HttpStatus.CONFLICT)
			expect(response.send).toHaveBeenCalledWith(
				new HttpException(
					'User with email already exists',
					HttpStatus.CONFLICT,
				),
			)
		})
	})
})
