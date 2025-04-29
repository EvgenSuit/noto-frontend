import { PropsWithChildren, useEffect } from "react"
import { useAuth } from "../auth/api/auth_context"
import { useNavigate } from "react-router-dom"

export const PublicRoute = ({children}: PropsWithChildren) => {
    const navigate = useNavigate()
    const { tokens: { accessToken } } = useAuth()

    useEffect(() => {
        if (accessToken) {
            navigate('/dashboard', { replace: true })
        }
    }, [accessToken, navigate])
    return <>{children}</>
}