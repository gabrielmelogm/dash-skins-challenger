import { ConfigModule } from '@nestjs/config'
import { z } from 'zod'

ConfigModule.forRoot()

const nodeEnv = z.enum(['development', 'production', 'test'])

const envSchema = z.object({
	NODE_ENV: nodeEnv.default('development'),
	DATABASE_URL: z.string(),
	JWT_KEY: z.string(),
	SESSION_EXPIRES: z.coerce.number(),
})

export const env = envSchema.parse(process.env)
