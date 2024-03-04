import { DataTable } from '@/components/DataTable'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { UsersModal } from '@/components/users/UsersModal'
import { getUsers, usersColumns } from '@/services/getUsers.service'
import { useQuery } from 'react-query'
import { useSearchParams } from 'react-router-dom'

export function Users() {
	const [searchParams, setSearchParams] = useSearchParams()

	const { data } = useQuery('getUsers', () => {
		return getUsers()
	})

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

	return (
		<main className="dark:bg-black w-full min-h-screen">
			<div className="w-full flex items-center justify-between px-48 py-8 border-b border-b-zinc-700">
				<h2 className="dark:text-white text-4xl">Users</h2>

				<div>
					<Button onClick={handleOpenModal}>Adicionar</Button>
				</div>
			</div>

			<div className="px-48 py-12 flex flex-col gap-6">
				<Input type="search" name="search" placeholder="Pesquisar..." />
				<DataTable columns={usersColumns} data={data ?? []} />
			</div>

			<UsersModal open={Boolean(searchParams.get('modalOpen'))} />
		</main>
	)
}
