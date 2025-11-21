import React, { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { login as loginService } from '../../services/authService.js'

const LoginForm = ({ onSuccess, onClose, onSwitchToRegister }) => {
  const { setUser, setToken } = useAuth()
  
  // Estados locales del formulario
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Función para manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Validación básica
    if (!email.trim()) {
      setError('El email es requerido')
      setLoading(false)
      return
    }

    if (!password.trim()) {
      setError('La contraseña es requerida')
      setLoading(false)
      return
    }

    // Validación de formato de email básico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError('El email no tiene un formato válido')
      setLoading(false)
      return
    }

    // Llamar al servicio de login
    const result = await loginService(email, password)

    if (result.success) {
      // Actualizar el contexto con los datos del usuario
      setUser(result.data)
      setToken(result.data.token)
      
      // Si el login es exitoso, cerrar el modal y ejecutar callback
      if (onSuccess) onSuccess()
      if (onClose) onClose()
    } else {
      // Mostrar error del backend
      setError(result.error || 'Error al iniciar sesión')
    }
    
    setLoading(false)
  }

  // Función para login con Google (preparado para cuando se implemente el backend)
  const handleGoogleLogin = async () => {
    setError('')
    setLoading(true)
    
    try {
      // TODO: Implementar cuando el backend tenga el endpoint de Google OAuth
      // const result = await loginWithGoogleService()
      // if (result.success) {
      //   setUser(result.data)
      //   setToken(result.data.token)
      //   if (onSuccess) onSuccess()
      //   if (onClose) onClose()
      // }
      
      // Por ahora, mostrar mensaje
      setError('Login con Google próximamente disponible')
    } catch {
      setError('No se pudo completar el login con Google')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Campo de Email */}
      <div style={{ marginBottom: '20px' }}>
        <label
          style={{
            display: 'block',
            marginBottom: '8px',
            fontSize: '14px',
            fontWeight: '500',
            color: '#374151'
          }}
        >
          Email
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="tu@email.com"
          disabled={loading}
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: '8px',
            border: '1px solid #d1d5db',
            fontSize: '14px',
            outline: 'none',
            transition: 'border-color 0.2s'
          }}
          onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
          onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
        />
      </div>

      {/* Campo de Contraseña */}
      <div style={{ marginBottom: '20px' }}>
        <label
          style={{
            display: 'block',
            marginBottom: '8px',
            fontSize: '14px',
            fontWeight: '500',
            color: '#374151'
          }}
        >
          Contraseña
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Tu contraseña"
          disabled={loading}
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: '8px',
            border: '1px solid #d1d5db',
            fontSize: '14px',
            outline: 'none',
            transition: 'border-color 0.2s'
          }}
          onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
          onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
        />
      </div>

      {/* Mensaje de Error */}
      {error && (
        <div
          style={{
            padding: '12px',
            backgroundColor: '#fee2e2',
            border: '1px solid #fca5a5',
            borderRadius: '8px',
            color: '#991b1b',
            fontSize: '14px',
            marginBottom: '20px'
          }}
        >
          {error}
        </div>
      )}

      {/* Botón de Enviar */}
      <button
        type="submit"
        disabled={loading}
        style={{
          width: '100%',
          padding: '12px',
          backgroundColor: loading ? '#9ca3af' : '#3b82f6',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontSize: '16px',
          fontWeight: '600',
          cursor: loading ? 'not-allowed' : 'pointer',
          transition: 'background-color 0.2s',
          marginBottom: '16px'
        }}
        onMouseEnter={(e) => {
          if (!loading) e.target.style.backgroundColor = '#2563eb'
        }}
        onMouseLeave={(e) => {
          if (!loading) e.target.style.backgroundColor = '#3b82f6'
        }}
      >
        {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
      </button>

      {/* Botón de Login con Google */}
      <button
        type="button"
        onClick={handleGoogleLogin}
        disabled={loading}
        style={{
          width: '100%',
          padding: '12px',
          backgroundColor: 'white',
          color: '#374151',
          border: '1px solid #d1d5db',
          borderRadius: '8px',
          fontSize: '16px',
          fontWeight: '500',
          cursor: loading ? 'not-allowed' : 'pointer',
          transition: 'background-color 0.2s',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          marginBottom: '16px'
        }}
        onMouseEnter={(e) => {
          if (!loading) {
            e.target.style.backgroundColor = '#f9fafb'
          }
        }}
        onMouseLeave={(e) => {
          if (!loading) {
            e.target.style.backgroundColor = 'white'
          }
        }}
      >
        Iniciar sesión con Google
      </button>

      {/* Link a Registro */}
      <p
        style={{
          textAlign: 'center',
          fontSize: '14px',
          color: '#6b7280',
          marginTop: '16px'
        }}
      >
        ¿No tienes una cuenta?{' '}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault()
            // Cerrar modal de login y abrir modal de registro
            if (onClose) onClose()
            if (onSwitchToRegister) onSwitchToRegister()
          }}
          style={{
            background: 'none',
            border: 'none',
            color: '#3b82f6',
            textDecoration: 'underline',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          Regístrate
        </button>
      </p>
    </form>
  )
}

export default LoginForm