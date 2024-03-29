import { InputContainer } from '@/components/input/InputContainer'
import { useUsers } from '@/hooks/useUsers'
import { zodResolver } from '@hookform/resolvers/zod'
import { AxiosError } from 'axios'
import { Loader2 } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useSearchParams } from 'react-router-dom'
import { z } from 'zod'
import { CaptionError } from '../../input/CaptionError'
import { Button } from '../../ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card'
import { Dialog, DialogContent } from '../../ui/dialog'
import { Input } from '../../ui/input'
import { Label } from '../../ui/label'
import { useToast } from '../../ui/use-toast'

interface IUsersModalProps {
	open: boolean
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
	password: z
		.string({
			required_error: 'Campo obrigatório',
		})
		.regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/, {
			message:
				'O campo deve conter 8 caracteres incluindo letras e números, 1 letra maiúscula, 1 caractere especial',
		}),
	avatar: z.string().min(1, {
		message: 'Campo obrigatório',
	}),
})

export type InputProps = z.infer<typeof inputsSchema>

export function CreateUserModal({ open = false }: IUsersModalProps) {
	const { createUser } = useUsers()
	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm<InputProps>({
		resolver: zodResolver(inputsSchema),
	})
	const { toast } = useToast()

	const [searchParams, setSearchParams] = useSearchParams()
	const [isLoading, setIsLoading] = useState<boolean>(false)

	function handleCloseModal() {
		setSearchParams((state) => {
			if (searchParams.get('modalOpen') === 'true') {
				state.delete('modalOpen')
				return state
			}

			return state
		})
	}

	async function onSubmit(data: any) {
		setIsLoading(true)
		const fields: InputProps = data
		await createUser(fields)
			.then(() => {
				reset()
				toast({
					title: 'Usuário criado com sucesso!',
					variant: 'success',
				})
				handleCloseModal()
			})
			.catch((error: AxiosError) => {
				if (error.response?.status === 409) {
					toast({
						title: 'Email indisponível',
						description: 'O email informado já está sendo usado por um usuário',
						variant: 'destructive',
					})

					return
				}
				toast({
					title: 'Erro ao criar um novo usuário',
					description:
						'Houve um erro inesperado ao criar um usuário, tente novamente mais tarde',
					variant: 'destructive',
				})
			})
			.finally(() => {
				setIsLoading(false)
			})
	}

	return (
		<Dialog open={open} onOpenChange={handleCloseModal}>
			<DialogContent id="createModal">
				<div className="w-[16px] h-[16px] rounded bg-white absolute top-4 right-4"></div>
				<Card>
					<CardHeader>
						<CardTitle>Crie um novo usuário</CardTitle>
					</CardHeader>
					<CardContent>
						<form
							onSubmit={handleSubmit(onSubmit)}
							className="grid w-full max-w-sm items-center gap-5"
						>
							<InputContainer>
								<Label htmlFor="name">Nome</Label>
								<Input {...register('name')} id="name" name="name" />
								{errors.name && (
									<CaptionError>{errors.email?.message}</CaptionError>
								)}
							</InputContainer>
							<InputContainer>
								<Label htmlFor="age">Idade</Label>
								<Input {...register('age')} id="age" name="age" type="number" />
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
								/>
								{errors.email && (
									<CaptionError>{errors.email?.message}</CaptionError>
								)}
							</InputContainer>

							<InputContainer>
								<Label htmlFor="password">Password</Label>
								<Input
									{...register('password')}
									id="password"
									name="password"
									type="password"
								/>
								{errors.password && (
									<CaptionError>{errors.password?.message}</CaptionError>
								)}
							</InputContainer>

							<InputContainer>
								<Label htmlFor="avatar">Avatar</Label>
								<Input {...register('avatar')} id="avatar" name="avatar" />
								{errors.avatar && (
									<CaptionError>{errors.avatar?.message}</CaptionError>
								)}
							</InputContainer>

							<Button className="w-full" type="submit" disabled={isLoading}>
								{isLoading ? (
									<div className="flex items-center">
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
										<span>Enviando</span>
									</div>
								) : (
									<span>Adicionar</span>
								)}
							</Button>
						</form>
					</CardContent>
				</Card>
			</DialogContent>
		</Dialog>
	)
}
