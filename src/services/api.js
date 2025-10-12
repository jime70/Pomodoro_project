import axios from 'axios';
import { API_URL } from '../config/api';

// Crear instancia de axios
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para agregar token JWT automáticamente
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de respuesta
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token inválido o expirado
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// ==================== AUTH SERVICES ====================
export const authService = {
  // Registrar usuario
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  },

  // Login
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  },

  // Logout
  logout: async () => {
    try {
      await api.post('/auth/logout');
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },

  // Obtener usuario actual
  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  }
};

// ==================== GOALS SERVICES ====================
export const goalsService = {
  // Obtener todos los objetivos del usuario
  getAll: async () => {
    const response = await api.get('/goals');
    return response.data;
  },

  // Obtener objetivos por sesión
  getBySet: async (setNumber) => {
    const response = await api.get(`/goals/set/${setNumber}`);
    return response.data;
  },

  // Crear objetivo
  create: async (goalData) => {
    const response = await api.post('/goals', goalData);
    return response.data;
  },

  // Actualizar objetivo
  update: async (id, goalData) => {
    const response = await api.put(`/goals/${id}`, goalData);
    return response.data;
  },

  // Eliminar objetivo
  delete: async (id) => {
    const response = await api.delete(`/goals/${id}`);
    return response.data;
  }
};

// ==================== SESSIONS SERVICES ====================
export const sessionsService = {
  // Crear sesión completada
  create: async (sessionData) => {
    const response = await api.post('/sessions', sessionData);
    return response.data;
  },

  // Obtener todas las sesiones
  getAll: async () => {
    const response = await api.get('/sessions');
    return response.data;
  },

  // Obtener estadísticas
  getStats: async (desde = null, hasta = null) => {
    const params = {};
    if (desde) params.desde = desde;
    if (hasta) params.hasta = hasta;
    
    const response = await api.get('/sessions/stats', { params });
    return response.data;
  }
};

export default api;

