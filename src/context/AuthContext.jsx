import React, { createContext, useContext, useState, useEffect } from 'react'
import { authAPI } from '../services/api.js'

// Crear el contexto de autenticación
const AuthContext = createContext()

// Provider que envuelve toda la aplicación
export const AuthProvider = ({ children }) => {
  // Estados globales
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  // Verificar si hay usuario autenticado
  const isAuthenticated = !!user && !!token

  // Función de Login
  const login = async (email, password) => {
    try {
      setLoading(true)
      
      // Llamar al backend
      const response = await authAPI.login({ email, password })
      
      // Guardar token y usuario en localStorage
      localStorage.setItem('token', response.token)
      localStorage.setItem('user', JSON.stringify(response))
      
      // Actualizar estado
      setToken(response.token)
      setUser(response)
      
      return { success: true }
    } catch (error) {
      console.error('Error en login:', error)
      return { 
        success: false, 
        error: error.error || 'Error al iniciar sesión' 
      }
    } finally {
      setLoading(false)
    }
  }

  // Función de Registro
  const register = async (nombre, email, password) => {
    try {
      setLoading(true)
      
      // Llamar al backend
      const response = await authAPI.register({ nombre, email, password })
      
      // Guardar token y usuario en localStorage
      localStorage.setItem('token', response.token)
      localStorage.setItem('user', JSON.stringify(response))
      
      // Actualizar estado
      setToken(response.token)
      setUser(response)
      
      return { success: true }
    } catch (error) {
      console.error('Error en registro:', error)
      return { 
        success: false, 
        error: error.error || 'Error al registrarse' 
      }
    } finally {
      setLoading(false)
    }
  }

  // Función de Logout
  const logout = async () => {
    try {
      // Llamar al backend para invalidar el token
      await authAPI.logout()
    } catch (error) {
      console.error('Error en logout:', error)
    } finally {
      // Limpiar localStorage
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      
      // Limpiar estado
      setToken(null)
      setUser(null)
    }
  }

  // Verificar token al cargar la app
  const checkAuth = async () => {
    try {
      setLoading(true)
      
      // Leer token del localStorage
      const storedToken = localStorage.getItem('token')
      const storedUser = localStorage.getItem('user')
      
      if (storedToken && storedUser) {
        // Verificar token con el backend
        await authAPI.getMe()
        
        // Actualizar estado (usar datos del localStorage)
        setToken(storedToken)
        setUser(JSON.parse(storedUser))
      } else {
        // No hay token, limpiar estado
        setToken(null)
        setUser(null)
      }
    } catch (error) {
      console.error('Error verificando autenticación:', error)
      
      // Token inválido o expirado, limpiar todo
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      setToken(null)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  // Verificar autenticación al montar el componente
  useEffect(() => {
    checkAuth()
  }, [])

  // Valores que se exponen a todos los componentes
  const value = {
    // Estado
    user,
    token,
    isAuthenticated,
    loading,
    
    // Funciones
    login,
    register,
    logout,
    checkAuth
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// Hook personalizado para usar el contexto
export const useAuth = () => {
  const context = useContext(AuthContext)
  
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider')
  }
  
  return context
}

export default AuthContext