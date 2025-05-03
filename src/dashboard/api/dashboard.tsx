import axios from "axios"
import { AuthenticationResponse } from "../../auth/api/auth"
import { AuthContextType, useAuth } from "../../auth/api/auth_context"

const DASHBOARD_URL = import.meta.env.VITE_BACKEND_URL + '/dashboard/'
const AUTH_URL = import.meta.env.VITE_BACKEND_URL + '/auth'

export type Todo = {
    id: number,
    owner: string,
    title: string,
    status: 'NONE' | 'IN_PROGRESS' | 'DONE',
    createdAt: string
}

const api = axios.create({
    baseURL: DASHBOARD_URL,
        headers: {
            'Content-Type': 'application/json'
        }
})

let getAuth: (() => AuthContextType) | null = null
export const setAuthGetter = (getter: () => AuthContextType) => {
    getAuth = getter
}

api.interceptors.response.use(
    function (response) {
        return response
    },
    async error => {
        const originalRequest = error.config
        
        if (error.response?.status === 401) {
            const auth = getAuth?.()
            if (!auth) throw new Error('No auth context available')
            try {
                const refreshResponse = await axios.post<AuthenticationResponse>(
                    `${AUTH_URL}/refresh`,
                    {
                        refreshToken: auth.tokens.refreshToken
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }
                )
                const newAccessToken = refreshResponse.data.accessToken
                const newRefreshToken = refreshResponse.data.refreshToken
                auth.setTokens({accessToken: newAccessToken, refreshToken: newRefreshToken})

                originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`

                return api(originalRequest)
            } catch (e) {
                console.error('Failed to refresh token', e)
                auth.setTokens({accessToken: null, refreshToken: null});
                return Promise.reject(e)
            }
        }
        return Promise.reject(error)
    }
)

export const getTodos = async () => {
    const response = await api.get<Todo[]>('/', {
        headers: {
            'Authorization': `Bearer ${getAuth().tokens.accessToken}`
        }
    })
    const sortedTodos = response.data.sort((a, b) => {
        const dateA = new Date(a.createdAt)
        const dateB = new Date(b.createdAt)
        return dateB.getTime() - dateA.getTime()
    })
    const formattedTodos = sortedTodos.map(todo => ({
        ...todo,
        createdAt: formatDate(todo.createdAt)
    }))
    return formattedTodos
}

const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    }).format(date);
};

export const postTodo = async (title: string) => {
    await api.post('/',
        {
            title: title.trim(),
            status: 'NONE'
        },
        {
            headers: {
                'Authorization': `Bearer ${getAuth().tokens.accessToken}`,
                'Content-Type': 'application/json'
            }
        }
    )
    return await getTodos()
}

export const putTodo = async (id: number, title: string, status: string) => {
    await api.put('/' + id,
        {
            title: title.trim(),
            status: status
        },
        {
            headers: {
                'Authorization': `Bearer ${getAuth().tokens.accessToken}`,
                'Content-Type': 'application/json'
            }
        }
    )
    return await getTodos()
}

export const deleteTodo = async (id: number) => {
    await api.delete('/' + id,
        {
            headers: {
                'Authorization': `Bearer ${getAuth().tokens.accessToken}`,
                'Content-Type': 'application/json'
            }
        }
    )
    return await getTodos()
}