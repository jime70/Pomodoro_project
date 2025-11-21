import React, { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { register as registerService } from '../../services/authService.js'

const RegisterForm = ({ onSuccess, onClose, onSwitchToLogin }) => {
  const { setUser, setToken } = useAuth()
  
  // Estados locales del formulario
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  
  const [errors, setErrors] = useState({})
  const [generalError, setGeneralError] = useState('')
  const [loading, setLoading] = useState(false)

  // Función para manejar cambios en los campos
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    const fieldValue = type === 'checkbox' ? checked : value
    
    setFormData(prev => ({
      ...prev,
      [name]: fieldValue
    }))
    
    // Limpiar error del campo cuando el usuario empieza a escribir
    setErrors(prev => ({
      ...prev,
      [name]: undefined
    }))
    setGeneralError('')
  }

  // Función para validar el formulario
  const validateForm = () => {
    const newErrors = {}
    
    // Validar nombre
    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido'
    } else if (formData.nombre.trim().length < 2) {
      newErrors.nombre = 'El nombre debe tener al menos 2 caracteres'
    }
    
    // Validar email
    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido'
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.email)) {
        newErrors.email = 'El email no tiene un formato válido'
      }
    }
    
    // Validar contraseña
    if (!formData.password.trim()) {
      newErrors.password = 'La contraseña es requerida'
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres'
    }
    
    // Validar confirmación de contraseña
    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Debes confirmar tu contraseña'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Verificar si el formulario está listo para enviar
  const isFormReady = 
    formData.nombre.trim() &&
    formData.email.trim() &&
    formData.password.trim() &&
    formData.confirmPassword.trim()

  // Función para manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault()
    setGeneralError('')
    
    // Validar formulario
    if (!validateForm()) {
      return
    }
    
    setLoading(true)
    
    try {
      // Llamar al servicio de registro
      const result = await registerService(
        formData.nombre,
        formData.email,
        formData.password
      )
      
      if (result.success) {
        // Actualizar el contexto con los datos del usuario
        setUser(result.data)
        setToken(result.data.token)
        
        // Si el registro es exitoso, cerrar el modal y ejecutar callback
        if (onSuccess) onSuccess()
        if (onClose) onClose()
      } else {
        // Mostrar error del backend
        setGeneralError(result.error || 'Error al registrarse')
      }
    } catch {
      setGeneralError('No se pudo completar el registro')
    } finally {
      setLoading(false)
    }
  }

  // Función para registro con Google (preparado para cuando se implemente el backend)
  const handleGoogleRegister = async () => {
    setGeneralError('')
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
      setGeneralError('Registro con Google próximamente disponible')
    } catch {
      setGeneralError('No se pudo completar el registro con Google')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Campo de Nombre */}
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
          Nombre
        </label>
        <input
          type="text"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          placeholder="Tu nombre completo"
          disabled={loading}
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: '8px',
            border: `1px solid ${errors.nombre ? '#ef4444' : '#d1d5db'}`,
            fontSize: '14px',
            outline: 'none',
            transition: 'border-color 0.2s'
          }}
          onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
          onBlur={(e) => {
            if (!errors.nombre) {
              e.target.style.borderColor = '#d1d5db'
            }
          }}
        />
        {errors.nombre && (
          <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>
            {errors.nombre}
          </p>
        )}
      </div>

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
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="tu@email.com"
          disabled={loading}
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: '8px',
            border: `1px solid ${errors.email ? '#ef4444' : '#d1d5db'}`,
            fontSize: '14px',
            outline: 'none',
            transition: 'border-color 0.2s'
          }}
          onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
          onBlur={(e) => {
            if (!errors.email) {
              e.target.style.borderColor = '#d1d5db'
            }
          }}
        />
        {errors.email && (
          <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>
            {errors.email}
          </p>
        )}
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
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Mínimo 6 caracteres"
          disabled={loading}
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: '8px',
            border: `1px solid ${errors.password ? '#ef4444' : '#d1d5db'}`,
            fontSize: '14px',
            outline: 'none',
            transition: 'border-color 0.2s'
          }}
          onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
          onBlur={(e) => {
            if (!errors.password) {
              e.target.style.borderColor = '#d1d5db'
            }
          }}
        />
        {errors.password && (
          <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>
            {errors.password}
          </p>
        )}
      </div>

      {/* Campo de Confirmar Contraseña */}
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
          Confirmar Contraseña
        </label>
        <input
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Repite tu contraseña"
          disabled={loading}
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: '8px',
            border: `1px solid ${errors.confirmPassword ? '#ef4444' : '#d1d5db'}`,
            fontSize: '14px',
            outline: 'none',
            transition: 'border-color 0.2s'
          }}
          onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
          onBlur={(e) => {
            if (!errors.confirmPassword) {
              e.target.style.borderColor = '#d1d5db'
            }
          }}
        />
        {errors.confirmPassword && (
          <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>
            {errors.confirmPassword}
          </p>
        )}
      </div>

      {/* Mensaje de Error General */}
      {generalError && (
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
          {generalError}
        </div>
      )}

      {/* Botón de Registro */}
      <button
        type="submit"
        disabled={!isFormReady || loading}
        style={{
          width: '100%',
          padding: '12px',
          backgroundColor: (!isFormReady || loading) ? '#9ca3af' : '#3b82f6',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontSize: '16px',
          fontWeight: '600',
          cursor: (!isFormReady || loading) ? 'not-allowed' : 'pointer',
          transition: 'background-color 0.2s',
          marginBottom: '16px'
        }}
        onMouseEnter={(e) => {
          if (isFormReady && !loading) {
            e.target.style.backgroundColor = '#2563eb'
          }
        }}
        onMouseLeave={(e) => {
          if (isFormReady && !loading) {
            e.target.style.backgroundColor = '#3b82f6'
          }
        }}
      >
        {loading ? 'Registrando...' : 'Registrarme'}
      </button>

      {/* Botón de Registro con Google */}
      <button
        type="button"
        onClick={handleGoogleRegister}
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
          gap: '8px'
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
        Registrarse con Google
      </button>

      {/* Link a Login */}
      <p
        style={{
          textAlign: 'center',
          fontSize: '14px',
          color: '#6b7280',
          marginTop: '16px'
        }}
      >
        ¿Ya tienes una cuenta?{' '}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault()
            // Cerrar modal de registro y abrir modal de login
            if (onClose) onClose()
            if (onSwitchToLogin) onSwitchToLogin()
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
          Inicia sesión
        </button>
      </p>
    </form>
  )
}

export default RegisterForm
