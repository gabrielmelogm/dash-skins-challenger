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

export function getUsers(): IUserProps[] {
	const limit = 10
	const list: IUserProps[] = []

	for (let i = 0; i < limit; i++) {
		const data: IUserProps = {
			_id: faker.string.uuid(),
			name: faker.person.firstName(),
			email: faker.internet.email(),
			age: faker.number.int({ min: 18, max: 90 }),
			avatar: faker.internet.url(),
		}

		list.push(data)
	}

	const users = listUsersSchema.parse(list)

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
