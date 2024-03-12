import { UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { z } from 'zod'
import { env } from '../../../../env'
import { UserPayload } from '../userPayload'

export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor() {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: env.NODE_ENV === 'development',
			secretOrKey: env.JWT_KEY,
		})
	}

	async validate(payload: UserPayload) {
		try {
			z.object({ sub: z.string(), email: z.string().email() }).parse(payload)
			return { id: payload.sub, email: payload.email }
		} catch (error) {
			throw new UnauthorizedException()
		}
	}
}
