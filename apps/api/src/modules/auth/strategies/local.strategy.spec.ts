import { faker } from '@faker-js/faker'
import { UnauthorizedException } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { ObjectId } from 'mongodb'
import { User } from '../../users/entities/User.entity'
import { AuthService } from '../auth.service'
import { LocalStrategy } from './local.strategy'

describe('LocalStrategy', () => {
	let localStrategy: LocalStrategy
	let authService: Partial<AuthService>

	beforeEach(async () => {
		authService = {
			validateUser: jest.fn(),
		}

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				LocalStrategy,
				{ provide: AuthService, useValue: authService },
			],
		}).compile()

		localStrategy = module.get<LocalStrategy>(LocalStrategy)
	})

	it('should be defined', () => {
		expect(localStrategy).toBeDefined()
	})

	describe('validate', () => {
		it('should return user data if email and password are valid', async () => {
			const userExist: User = {
				_id: new ObjectId(),
				name: faker.person.firstName(),
				email: faker.internet.email(),
				age: faker.number.int({ min: 18, max: 90 }),
				avatar: faker.internet.url(),
				password: faker.internet.password(),
			}

			jest.spyOn(authService, 'validateUser').mockResolvedValueOnce(userExist)

			const result = await localStrategy.validate(
				userExist.email,
				userExist.password,
			)

			expect(result).toEqual(userExist)
			expect(authService.validateUser).toHaveBeenCalledWith(
				userExist.email,
				userExist.password,
			)
		})

		it('should throw UnauthorizedException if email or password are invalid', async () => {
			const wrongUser: User = {
				_id: new ObjectId(),
				name: faker.person.firstName(),
				email: faker.internet.email(),
				age: faker.number.int({ min: 18, max: 90 }),
				avatar: faker.internet.url(),
				password: faker.internet.password(),
			}

			jest.spyOn(authService, 'validateUser').mockResolvedValueOnce(null)

			await expect(
				localStrategy.validate(wrongUser.email, wrongUser.password),
			).rejects.toThrow(UnauthorizedException)

			expect(authService.validateUser).toHaveBeenCalledWith(
				wrongUser.email,
				wrongUser.password,
			)
		})
	})
})
