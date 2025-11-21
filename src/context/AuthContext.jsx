import React, { createContext, useContext, useState, useEffect } from 'react'
import { checkAuth as checkAuthService } from '../services/authService.js'

// Crear el contexto de autenticación
const AuthContext = createContext()

// Provider que envuelve toda la aplicación
export const AuthProvider = ({ children }) => {
  // Estados globales (solo estado, no lógica de negocio)
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  // Verificar si hay usuario autenticado
  const isAuthenticated = !!user && !!token

  // Verificar autenticación al cargar la app
  useEffect(() => {
    const verifyAuth = async () => {
      setLoading(true)
      const result = await checkAuthService()
      
      if (result.success) {
        setUser(result.user)
        setToken(result.token)
      } else {
        setUser(null)
        setToken(null)
      }
      
      setLoading(false)
    }
    
    verifyAuth()
  }, [])

  // Valores que se exponen a todos los componentes
  // Solo estado y setters, NO funciones de login/logout
  const value = {
    // Estado
    user,
    token,
    isAuthenticated,
    loading,
    
    // Setters para que los componentes puedan actualizar el estado
    setUser,
    setToken
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