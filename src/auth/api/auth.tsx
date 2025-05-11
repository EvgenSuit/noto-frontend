import axios from "axios"

const AUTH_URL = import.meta.env.VITE_BACKEND_URL + '/auth/'

export type Credentials = {
    name: string,
    email: string,
    password: string
}

export type AuthenticationResponse = {
    accessToken: string,
    refreshToken: string
}

const api = axios.create({
    baseURL: AUTH_URL,
    headers: {
        'Accept-Language': navigator.language || navigator.languages[0],
        'Content-Type': 'application/json'
    }
})

export const signUp = async (credentials: Credentials) => {
    const response = await api.post('signup',
        JSON.stringify(credentials)
    )
    return response.data
}
export const signIn = async (credentials: Credentials) => {
    const response = await api.post('signin',
        JSON.stringify({
            email: credentials.email,
            password: credentials.password
        })
    )
    return response.data
}