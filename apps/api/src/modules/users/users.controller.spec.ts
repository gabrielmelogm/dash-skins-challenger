import { Test, TestingModule } from '@nestjs/testing'
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm'

import { faker } from '@faker-js/faker'
import { HttpException, HttpStatus, NotFoundException } from '@nestjs/common'
import { ObjectId } from 'mongodb'
import { DeleteResult, Repository, UpdateResult } from 'typeorm'
import { ormConfig, testOrmConfig } from '../../database/ormconfig'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { User } from './entities/User.entity'
import { UsersController } from './users.controller'
import { UsersModule } from './users.module'
import { IUserResponse, UsersService } from './users.service'

describe('UsersController', () => {
	let usersController: UsersController
	let usersService: UsersService
	let usersRepository: Repository<User>

	beforeEach(async () => {
		const app: TestingModule = await Test.createTestingModule({
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

	describe('GET - FindAll', () => {
		it('should return all users', async () => {
			const userList: IUserResponse[] = []

			for (let i: number; i < 2; i++) {
				const userData: IUserResponse = {
					_id: new ObjectId(),
					name: faker.person.firstName(),
					age: faker.number.int({ min: 18, max: 90 }),
					email: faker.internet.email(),
					avatar: faker.image.urlLoremFlickr(),
				}
				userList.push(userData)
			}

			jest.spyOn(usersService, 'FindAll').mockResolvedValueOnce(userList)

			const response = await usersController.FindAll()

			expect(response).toEqual(userList)
			expect(usersService.FindAll).toHaveBeenCalled()
		})
	})

	describe('GET/:id - FindById', () => {
		it('should be able get a user', async () => {
			const userData: IUserResponse = {
				_id: new ObjectId(),
				name: faker.person.firstName(),
				age: faker.number.int({ min: 18, max: 90 }),
				email: faker.internet.email(),
				avatar: faker.image.urlLoremFlickr(),
			}

			jest.spyOn(usersService, 'FindById').mockResolvedValueOnce(userData)

			const response = await usersController.FindById(String(userData._id))

			expect(response).toEqual(userData)
			expect(usersService.FindById).toHaveBeenCalled()
		})
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

	describe('PUT/:id - Update', () => {
		it('should be able update a user', async () => {
			const userId: string = String(new ObjectId())

			const updateUserDto: UpdateUserDto = {
				name: faker.person.firstName(),
				email: faker.internet.email(),
				age: faker.number.int({ min: 18, max: 90 }),
				avatar: faker.image.urlLoremFlickr(),
			}

			const updateResult: UpdateResult = {
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

			jest
				.spyOn(usersService, 'Update')
				.mockResolvedValue(updateResult as UpdateResult)

			const response = await usersController.Update(userId, updateUserDto)

			expect(response).toEqual(updateResult)
			expect(usersService.Update).toHaveBeenCalledWith(userId, updateUserDto)
		})
	})

	describe('DELETE/:id - Update', () => {
		it('should be able delete a user', async () => {
			const userId: string = String(new ObjectId())

			const deleteResult: DeleteResult = {
				raw: {
					acknowledged: true,
					deletedCount: 1,
				},
				affected: 1,
			}

			jest
				.spyOn(usersService, 'Delete')
				.mockResolvedValue(deleteResult as DeleteResult)

			const response = await usersController.Delete(userId)

			expect(response).toEqual(deleteResult)
			expect(usersService.Delete).toHaveBeenCalledWith(userId)
		})

		it('should throw NotFoundException if user does not exist', async () => {
			const userId = String(new ObjectId())

			jest
				.spyOn(usersService, 'Delete')
				.mockRejectedValueOnce(new NotFoundException())

			await expect(usersController.Delete(userId)).rejects.toThrow(
				NotFoundException,
			)
			expect(usersService.Delete).toHaveBeenCalledWith(userId)
		})
	})
})
