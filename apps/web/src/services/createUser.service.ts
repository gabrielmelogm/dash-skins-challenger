import { InputProps } from '@/components/users/modal/CreateUserModal'
import { api } from '@/lib/api'
import Cookies from 'js-cookie'
import { IUserProps } from './getUsers.service'

export async function createUser(user: InputProps): Promise<IUserProps> {
	const token = Cookies.get('dashskins.token')
	const response = await api.post('/users', user, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	})
	return response.data
}
