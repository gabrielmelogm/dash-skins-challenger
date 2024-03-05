import {
	ReactNode,
	createContext,
	useContext,
	useEffect,
	useState,
} from 'react'

import { api } from '@/lib/api'
import { env } from '@/lib/utils'
import axios from 'axios'
import Cookies from 'js-cookie'
import { jwtDecode } from 'jwt-decode'

interface UserPayload {
	sub: string
	email: string
	iat: number
	exp: number
}

type AuthenticationProps = {
	LogIn: (email: string, password: string) => Promise<void>
	isLogin: boolean
	user: UserPayload | null
}

type AuthenticationProviderProps = {
	children: ReactNode
}

const Authentication = createContext({} as AuthenticationProps)

export function AuthenticationProvider({
	children,
}: AuthenticationProviderProps) {
	const [user, setUser] = useState<UserPayload | null>(null)

	const isLogin = !!user

	useEffect(() => {
		validateUser()
	}, [])

	async function LogIn(email: string, password: string) {
		return await axios
			.post(`${env.VITE_API_URL}/auth/login`, { email, password })
			.then(({ data }) => {
				if (data.token) {
					Cookies.set('dashskins.token', data.token)
					setUser(jwtDecode(data.token))
				}
			})
			.catch((error) => console.error(error))
	}

	async function validateUser() {
		const token = Cookies.get('dashskins.token')

		let getUser: UserPayload | null = null

		if (token) {
			getUser = jwtDecode(token)
		}

		if (getUser) {
			return await api
				.get(`/users/${getUser.sub}`, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				})
				.then((response) => {
					if (response.data?._id) {
						setUser(getUser)
					}
				})
				.catch(() => setUser(null))
		}
	}

	return (
		<Authentication.Provider value={{ LogIn, isLogin, user }}>
			{children}
		</Authentication.Provider>
	)
}

export function useAuthentication() {
	const context = useContext(Authentication)
	return context
}
