import { ConfigModule } from '@nestjs/config'
import { z } from 'zod'

const envFileName = `.env.${process.env.NODE_ENV || 'development'}`
ConfigModule.forRoot({
	envFilePath: envFileName,
})

const nodeEnv = z.enum(['development', 'production', 'test'])

const envSchema = z.object({
	NODE_ENV: nodeEnv.default('development'),
	DATABASE_URL: z.string(),
	JWT_KEY: z.string(),
	SESSION_EXPIRES: z.coerce.number(),
})

export const env = envSchema.parse(process.env)
