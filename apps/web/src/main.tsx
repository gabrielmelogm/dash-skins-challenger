import './styles/global.css'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createRoot } from 'react-dom/client'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { Toaster } from './components/ui/toaster'
import { AuthenticationProvider } from './hooks/useAuth'
import { UsersProvider } from './hooks/useUsers'
import { Login } from './pages/Login'
import { Users } from './pages/Users'

const queryClient = new QueryClient()

const router = createBrowserRouter([
	{
		path: '/',
		element: <Users />,
	},
	{
		path: '/login',
		element: <Login />,
	},
])

// biome-ignore lint/style/noNonNullAssertion: <explanation>
createRoot(document.getElementById('root')!).render(
	<AuthenticationProvider>
		<QueryClientProvider client={queryClient}>
			<UsersProvider>
				<RouterProvider router={router} />,
				<Toaster />
			</UsersProvider>
		</QueryClientProvider>
	</AuthenticationProvider>,
)
