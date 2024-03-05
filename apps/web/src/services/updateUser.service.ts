import { UpdateUserProps } from '@/components/users/modal/UpdateUserModal'
import { api } from '@/lib/api'
import Cookies from 'js-cookie'

export async function updateUser(
	id: string,
	user: UpdateUserProps,
): Promise<void> {
	const token = Cookies.get('dashskins.token')
	await api.put(`/users/${id}`, user, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	})
}
