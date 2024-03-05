import Cookies from 'js-cookie'

import { DataTable } from '@/components/DataTable'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { usersColumns } from '@/components/users/columns'
import { CreateUserModal } from '@/components/users/modal/CreateUserModal'
import { DeleteUserModal } from '@/components/users/modal/DeleteUserModal'
import { UpdateUserModal } from '@/components/users/modal/UpdateUserModal'
import { useAuthentication } from '@/hooks/useAuth'
import { useUsers } from '@/hooks/useUsers'
import { IUserProps } from '@/services/getUsers.service'
import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

export function Users() {
	const navigate = useNavigate()

	const { users: data } = useUsers()
	const { user } = useAuthentication()

	const [searchParams, setSearchParams] = useSearchParams()

	function handleOpenModal() {
		setSearchParams((state) => {
			if (searchParams.get('modalOpen') === 'true') {
				state.delete('modalOpen')
				return state
			}

			state.set('modalOpen', 'true')
			return state
		})
	}

	function getUserById(): IUserProps | null {
		let userId: string | null = null

		if (searchParams.get('modalEdit')) {
			userId = searchParams.get('modalEdit')
		}
		if (searchParams.get('modalDelete')) {
			userId = searchParams.get('modalDelete')
		}

		if (!userId) return null

		const searchedUser = data?.filter(
			(currentUser) => currentUser._id === userId,
		)[0] as IUserProps

		return searchedUser
	}

	useEffect(() => {
		const token = Cookies.get('dashskins.token')
		if (!token) {
			navigate('login')
		}
	}, [user])

	return (
		<main className="w-full min-h-screen">
			<div className="py-8 px-8 w-full flex items-center justify-between md:px-48 md:py-8 border-b border-b-zinc-700">
				<h2 className="dark:text-white text-4xl">
					<strong>Users</strong>
				</h2>

				<div>
					<Button onClick={handleOpenModal}>Adicionar</Button>
				</div>
			</div>

			<div className="px-8 py-6 w-full md:px-48 md:py-12">
				<div className="overflow-x-auto md:overflow-x-auto max-w-[1500px] min-w-[350px] flex flex-col gap-6 ">
					<Input type="search" name="search" placeholder="Pesquisar..." />
					<div className="min-w-[600px]">
						<DataTable columns={usersColumns} data={data ?? []} />
					</div>
				</div>
			</div>

			<CreateUserModal open={Boolean(searchParams.get('modalOpen'))} />
			<UpdateUserModal
				open={Boolean(searchParams.get('modalEdit')) && Boolean(getUserById())}
				userSelected={getUserById()}
			/>
			<DeleteUserModal
				open={
					Boolean(searchParams.get('modalDelete')) && Boolean(getUserById())
				}
				userSelected={getUserById()}
			/>
		</main>
	)
}
