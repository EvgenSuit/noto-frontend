import axios from "axios"
import { useAuth } from "./auth_context"

const AUTH_URL = import.meta.env.VITE_BACKEND_URL + '/auth/'

export type Credentials = {
    name: string,
    email: string,
    password: string
}

type AuthenticationResponse = {
    accessToken: string,
    refreshToken: string
}

export const signUp = async (credentials: Credentials) => {
    const response = await axios<AuthenticationResponse>({
        url: 'signup',
        method: 'post',
        baseURL: AUTH_URL,
        headers: {
            'Content-Type': 'application/json'
        },
        data: JSON.stringify(credentials)
    })
    return response.data
}
export const signIn = async (credentials: Credentials) => {
    const response = await axios<AuthenticationResponse>({
        url: 'signin',
        method: 'post',
        baseURL: AUTH_URL,
        headers: {
            'Content-Type': 'application/json'
        },
        data: JSON.stringify({
            email: credentials.email,
            password: credentials.password
        })
    })
    return response.data
}