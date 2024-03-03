import './styles/global.css'
import React from 'react'
import { createRoot } from 'react-dom/client'

import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Users } from './pages/Users'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Users />
  }
])

createRoot(document.getElementById('root')!).render(
  <RouterProvider router={router} /> 
)
