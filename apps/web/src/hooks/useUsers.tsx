import { InputProps } from '@/components/users/modal/CreateUserModal'
import { UpdateUserProps } from '@/components/users/modal/UpdateUserModal'
import { createUser as handleCreateUser } from '@/services/createUser.service'
import { deleteUser as handleDeleteUser } from '@/services/deleteUser.service'
import { IUserProps, getUsers } from '@/services/getUsers.service'
import { updateUser as handleUpdateUser } from '@/services/updateUser.service'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ReactNode, createContext, useContext } from 'react'
import { useAuthentication } from './useAuth'

interface UsersProps {
	users: IUserProps[]
	createUser: (user: InputProps) => Promise<void>
	updateUser: (id: string, user: UpdateUserProps) => Promise<void>
	deleteUser: (id: string) => Promise<void>
}

const Users = createContext({} as UsersProps)

export function UsersProvider({ children }: { children: ReactNode }) {
	const { user } = useAuthentication()
	const queryClient = useQueryClient()

	let users: IUserProps[] = []

	const { data } = useQuery({
		queryKey: ['getUsers'],
		queryFn: async () => await getUsers(),
		enabled: !!user,
	})

	users = data ?? []

	const { mutateAsync: handleCreateUserFn } = useMutation({
		mutationFn: handleCreateUser,
	})

	async function createUser(user: InputProps): Promise<void> {
		await handleCreateUserFn({
			name: user.name,
			email: user.email,
			age: user.age,
			avatar: user.avatar,
			password: user.password,
		}).then((res: IUserProps) => {
			// Insert a new use with cache
			queryClient.setQueryData(['getUsers'], (data: IUserProps[]) => {
				return [
					...data,
					{
						_id: res._id,
						name: res.name,
						email: res.email,
						age: res.age,
						avatar: res.avatar,
					},
				]
			})
		})
	}

	async function updateUser(id: string, user: UpdateUserProps) {
		await handleUpdateUser(id, user).then(() => {
			queryClient.invalidateQueries({
				queryKey: ['getUsers'],
			})
		})
	}

	async function deleteUser(id: string) {
		await handleDeleteUser(id)
	}

	return (
		<Users.Provider value={{ users, createUser, updateUser, deleteUser }}>
			{children}
		</Users.Provider>
	)
}

export function useUsers() {
	const context = useContext(Users)
	return context
}
