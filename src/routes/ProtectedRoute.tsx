import { Navigate, Outlet, useNavigate } from "react-router-dom"
import { useAuth } from "../auth/api/auth_context"
import { useEffect } from "react"

export const ProtectedRoute = () => {
    const navigate = useNavigate()
    const { tokens: {accessToken} } = useAuth()

    useEffect(() => {
        if (!accessToken) {
            navigate('auth', { replace: true })
        }
    }, [accessToken])
    return <Outlet />
}