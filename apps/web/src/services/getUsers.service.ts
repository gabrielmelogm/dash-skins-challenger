import { api } from '@/lib/api'
import { z } from 'zod'

const userSchema = z.object({
	_id: z.string(),
	name: z.string(),
	age: z.number(),
	email: z.string().email(),
	avatar: z.string(),
})

const listUsersSchema = userSchema.array()

export type IUserProps = z.infer<typeof userSchema>

export async function getUsers(): Promise<IUserProps[]> {
	const listUsers = await api.get('/users')

	const users = listUsersSchema.parse(listUsers.data)

	return users
}
