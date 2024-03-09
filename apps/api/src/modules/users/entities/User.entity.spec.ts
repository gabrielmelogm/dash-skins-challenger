import { User } from './User.entity'

describe('User Entity', () => {
	it('should create a new user instance', () => {
		const user = new User()
		expect(user).toBeInstanceOf(User)
	})

	it('should hash the password before insert', () => {
		const user = new User()

		user.password = 'password123'
		user.hashPassword()

		expect(user.password).not.toBe('password123')
	})
})
