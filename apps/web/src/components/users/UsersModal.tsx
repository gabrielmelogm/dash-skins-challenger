import { createUser } from '@/services/createUser.service'
import { faker } from '@faker-js/faker'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { ReactNode, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useSearchParams } from 'react-router-dom'
import { z } from 'zod'
import { CaptionError } from '../CaptionError'
import { Button } from '../ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Dialog, DialogContent } from '../ui/dialog'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { useToast } from '../ui/use-toast'

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
	avatar: z.string().min(1, {
		message: 'Campo obrigatório',
	}),
})

export type InputProps = z.infer<typeof inputsSchema>

export function UsersModal({ open = false }: IUsersModalProps) {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
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
				toast({
					title: 'Usuário criado com sucesso!',
					variant: 'success',
				})
				handleCloseModal()
			})
			.catch(() => {
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
			<DialogContent>
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
								<Input
									{...register('name')}
									id="name"
									name="name"
									defaultValue={faker.person.firstName()}
								/>
								{errors.name && (
									<CaptionError>{errors.name.message as any}</CaptionError>
								)}
							</InputContainer>
							<InputContainer>
								<Label htmlFor="age">Idade</Label>
								<Input
									{...register('age')}
									id="age"
									name="age"
									type="number"
									defaultValue={faker.number.int({ min: 18, max: 90 })}
								/>
								{errors.age && (
									<CaptionError>{errors.age.message as any}</CaptionError>
								)}
							</InputContainer>
							<InputContainer>
								<Label htmlFor="email">Email</Label>
								<Input
									{...register('email')}
									id="email"
									name="email"
									type="email"
									defaultValue={faker.internet.email()}
								/>
								{errors.email && (
									<CaptionError>{errors.email.message as any}</CaptionError>
								)}
							</InputContainer>

							<InputContainer>
								<Label htmlFor="avatar">Avatar</Label>
								<Input
									{...register('avatar')}
									id="avatar"
									name="avatar"
									defaultValue={faker.image.urlLoremFlickr()}
								/>
								{errors.avatar && (
									<CaptionError>{errors.avatar.message as any}</CaptionError>
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

function InputContainer({ children }: { children: ReactNode }) {
	return (
		<div className="grid w-full max-w-sm items-center gap-2">{children}</div>
	)
}
