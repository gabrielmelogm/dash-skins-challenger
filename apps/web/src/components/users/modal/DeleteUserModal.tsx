import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { toast } from '@/components/ui/use-toast'
import { useUsers } from '@/hooks/useUsers'
import { IUserProps } from '@/services/getUsers.service'
import { Loader2 } from 'lucide-react'
import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'

interface IDeleteUserModalProps {
	open: boolean
	userSelected: IUserProps | null
}

export function DeleteUserModal({
	open = false,
	userSelected,
}: IDeleteUserModalProps) {
	const { deleteUser } = useUsers()

	const [searchParams, setSearchParams] = useSearchParams()
	const [loading, setLoading] = useState<boolean>(false)

	function handleCloseModal() {
		setSearchParams((state) => {
			if (typeof searchParams.get('modalDelete') === 'string') {
				state.delete('modalDelete')
				return state
			}

			return state
		})
	}

	async function handleDeleteUser() {
		if (!userSelected?._id) return
		setLoading(true)
		await deleteUser(userSelected?._id)
			.then(() => {
				toast({
					title: 'Usuário excluído com sucesso!',
					variant: 'success',
				})
				handleCloseModal()
			})
			.catch((error) => {
				toast({
					title: 'Erro ao criar um novo usuário',
					description:
						'Houve um erro inesperado ao criar um usuário, tente novamente mais tarde',
					variant: 'destructive',
				})
				console.error(error)
			})
			.finally(() => setLoading(false))
	}

	return (
		<AlertDialog open={open} onOpenChange={handleCloseModal}>
			<AlertDialogContent className="dark:bg-dark-background dark:text-white">
				<AlertDialogHeader>
					<AlertDialogTitle>Essa ação é irreversível</AlertDialogTitle>
					<AlertDialogDescription>
						Você tem certeza que deseja excluir o usuário{' '}
						<strong className="text-red-500">{userSelected?.name}</strong> ?
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel className="dark:bg-dark-background dark:hover:text-zinc-400">
						Cancelar
					</AlertDialogCancel>
					<AlertDialogAction
						onClick={handleDeleteUser}
						className="bg-red-500 dark:bg-red-500 text-white dark:text-white hover:bg-red-700 dark:hover:bg-red-700"
						disabled={loading}
					>
						{loading ? (
							<div className="flex items-center">
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								<span>Deletando</span>
							</div>
						) : (
							<span>Deletar</span>
						)}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	)
}
