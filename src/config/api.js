// Configuración de la API
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    ME: '/auth/me'
  },
  // Goals endpoints
  GOALS: {
    BASE: '/goals',
    BY_SET: (setNumber) => `/goals/set/${setNumber}`,
    BY_ID: (id) => `/goals/${id}`
  },
  // Sessions endpoints (para futuro)
  SESSIONS: {
    BASE: '/sessions'
  }
};

