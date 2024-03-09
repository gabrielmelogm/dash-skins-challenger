import { faker } from '@faker-js/faker'
import { UnauthorizedException } from '@nestjs/common'
import { ObjectId } from 'mongodb'
import { JwtStrategy } from './jwt.strategy'

describe('JwtStrategy', () => {
	let jwtStrategy: JwtStrategy

	beforeEach(() => {
		jwtStrategy = new JwtStrategy()
	})

	it('should be defined', () => {
		expect(jwtStrategy).toBeDefined()
	})

	describe('validate', () => {
		it('should return user data if payload is valid', async () => {
			const payload = {
				sub: String(new ObjectId()),
				email: faker.internet.email(),
			}
			const result = await jwtStrategy.validate(payload)
			expect(result).toEqual({
				id: payload.sub,
				email: payload.email,
			})
		})

		it('should throw UnauthorizedException if payload is invalid', async () => {
			const payload = { invalid: 'payload' } as any
			await expect(jwtStrategy.validate(payload)).rejects.toThrow(
				UnauthorizedException,
			)
		})
	})
})
