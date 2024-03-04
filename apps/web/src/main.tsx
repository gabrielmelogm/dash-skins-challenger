import React from 'react'
import { createRoot } from 'react-dom/client'
import './styles/global.css'

import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { Users } from './pages/Users'

const router = createBrowserRouter([
	{
		path: '/',
		element: <Users />,
	},
])

// biome-ignore lint/style/noNonNullAssertion: <explanation>
createRoot(document.getElementById('root')!).render(
	<RouterProvider router={router} />,
)
