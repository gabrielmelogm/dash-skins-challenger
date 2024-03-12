import { Injectable, NotFoundException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { compareSync } from 'bcrypt'
import { User } from '../users/entities/User.entity'
import { UsersService } from '../users/users.service'
import { UserPayload } from './userPayload'

@Injectable()
export class AuthService {
	constructor(
		private readonly userService: UsersService,
		private readonly jwtService: JwtService,
	) {}

	async login(user: { _id: string; email: string }) {
		const payload: UserPayload = { sub: String(user._id), email: user.email }
		return {
			token: this.jwtService.sign(payload),
		}
	}

	async validateUser(email: string, password: string): Promise<User> | null {
		let user: User
		try {
			user = await this.userService.FindByEmail(email)

			if (!user) throw new NotFoundException()
		} catch (error) {
			return null
		}

		const isPasswordValid = compareSync(password, user.password)
		if (!isPasswordValid) return null

		return user
	}
}
