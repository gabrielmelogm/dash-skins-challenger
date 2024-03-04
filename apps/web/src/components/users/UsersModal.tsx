import { ReactNode } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Button } from '../ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Dialog, DialogContent } from '../ui/dialog'
import { Input } from '../ui/input'
import { Label } from '../ui/label'

interface IUsersModalProps {
	open: boolean
}

export function UsersModal({ open = false }: IUsersModalProps) {
	const [searchParams, setSearchParams] = useSearchParams()

	function handleCloseModal() {
		setSearchParams((state) => {
			if (searchParams.get('modalOpen') === 'true') {
				state.delete('modalOpen')
				return state
			}

			return state
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
						<form className="grid w-full max-w-sm items-center gap-5">
							<InputContainer>
								<Label htmlFor="name">Nome</Label>
								<Input id="name" name="name" />
							</InputContainer>
							<InputContainer>
								<Label htmlFor="age">Idade</Label>
								<Input id="age" name="age" type="number" />
							</InputContainer>
							<InputContainer>
								<Label htmlFor="email">Email</Label>
								<Input id="email" name="email" type="email" />
							</InputContainer>

							<InputContainer>
								<Label htmlFor="avatar">Avatar</Label>
								<Input id="avatar" name="avatar" />
							</InputContainer>

							<Button className="w-full" type="submit">
								Adicionar
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
