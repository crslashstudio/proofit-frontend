import { useEffect } from 'react'
import { useAppStore } from '@/store/useAppStore'
import { useNavigate, useLocation } from 'react-router-dom'

export function useAuth() {
    const { isAuthenticated, user, token } = useAppStore()
    const navigate = useNavigate()
    const location = useLocation()

    useEffect(() => {
        const storedToken = localStorage.getItem('proofit_token')
        const publicPaths = ['/login', '/register']
        const isPublicPath = publicPaths.includes(location.pathname)

        // Read token from localStorage on mount and sync store
        if (storedToken && !isAuthenticated) {
            // We only have the token, we might not have the user object here
            // but setting isAuthenticated to true prevents the redirect loop
            useAppStore.setState({ isAuthenticated: true, token: storedToken })
        }

        const currentAuth = storedToken || isAuthenticated

        if (!currentAuth && !isPublicPath) {
            navigate('/login', { replace: true })
        }

        if (currentAuth && isPublicPath) {
            navigate('/dashboard', { replace: true })
        }
    }, [isAuthenticated, location.pathname, navigate])

    return { isAuthenticated, user, token }
}
