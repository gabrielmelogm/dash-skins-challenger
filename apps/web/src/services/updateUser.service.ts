import { UpdateUserProps } from '@/components/users/modal/UpdateUserModal'
import { api } from '@/lib/api'

export async function updateUser(
	id: string,
	user: UpdateUserProps,
): Promise<void> {
	await api.put(`/users/${id}`, user)
}
