import { DataTable } from '@/components/DataTable'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { IUserProps, getUsers, usersColumns } from '@/services/getUsers.service'
import { useEffect, useState } from 'react'

export function Users() {
	const [data, setData] = useState<IUserProps[]>([])

	useEffect(() => {
		const response = getUsers()
		setData(response)
	}, [])

	return (
		<main className="dark:bg-black w-full min-h-screen">
			<div className="w-full flex items-center justify-between px-48 py-8 border-b border-b-zinc-700">
				<h2 className="dark:text-white text-4xl">Users</h2>

				<div>
					<Button>Add</Button>
				</div>
			</div>

			<div className="px-48 py-12 flex flex-col gap-6">
				<Input type="search" name="search" placeholder="Pesquisar..." />
				<DataTable columns={usersColumns} data={data} />
			</div>
		</main>
	)
}
