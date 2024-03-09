import { faker } from '@faker-js/faker'
import { JwtService } from '@nestjs/jwt'
import { Test, TestingModule } from '@nestjs/testing'
import { hashSync } from 'bcrypt'
import { ObjectId } from 'mongodb'
import { User } from '../users/entities/User.entity'
import { UsersService } from '../users/users.service'
import { AuthService } from './auth.service'

describe('Auth Service', () => {
	let authService: AuthService
	let usersService: UsersService
	let jwtService: JwtService

	beforeEach(async () => {
		const app: TestingModule = await Test.createTestingModule({
			providers: [
				AuthService,
				{
					provide: UsersService,
					useValue: {
						FindByEmail: jest.fn(),
					},
				},
				{
					provide: JwtService,
					useValue: {
						sign: jest.fn(),
					},
				},
			],
		}).compile()

		authService = app.get<AuthService>(AuthService)
		usersService = app.get<UsersService>(UsersService)
		jwtService = app.get<JwtService>(JwtService)
	})

	it('should be define', () => {
		expect(authService).toBeDefined()
	})

	describe('login', () => {
		it('should return a token', async () => {
			const user = {
				_id: String(new ObjectId()),
				email: faker.internet.email(),
				password: faker.internet.password(),
			}

			jest.spyOn(jwtService, 'sign').mockReturnValue('mocked_token')

			const result = await authService.login(user)
			expect(result.token).toEqual('mocked_token')
		})
	})

	describe('validateUser', () => {
		it('should return a user if email and password are correct', async () => {
			const userLogin = {
				email: faker.internet.email(),
				password: faker.internet.password(),
			}

			const userExist: User = {
				_id: new ObjectId(),
				name: faker.person.firstName(),
				email: userLogin.email,
				age: faker.number.int({ min: 18, max: 90 }),
				avatar: faker.internet.url(),
				password: hashSync(userLogin.password, 10),
			}

			jest.spyOn(usersService, 'FindByEmail').mockResolvedValue(userExist)

			const result = await authService.validateUser(
				userLogin.email,
				userLogin.password,
			)
			expect(result).toEqual(userExist)
		})

		it('should return null if user is not found', async () => {
			const userLogin = {
				email: 'nonexistent@example.com',
				password: faker.internet.password(),
			}

			jest.spyOn(usersService, 'FindByEmail').mockResolvedValue(null)

			const result = await authService.validateUser(
				userLogin.email,
				userLogin.password,
			)

			expect(result).toBeNull()
		})

		it('should return null if password is incorrect', async () => {
			const userLogin = {
				email: faker.internet.email(),
				password: 'wrong_password',
			}

			const userExist: User = {
				_id: new ObjectId(),
				name: faker.person.firstName(),
				email: userLogin.email,
				age: faker.number.int({ min: 18, max: 90 }),
				avatar: faker.internet.url(),
				password: hashSync(faker.internet.password(), 10),
			}

			jest.spyOn(usersService, 'FindByEmail').mockResolvedValue(userExist)

			const result = await authService.validateUser(
				userLogin.email,
				userLogin.password,
			)
			expect(result).toBeNull()
		})
	})
})
