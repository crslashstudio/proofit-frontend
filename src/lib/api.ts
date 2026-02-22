import axios from 'axios'
import { useAppStore } from '@/store/useAppStore'

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
})

// Request Interceptor
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('proofit_token')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => Promise.reject(error)
)

// Response Interceptor
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Accessing store directly via getState to call logout
            useAppStore.getState().logout()
        }
        return Promise.reject(error)
    }
)

export default api
