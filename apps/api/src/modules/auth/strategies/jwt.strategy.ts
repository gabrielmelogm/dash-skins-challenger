import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { env } from '../../../../env'

export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor() {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: env.NODE_ENV === 'development',
			secretOrKey: env.JWT_KEY,
		})
	}

	async validate(payload: any) {
		return { id: payload.sub, email: payload.email }
	}
}
