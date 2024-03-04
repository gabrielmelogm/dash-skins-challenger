import './styles/global.css'

import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from 'react-query'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { Users } from './pages/Users'

const queryClient = new QueryClient()

const router = createBrowserRouter([
	{
		path: '/',
		element: <Users />,
	},
])

// biome-ignore lint/style/noNonNullAssertion: <explanation>
createRoot(document.getElementById('root')!).render(
	<QueryClientProvider client={queryClient}>
		<RouterProvider router={router} />,
	</QueryClientProvider>,
)
