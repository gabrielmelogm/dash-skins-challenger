import { ObjectId } from 'mongodb'
import { Repository, UpdateResult } from 'typeorm'

import { faker } from '@faker-js/faker'

import { ConflictException, NotFoundException } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'

import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { User } from './entities/User.entity'
import { UsersService } from './users.service'

describe('Users Service', () => {
	let usersService: UsersService
	let usersRepository: Repository<User>

	beforeEach(async () => {
		const app: TestingModule = await Test.createTestingModule({
			providers: [
				UsersService,
				{
					provide: getRepositoryToken(User),
					useClass: Repository,
				},
			],
		}).compile()

		usersService = app.get<UsersService>(UsersService)
		usersRepository = app.get<Repository<User>>(getRepositoryToken(User))
	})

	it('should be able the service is defined', () => {
		expect(usersService).toBeDefined()
	})

	describe('FindAll', () => {
		it('should be able get all users', async () => {
			const usersResult: User[] = []

			for (let i = 10; i < 10; i++) {
				const data: User = {
					_id: new ObjectId(),
					name: faker.person.firstName(),
					email: faker.internet.email(),
					age: faker.number.int({ min: 18, max: 90 }),
					avatar: faker.internet.url(),
					createdAt: String(faker.date.recent()),
					updatedAt: String(faker.date.recent()),
				}
				usersResult.push(data)
			}

			jest.spyOn(usersRepository, 'find').mockResolvedValue(usersResult)
			await expect(usersService.FindAll()).resolves.toEqual(usersResult)
		})

		it('should return an empty array if no users are found', async () => {
			jest.spyOn(usersRepository, 'find').mockResolvedValueOnce([])
			await expect(usersService.FindAll()).resolves.toEqual([])
		})
	})

	describe('Store', () => {
		it('should create a new user', async () => {
			const createUserDto: CreateUserDto = {
				name: faker.person.firstName(),
				age: faker.number.int({ min: 18, max: 100 }),
				email: faker.internet.email(),
				avatar: faker.internet.url(),
			}

			jest.spyOn(usersRepository, 'findOne').mockResolvedValue(null)

			jest
				.spyOn(usersRepository, 'create')
				.mockReturnValue(createUserDto as User)
			jest
				.spyOn(usersRepository, 'save')
				.mockResolvedValue(createUserDto as User)

			const result = await usersService.Store(createUserDto)

			expect(result).toEqual(createUserDto)
		})

		it('should throw ConflictException when trying to create a user with an existing email', async () => {
			const existingUser: User = {
				_id: new ObjectId(),
				name: faker.person.firstName(),
				age: 35,
				email: 'existing@example.com',
				avatar: faker.internet.url(),
			}

			const createUserDto: CreateUserDto = {
				name: faker.person.firstName(),
				age: faker.number.int({ min: 18, max: 100 }),
				email: existingUser.email,
				avatar: faker.internet.url(),
			}

			jest.spyOn(usersRepository, 'findOne').mockResolvedValue(existingUser)

			try {
				await usersService.Store(createUserDto)
			} catch (error) {
				expect(error).toBeInstanceOf(ConflictException)
				expect(error.message).toBe('User with email already exists')
			}
		})
	})

	describe('FindById', () => {
		it('should find a user by id', async () => {
			const id = String(new ObjectId())
			const user = {
				_id: new ObjectId(),
				name: faker.person.firstName(),
				age: faker.number.int({ min: 18, max: 100 }),
				email: faker.internet.email(),
				avatar: faker.internet.url(),
			}
			jest
				.spyOn(usersRepository, 'findOneOrFail')
				.mockResolvedValue(user as User)
			const result = await usersService.FindById(id)
			expect(result).toEqual(user)
		})
		it('should not be able get a user with nonexistent id', async () => {
			const id = String(new ObjectId())
			jest
				.spyOn(usersRepository, 'findOneOrFail')
				.mockRejectedValueOnce(new NotFoundException())
			await expect(usersService.FindById(id)).rejects.toBeInstanceOf(
				NotFoundException,
			)
		})
	})

	describe('Update', () => {
		it('should be able update a user', async () => {
			const userExist = {
				_id: new ObjectId(),
				name: faker.person.firstName(),
				age: faker.number.int({ min: 18, max: 100 }),
				email: faker.internet.email(),
				avatar: faker.internet.url(),
			}

			const updateUser: UpdateUserDto = {
				name: faker.person.firstName(),
				email: faker.internet.email(),
				age: faker.number.int({ min: 18, max: 90 }),
				avatar: faker.internet.url(),
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

			jest.spyOn(usersService, 'FindById').mockResolvedValue(userExist as User)
			jest.spyOn(usersRepository, 'update').mockResolvedValue(updateResult)

			await expect(
				usersService.Update(String(userExist._id), updateUser),
			).resolves.toEqual(updateResult)
		})
		it('should not be able update a does not exist user', async () => {
			const wrongId = faker.string.uuid()

			const updateUser: UpdateUserDto = {
				name: faker.person.firstName(),
				email: faker.internet.email(),
				age: faker.number.int({ min: 18, max: 90 }),
				avatar: faker.internet.url(),
			}

			jest
				.spyOn(usersService, 'FindById')
				.mockRejectedValue(new NotFoundException())

			await expect(usersService.Update(wrongId, updateUser)).rejects.toThrow(
				NotFoundException,
			)
		})
	})
})
