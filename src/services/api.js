import axios from 'axios'
import apiConfig from '../config/apiConfig.js'

// Creamos const api con axios.create y le pasamos la configuración base (baseURL y headers)
const api = axios.create({
  baseURL: apiConfig.BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Interceptor de peticiones. Se ejecuta antes de cada petición al backend.
api.interceptors.request.use(
  (config) => {
    // Obtener token del localStorage
    const token = localStorage.getItem('token')
        // Si existe token, agregarlo a los headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// INTERCEPTOR DE RESPUESTAS. Se ejecuta después de cada respuesta del backend.
api.interceptors.response.use(
  (response) => {
    // Retornar solo los datos (response.data)
    return response.data
  },
  (error) => {
    // Manejar errores específicos
    if (error.response?.status === 401) {
      // Token inválido o expirado
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      // Opcional: redirigir a login (mejor manejarlo desde componentes)
      // window.location.href = '/login'
    }
    
    return Promise.reject(error.response?.data || error.message)
  }
)

// API DE AUTENTICACIÓN
export const authAPI = {
  // Login
  login: async (credentials) => {
    const response = await api.post(`${apiConfig.ENDPOINTS.AUTH}/login`, credentials)
    return response
  },
  
  // Registro
  register: async (userData) => {
    const response = await api.post(`${apiConfig.ENDPOINTS.AUTH}/register`, userData)
    return response
  },
  
  // Logout
  logout: async () => {
    const response = await api.post(`${apiConfig.ENDPOINTS.AUTH}/logout`)
    return response
  },
  
  // Obtener usuario actual
  getMe: async () => {
    const response = await api.get(`${apiConfig.ENDPOINTS.AUTH}/me`)
    return response
  }
}

// API DE OBJETIVOS
export const goalsAPI = {
  // Obtener todos los objetivos del usuario
  getAll: async () => {
    const response = await api.get(apiConfig.ENDPOINTS.GOALS)
    return response
  },
  
  // Crear nuevo objetivo
  create: async (goalData) => {
    const response = await api.post(apiConfig.ENDPOINTS.GOALS, goalData)
    return response
  },
  
  // Actualizar objetivo
  update: async (goalId, goalData) => {
    const response = await api.put(`${apiConfig.ENDPOINTS.GOALS}/${goalId}`, goalData)
    return response
  },
  
  // Eliminar objetivo
  delete: async (goalId) => {
    const response = await api.delete(`${apiConfig.ENDPOINTS.GOALS}/${goalId}`)
    return response
  },
  
  // Obtener objetivos por set/sesión
  getBySet: async (setNumber) => {
    const response = await api.get(`${apiConfig.ENDPOINTS.GOALS}/set/${setNumber}`)
    return response
  }
}

// API DE SESIONES
export const sessionsAPI = {
  // Registrar nueva sesión
  create: async (sessionData) => {
    const response = await api.post(apiConfig.ENDPOINTS.SESSIONS, sessionData)
    return response
  },
  
  // Obtener todas las sesiones del usuario
  getAll: async () => {
    const response = await api.get(apiConfig.ENDPOINTS.SESSIONS)
    return response
  }
}

export default api
