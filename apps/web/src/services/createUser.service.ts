import { InputProps } from '@/components/users/modal/CreateUserModal'
import { api } from '@/lib/api'

export async function createUser(user: InputProps): Promise<InputProps> {
	const response = await api.post('/users', user)
	return response.data
}
