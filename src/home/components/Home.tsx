import { useNavigate } from "react-router-dom"
import { useAuth } from "../../auth/api/auth_context"

export const Home = () => {
    const navigate = useNavigate()
    const { tokens } = useAuth()
    return (
        <div>
            {!tokens.accessToken ? (
                <button
                    onClick={() => navigate('/auth')}
                >Log In</button>
            ) : (
                <button
                    onClick={() => navigate('/dashboard')}
                >
                    Dashboard
                </button>
            )}
            <header>
                <h1>Noto</h1>
            </header>
            <main>
                <p>Noto - track your progress</p>
            </main>
            
        </div>
    )
}