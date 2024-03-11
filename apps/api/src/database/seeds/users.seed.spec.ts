import { faker, fakerAR } from '@faker-js/faker'
import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { hashSync } from 'bcrypt'
import { ObjectId } from 'mongodb'
import { Repository } from 'typeorm'
import { User } from '../../modules/users/entities/User.entity'
import { UsersSeed } from './users.seed'

describe('UsersSeed', () => {
	let usersSeed: UsersSeed
	let userRepository: Repository<User>

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				UsersSeed,
				{
					provide: getRepositoryToken(User),
					useValue: {
						find: jest.fn(),
						save: jest.fn(),
					},
				},
			],
		}).compile()

		usersSeed = module.get<UsersSeed>(UsersSeed)
		userRepository = module.get(getRepositoryToken(User))
	})

	it('should seed users', async () => {
		jest.spyOn(userRepository, 'find').mockResolvedValue([])

		jest
			.spyOn(userRepository, 'save')
			.mockImplementation(async (entity: User) => entity)

		await usersSeed.seedUsers()

		expect(userRepository.save).toHaveBeenCalledWith(
			expect.arrayContaining([
				{
					name: expect.any(String),
					age: expect.any(Number),
					email: expect.any(String),
					avatar: expect.any(String),
					password: expect.any(String),
				},
			]),
		)
	})

	it('should not seed users if they already exist', async () => {
		const existingUsers: User[] = [
			{
				_id: new ObjectId(),
				name: faker.person.firstName(),
				email: faker.internet.email(),
				age: faker.number.int({ min: 18, max: 90 }),
				avatar: faker.image.urlLoremFlickr(),
				password: hashSync(faker.internet.password(), 10),
			},
			{
				_id: new ObjectId(),
				name: faker.person.firstName(),
				email: faker.internet.email(),
				age: faker.number.int({ min: 18, max: 90 }),
				avatar: faker.image.urlLoremFlickr(),
				password: hashSync(faker.internet.password(), 10),
			},
		]

		jest.spyOn(userRepository, 'find').mockResolvedValue(existingUsers)

		const consoleSpy = jest.spyOn(console, 'log')

		await usersSeed.seedUsers()

		expect(consoleSpy).toHaveBeenCalledWith(
			'Users already exist in the database. Ignoring seeds.',
		)
	})
})
