import { useEffect } from 'react'
import { useAppStore } from '@/store/useAppStore'
import { useNavigate, useLocation } from 'react-router-dom'

export function useAuth() {
    const { isAuthenticated, user, token } = useAppStore()
    const navigate = useNavigate()
    const location = useLocation()

    useEffect(() => {
        const publicPaths = ['/login', '/register']
        const isPublicPath = publicPaths.includes(location.pathname)

        if (!isAuthenticated && !isPublicPath) {
            navigate('/login', { replace: true })
        }

        if (isAuthenticated && isPublicPath) {
            navigate('/dashboard', { replace: true })
        }
    }, [isAuthenticated, location.pathname, navigate])

    return { isAuthenticated, user, token }
}
