import { Test, TestingModule } from '@nestjs/testing'
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm'

import { faker } from '@faker-js/faker'
import { HttpException, HttpStatus } from '@nestjs/common'
import { ObjectId } from 'mongodb'
import { Repository } from 'typeorm'
import { ormConfig, testOrmConfig } from '../../database/ormconfig'
import { CreateUserDto } from './dto/create-user.dto'
import { User } from './entities/User.entity'
import { UsersController } from './users.controller'
import { UsersModule } from './users.module'
import { UsersService } from './users.service'

describe('UsersController', () => {
	let usersController: UsersController
	let usersService: UsersService
	let usersRepository: Repository<User>

	beforeEach(async () => {
		const app: TestingModule = await Test.createTestingModule({
			imports: [
				TypeOrmModule.forRoot(testOrmConfig),
				TypeOrmModule.forFeature([User]),
				UsersModule,
			],
			controllers: [UsersController],
			providers: [
				UsersService,
				{
					provide: getRepositoryToken(User),
					useClass: Repository,
				},
			],
		}).compile()

		usersController = app.get<UsersController>(UsersController)
		usersService = app.get<UsersService>(UsersService)
		usersRepository = app.get<Repository<User>>(getRepositoryToken(User))
	})

	it('should be able the controller is defined', () => {
		expect(usersController).toBeDefined()
	})

	describe('POST - Store', () => {
		it('should create a new user and return 201', async () => {
			const createUserDto = {
				_id: new ObjectId(),
				name: faker.person.firstName(),
				email: faker.internet.email(),
				age: faker.number.int({ min: 18, max: 90 }),
				avatar: faker.image.urlLoremFlickr(),
				password: 'Senha@123',
			}

			jest
				.spyOn(usersService, 'Store')
				.mockResolvedValue(createUserDto as CreateUserDto)

			const response = {
				status: jest.fn().mockReturnThis(),
				send: jest.fn(),
			}

			await usersController.Store(createUserDto, response as any)

			expect(response.status).toHaveBeenCalledWith(HttpStatus.CREATED)
		})

		it('should return 409 Conflict if user with email already exists', async () => {
			jest
				.spyOn(usersService, 'Store')
				.mockRejectedValue(new Error('User with email already exists'))

			const createUserDto: CreateUserDto = {
				name: faker.person.firstName(),
				email: faker.internet.email(),
				age: faker.number.int({ min: 18, max: 90 }),
				avatar: faker.image.urlLoremFlickr(),
				password: 'Senha@123',
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
