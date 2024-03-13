import { InputContainer } from '@/components/input/InputContainer'
import { useUsers } from '@/hooks/useUsers'
import { IUserProps } from '@/services/getUsers.service'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useSearchParams } from 'react-router-dom'
import { z } from 'zod'
import { CaptionError } from '../../input/CaptionError'
import { Button } from '../../ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '../../ui/card'
import { Dialog, DialogContent } from '../../ui/dialog'
import { Input } from '../../ui/input'
import { Label } from '../../ui/label'
import { useToast } from '../../ui/use-toast'

export interface IUpdateUserModalProps {
	open: boolean
	userSelected?: IUserProps | null
}

const inputsSchema = z.object({
	name: z.string().min(1, {
		message: 'Campo obrigatório',
	}),
	age: z.coerce.number().min(1, {
		message: 'O campo idade deve ser um número',
	}),
	email: z.string().email({
		message: 'E-mail inválido',
	}),
	avatar: z.string().min(1, {
		message: 'Campo obrigatório',
	}),
})

export type UpdateUserProps = z.infer<typeof inputsSchema>

export function UpdateUserModal({
	open = false,
	userSelected,
}: IUpdateUserModalProps) {
	const {
		register,
		handleSubmit,
		formState: { errors },
		resetField,
	} = useForm<UpdateUserProps>({
		resolver: zodResolver(inputsSchema),
	})
	const { toast } = useToast()
	const { updateUser } = useUsers()

	const [searchParams, setSearchParams] = useSearchParams()
	const [isLoading, setIsLoading] = useState<boolean>(false)

	function handleCloseModal() {
		resetField('name')
		resetField('age')
		resetField('email')
		resetField('avatar')
		setSearchParams((state) => {
			if (typeof searchParams.get('modalEdit') === 'string') {
				state.delete('modalEdit')
				return state
			}

			return state
		})
	}

	async function onSubmit(data: any) {
		setIsLoading(true)
		const fields: UpdateUserProps = data
		if (userSelected?._id && fields) {
			await updateUser(userSelected?._id, fields)
				.then(() => {
					toast({
						title: 'Usuário atualizado com sucesso!',
						description: `O usuário ${fields.name} foi atualizado!`,
						variant: 'success',
					})
					handleCloseModal()
				})
				.catch(() => {
					toast({
						title: 'Erro ao criar um novo usuário',
						description: `Houve um erro inesperado ao atualizado o usuário ${fields.name}, tente novamente mais tarde`,
						variant: 'destructive',
					})
				})
				.finally(() => {
					setIsLoading(false)
				})
		}
	}

	return (
		<Dialog open={open} onOpenChange={handleCloseModal}>
			<DialogContent id="editModal">
				<div className="w-[16px] h-[16px] rounded bg-white absolute top-4 right-4"></div>
				<Card>
					<CardHeader>
						<CardTitle>Editar usuário</CardTitle>
						<CardDescription>{userSelected?.name}</CardDescription>
					</CardHeader>
					<CardContent>
						<form
							onSubmit={handleSubmit(onSubmit)}
							className="grid w-full max-w-sm items-center gap-5"
						>
							<InputContainer>
								<Label htmlFor="name">Nome</Label>
								<Input
									{...register('name')}
									id="name"
									name="name"
									defaultValue={userSelected?.name}
								/>
								{errors.name && (
									<CaptionError>{errors.email?.message}</CaptionError>
								)}
							</InputContainer>
							<InputContainer>
								<Label htmlFor="age">Idade</Label>
								<Input
									{...register('age')}
									id="age"
									name="age"
									type="number"
									defaultValue={userSelected?.age}
								/>
								{errors.age && (
									<CaptionError>{errors.age?.message}</CaptionError>
								)}
							</InputContainer>
							<InputContainer>
								<Label htmlFor="email">Email</Label>
								<Input
									{...register('email')}
									id="email"
									name="email"
									type="email"
									defaultValue={userSelected?.email}
								/>
								{errors.email && (
									<CaptionError>{errors.email?.message}</CaptionError>
								)}
							</InputContainer>

							<InputContainer>
								<Label htmlFor="avatar">Avatar</Label>
								<Input
									{...register('avatar')}
									id="avatar"
									name="avatar"
									defaultValue={userSelected?.avatar}
								/>
								{errors.avatar && (
									<CaptionError>{errors.avatar?.message}</CaptionError>
								)}
							</InputContainer>

							<Button className="w-full" type="submit" disabled={isLoading}>
								{isLoading ? (
									<div className="flex items-center">
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
										<span>Atualizando</span>
									</div>
								) : (
									<span>Atualizar</span>
								)}
							</Button>
						</form>
					</CardContent>
				</Card>
			</DialogContent>
		</Dialog>
	)
}
