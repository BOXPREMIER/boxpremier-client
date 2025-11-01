import axios from 'axios'

const JsonServerAPI = axios.create({
    baseURL: import.meta.env.VITE_JSON_SERVER_URL,
    timeout: 15000,
    headers: { 'Content-Type': 'application/json' }
})

export default JsonServerAPI