// services/API.js
import axios from 'axios'
import useAuthStore from '../store/authStore'

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' }
})

// ----- Request: adjunta token si existe -----
API.interceptors.request.use(
  (config) => {
    const { token } = useAuthStore.getState()
    if (token) {
      // usa el header estándar
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// ----- Response: manejo 401 opcional -----
API.interceptors.response.use(
  (res) => res,
  async (error) => {
    const { response } = error
    if (response?.status === 401) {
      
      useAuthStore.getState().logout()
    }
    return Promise.reject(error)
  }
)

export default API
