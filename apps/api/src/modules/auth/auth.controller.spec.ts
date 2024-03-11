import { faker } from '@faker-js/faker'
import { Test, TestingModule } from '@nestjs/testing'
import { ObjectId } from 'mongodb'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'

describe('AuthController', () => {
	let authController: AuthController
	let authService: AuthService

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [AuthController],
			providers: [
				{
					provide: AuthService,
					useValue: {
						login: jest.fn(),
					},
				},
			],
		}).compile()

		authController = module.get<AuthController>(AuthController)
		authService = module.get<AuthService>(AuthService)
	})

	describe('login', () => {
		it('should return token when login is successful', async () => {
			const req = {
				user: {
					_id: String(new ObjectId()),
					email: faker.internet.email(),
					password: faker.internet.password(),
				},
			}

			const mockedToken: string = faker.string.uuid()

			jest.spyOn(authService, 'login').mockResolvedValue({ token: mockedToken })

			const result = await authController.login(req)

			expect(result).toEqual({ token: mockedToken })
		})
	})
})
