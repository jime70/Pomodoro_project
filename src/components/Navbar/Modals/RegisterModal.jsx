import React from 'react'
import RegisterForm from '../../Auth/registerForm'

const RegisterModal = ({ isOpen, onClose, onSwitchToLogin }) => {
  // Si el modal no está abierto, no se muestra
  if (!isOpen) return null

  // Función para manejar el cambio a login
  const handleSwitchToLogin = () => {
    if (onClose) onClose() // Cerrar modal de registro
    if (onSwitchToLogin) onSwitchToLogin() // Abrir modal de login
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
          maxWidth: '500px',
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
            Registrarse
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

        {/* Formulario de Registro */}
        <RegisterForm 
          onSuccess={onClose} 
          onClose={onClose}
          onSwitchToLogin={handleSwitchToLogin}
        />
      </div>
    </div>
  )
}

export default RegisterModal
