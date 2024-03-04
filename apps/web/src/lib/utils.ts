import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { z } from 'zod'

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

const nodeEnv = z.enum(['development', 'production', 'test'])

const envSchema = z.object({
	NODE_ENV: nodeEnv.default('development'),
	VITE_API_URL: z.string(),
})

export const env = envSchema.parse(import.meta.env)
