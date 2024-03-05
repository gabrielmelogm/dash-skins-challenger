import { IUserProps } from '@/services/getUsers.service'
import { ColumnDef } from '@tanstack/react-table'
import { MoreHorizontal } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
	getAvatarName,
} from '../ui/avatar'
import { Button } from '../ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from '../ui/dropdown-menu'

export const usersColumns: ColumnDef<IUserProps>[] = [
	{
		id: 'avatar',
		header: 'Avatar',
		cell: ({ row }) => {
			return (
				<Avatar>
					<AvatarImage src={row.original.avatar} />
					<AvatarFallback>
						<strong className="text-black dark:text-black">
							{getAvatarName(row.original.name)}
						</strong>
					</AvatarFallback>
				</Avatar>
			)
		},
	},
	{
		accessorKey: 'name',
		header: 'Nome',
	},
	{
		accessorKey: 'age',
		header: 'Idade',
	},
	{
		accessorKey: 'email',
		header: 'E-mail',
	},
	{
		id: 'actions',
		cell: ({ row }) => {
			const [searchParams, setSearchParams] = useSearchParams()

			const user = row.original

			function handleClickEdit(userId: string) {
				setSearchParams((state) => {
					if (searchParams.get('modalEdit')) {
						state.delete('modalEdit')
						return state
					}

					state.set('modalEdit', userId)
					return state
				})
			}

			function handleClickDelete(userId: string) {
				setSearchParams((state) => {
					if (searchParams.get('modalDelete')) {
						state.delete('modalDelete')
						return state
					}

					state.set('modalDelete', userId)
					return state
				})
			}

			return (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost">
							<span className="sr-only">Open menu</span>
							<MoreHorizontal className="h-4 w-4" />
						</Button>
					</DropdownMenuTrigger>

					<DropdownMenuContent align="end">
						<DropdownMenuLabel>Ações</DropdownMenuLabel>
						<DropdownMenuItem onClick={() => handleClickEdit(user._id)}>
							Editar
						</DropdownMenuItem>
						<DropdownMenuItem onClick={() => handleClickDelete(user._id)}>
							Excluir
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			)
		},
	},
]
