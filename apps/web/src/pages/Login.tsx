import { InputContainer } from '@/components/input/InputContainer'
import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from '@/components/ui/use-toast'
import { useAuthentication } from '@/hooks/useAuth'
import { zodResolver } from '@hookform/resolvers/zod'
import Cookies from 'js-cookie'
import { Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { z } from 'zod'

const inputsSchema = z.object({
	email: z.string().email({
		message: 'E-mail inválido',
	}),
	password: z.string().min(8, {
		message: 'A senha deve ter no mínimo 8 caracteres',
	}),
})

export type InputProps = z.infer<typeof inputsSchema>

export function Login() {
	const navigate = useNavigate()

	const { user } = useAuthentication()
	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm<InputProps>({
		resolver: zodResolver(inputsSchema),
	})
	const { LogIn } = useAuthentication()

	const [isLoading, setIsLoading] = useState<boolean>(false)

	async function onSubmit(data: any) {
		setIsLoading(true)
		const fields: InputProps = data
		await LogIn(fields.email, fields.password)
			.then(() => {
				navigate('/')
			})
			.catch(() => {
				toast({
					title: 'Houve algum problema ao logar',
					description: 'Erro inesperado ao logar, tente novamente mais tarde',
					variant: 'destructive',
				})
			})
			.finally(() => setIsLoading(false))
	}

	useEffect(() => {
		const token = Cookies.get('dashskins.token')
		if (token) {
			navigate('/')
		}
	}, [user])

	return (
		<main className="dark:bg-black w-full min-h-screen flex items-center justify-center">
			<Card className="w-[450px]">
				<CardHeader>
					<CardTitle>Faça login</CardTitle>
					<CardDescription>Use seu email e senha para logar</CardDescription>
				</CardHeader>
				<CardContent>
					<form
						onSubmit={handleSubmit(onSubmit)}
						className="grid w-full items-center gap-5"
					>
						<InputContainer>
							<Label htmlFor="email">Email</Label>
							<Input
								{...register('email')}
								id="email"
								name="email"
								type="email"
								placeholder="Ex: johndoe@email.com"
							/>
						</InputContainer>

						<InputContainer>
							<Label htmlFor="password">Senha</Label>
							<Input
								{...register('password')}
								id="password"
								name="password"
								type="password"
							/>
						</InputContainer>

						<Button
							className="w-full max-w-[380px]"
							type="submit"
							disabled={isLoading}
						>
							{isLoading ? (
								<div className="flex items-center">
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									<span>Enviando</span>
								</div>
							) : (
								<span>Logar</span>
							)}
						</Button>
					</form>
				</CardContent>
			</Card>
		</main>
	)
}