import { useNavigate } from "react-router-dom"
import { useAuth } from "../../auth/api/auth_context"
import { CommonAppBar } from "../../components/CommonAppBar"

export const Home = () => {
    const navigate = useNavigate()
    const { tokens: {accessToken} } = useAuth()
    const text = !accessToken ? "Log In" : "Dashboard"
    const onClick = !accessToken ? () => navigate('/auth') : () => navigate('/dashboard')
    return (
        <div>
            <CommonAppBar
                buttonText={text}
                onButtonClick={onClick} />
            <main>
                <p>Noto - track your progress</p>
            </main>
            
        </div>
    )
}