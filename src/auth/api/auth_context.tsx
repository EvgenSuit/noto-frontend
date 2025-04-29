/* eslint-disable react-refresh/only-export-components */
import axios from "axios";
import { createContext, Dispatch, JSX, PropsWithChildren, ReactNode, SetStateAction, useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Tokens {
    accessToken: string | null,
    refreshToken: string | null
}

export interface AuthContextType {
    tokens: Tokens,
    setTokens: Dispatch<SetStateAction<Tokens>>
  }
  
  const defaultValue: AuthContextType = {
    tokens: { accessToken: null, refreshToken: null },
    setTokens: () => {}
  };
  
const AuthContext = createContext<AuthContextType>(defaultValue);

const AuthProvider = ({ children }: PropsWithChildren) => {
    const [tokens, setTokens] = useState<Tokens>({
        accessToken: localStorage.getItem('accessToken'),
        refreshToken: localStorage.getItem('refreshToken')
    })

    useEffect(() => {
        if (tokens.accessToken) {
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + tokens.accessToken
            localStorage.setItem('accessToken', tokens.accessToken)
        } else {
            delete axios.defaults.headers.common['Authorization']
            localStorage.removeItem('accessToken')
            localStorage.removeItem('refreshToken')
        }

        if (tokens.refreshToken) {
            localStorage.setItem('refreshToken', tokens.refreshToken)
        } else {
            localStorage.removeItem('refrehsToken')
        }
    }, [tokens])

    const contextValue = useMemo(
        () => ({ tokens, setTokens }),
        [tokens]
    )
    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    return useContext(AuthContext)
}

export default AuthProvider