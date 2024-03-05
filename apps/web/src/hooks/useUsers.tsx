import { InputProps } from '@/components/users/modal/CreateUserModal'
import { createUser as handleCreateUser } from '@/services/createUser.service'
import { IUserProps, getUsers } from '@/services/getUsers.service'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ReactNode, createContext, useContext, useEffect } from 'react'
import { useAuthentication } from './useAuth'

interface UsersProps {
	users: IUserProps[]
	createUser: (user: InputProps) => Promise<void>
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

	return (
		<Users.Provider value={{ users, createUser }}>{children}</Users.Provider>
	)
}

export function useUsers() {
	const context = useContext(Users)
	return context
}
