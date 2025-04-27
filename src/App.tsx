import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Auth } from './auth/components/Auth'
import { Home } from './dashboard/components/dashboard'
import AuthProvider from './auth/api/auth_context'
import { Routes } from './routes/Routes'

function App() {
  return (
    <AuthProvider>
      <Routes />
    </AuthProvider>
  )
}

export default App
