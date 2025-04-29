import { createBrowserRouter, RouterProvider, useNavigate } from "react-router-dom"
import { useAuth } from "../auth/api/auth_context"
import { Dashboard } from "../dashboard/components/Dashboard"
import { ProtectedRoute } from "./ProtectedRoute"
import { Home } from "../home/components/Home"
import { Auth } from "../auth/components/Auth"
import { PublicRoute } from "./PublicRoute"

export const Routes = () => {
    const publicRoutes = [
        {
            path: '/',
            element: <Home />
        },
        {
            path: 'auth',
            element: (
                <PublicRoute>
                    <Auth />
                </PublicRoute>)
        }
    ]
    const privateRoutes = [
        {
            path: '/',
            element: <ProtectedRoute />,
            children: [
                {
                    path: 'dashboard',
                    element: <Dashboard />
                }
            ]
        }
    ]
    const router = createBrowserRouter([
        ...publicRoutes,
        ...privateRoutes
    ])
    return <RouterProvider router={router} />
}