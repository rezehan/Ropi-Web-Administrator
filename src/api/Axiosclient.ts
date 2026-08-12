import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string

const axiosClient = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
})

axiosClient.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error?.response?.status
        const message = error?.response?.data?.message ?? error.message
        console.error(`[API] ❌ (${status ?? 'network error'}) ${message}`)
        return Promise.reject(error)
    }
)

export default axiosClient