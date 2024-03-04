import { api } from '@/lib/api'
import { faker } from '@faker-js/faker'
import { ColumnDef } from '@tanstack/react-table'
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

export const usersColumns: ColumnDef<IUserProps>[] = [
	{
		accessorKey: 'name',
		header: 'Nome',
	},
	{
		accessorKey: 'age',
		header: 'Idade',
	},
	{
		accessorKey: 'email',
		header: 'E-mail',
	},
]
