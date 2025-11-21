import React from 'react'
import LoginForm from '../../Auth/Loginform'

const LoginModal = ({ isOpen, onClose, onSwitchToRegister }) => {
  // Si el modal no está abierto, no se muestra
  if (!isOpen) return null

  // Función para manejar el cambio a registro
  const handleSwitchToRegister = () => {
    if (onClose) onClose() // Cerrar modal de login
    if (onSwitchToRegister) onSwitchToRegister() // Abrir modal de registro
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        display: 'flex',
        alignItems: 'flex-start',
        paddingTop: '60px',
        justifyContent: 'center',
        zIndex: 100
      }}
      onClick={onClose} // Cerrar al hacer clic en el overlay
    >
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: '32px',
          maxWidth: '400px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto'
        }}
        onClick={(e) => e.stopPropagation()} // Evitar cerrar al hacer clic dentro
      >
        {/* Header del Modal */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '24px'
          }}
        >
          <h2
            style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#1f2937',
              margin: 0
            }}
          >
            Iniciar Sesión
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '28px',
              cursor: 'pointer',
              color: '#6b7280'
            }}
          >
            ×
          </button>
        </div>

        {/* Formulario de Login */}
        <LoginForm 
          onSuccess={onClose} 
          onClose={onClose}
          onSwitchToRegister={handleSwitchToRegister}
        />
      </div>
    </div>
  )
}

export default LoginModal
