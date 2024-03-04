import { InputProps } from '@/components/users/modal/CreateUserModal'
import { api } from '@/lib/api'
import { IUserProps } from './getUsers.service'

export async function createUser(user: InputProps): Promise<IUserProps> {
	const response = await api.post('/users', user)
	return response.data
}
