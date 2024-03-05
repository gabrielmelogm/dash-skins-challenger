import { api } from '@/lib/api'
import Cookies from 'js-cookie'
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
	const token = Cookies.get('dashskins.token')

	const listUsers = await api.get('/users', {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	})

	const users = listUsersSchema.parse(listUsers.data)

	return users
}
