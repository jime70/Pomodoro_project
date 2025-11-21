import { authAPI } from './api.js'

/**
 * Servicio de autenticación
 * Maneja la lógica de negocio: llamadas al API y localStorage
 */

// Función de Login
export const login = async (email, password) => {
  try {
    // Llamar al backend
    const response = await authAPI.login({ email, password })
    
    // Guardar token y usuario en localStorage
    localStorage.setItem('token', response.token)
    localStorage.setItem('user', JSON.stringify(response))
    
    // Retornar respuesta para que el componente actualice el contexto
    return { 
      success: true, 
      data: response 
    }
  } catch (error) {
    console.error('Error en login:', error)
    return { 
      success: false, 
      error: error.error || error.message || 'Error al iniciar sesión' 
    }
  }
}

// Función de Registro
export const register = async (nombre, email, password) => {
  try {
    // Llamar al backend
    const response = await authAPI.register({ nombre, email, password })
    
    // Guardar token y usuario en localStorage
    localStorage.setItem('token', response.token)
    localStorage.setItem('user', JSON.stringify(response))
    
    // Retornar respuesta para que el componente actualice el contexto
    return { 
      success: true, 
      data: response 
    }
  } catch (error) {
    console.error('Error en registro:', error)
    return { 
      success: false, 
      error: error.error || error.message || 'Error al registrarse' 
    }
  }
}

// Función de Logout
export const logout = async () => {
  try {
    // Llamar al backend para invalidar el token
    await authAPI.logout()
  } catch (error) {
    console.error('Error en logout:', error)
    // Continuar con el logout local aunque falle el backend
  } finally {
    // Limpiar localStorage
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }
}

// Verificar token al cargar la app
export const checkAuth = async () => {
  try {
    // Leer token del localStorage
    const storedToken = localStorage.getItem('token')
    const storedUser = localStorage.getItem('user')
    
    if (storedToken && storedUser) {
      // Verificar token con el backend
      await authAPI.getMe()
      
      // Retornar datos del usuario
      return {
        success: true,
        user: JSON.parse(storedUser),
        token: storedToken
      }
    } else {
      // No hay token
      return {
        success: false,
        user: null,
        token: null
      }
    }
  } catch (error) {
    console.error('Error verificando autenticación:', error)
    
    // Token inválido o expirado, limpiar todo
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    
    return {
      success: false,
      user: null,
      token: null
    }
  }
}

