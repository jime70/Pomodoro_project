import React, { useState, useRef, useEffect } from 'react'

const GuestAuthDropdown = ({ onOpenLogin, onOpenRegister }) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const handleToggle = () => {
    setIsOpen(!isOpen)
  }

  const handleLoginClick = () => {
    setIsOpen(false)
    if (onOpenLogin) onOpenLogin()
  }

  const handleRegisterClick = () => {
    setIsOpen(false)
    if (onOpenRegister) onOpenRegister()
  }

  return (
    <div ref={dropdownRef} style={{ position: 'relative' }}>
      {/* Botón que muestra "Acceder" o "Usuario" */}
      <button 
        onClick={handleToggle}
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          color: 'white',
          padding: '8px 16px',
          borderRadius: '8px',
          border: 'none',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: '500',
          transition: 'background-color 0.2s',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}
        onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.3)'}
        onMouseLeave={(e) => {
          if (!isOpen) {
            e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'
          }
        }}
      >
        Acceder
        <span style={{ fontSize: '12px' }}>▼</span>
      </button>

      {/* Menú desplegable */}
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            right: 0,
            marginTop: '8px',
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            minWidth: '180px',
            overflow: 'hidden',
            zIndex: 100
          }}
        >
          {/* Opción: Login */}
          <button
            onClick={handleLoginClick}
            style={{
              width: '100%',
              padding: '12px 16px',
              textAlign: 'left',
              border: 'none',
              backgroundColor: 'transparent',
              cursor: 'pointer',
              fontSize: '14px',
              color: '#374151',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#f3f4f6'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
          >
            Login
          </button>

          {/* Opción: Registrarse */}
          <button
            onClick={handleRegisterClick}
            style={{
              width: '100%',
              padding: '12px 16px',
              textAlign: 'left',
              border: 'none',
              backgroundColor: 'transparent',
              cursor: 'pointer',
              fontSize: '14px',
              color: '#374151',
              transition: 'background-color 0.2s',
              borderTop: '1px solid #e5e7eb'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#f3f4f6'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
          >
            Registrarse
          </button>
        </div>
      )}
    </div>
  )
}

export default GuestAuthDropdown

