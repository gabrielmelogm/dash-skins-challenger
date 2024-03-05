import { api } from '@/lib/api'
import Cookies from 'js-cookie'

export async function deleteUser(id: string): Promise<void> {
	const token = Cookies.get('dashskins.token')
	await api.delete(`/users/${id}`, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	})
}
