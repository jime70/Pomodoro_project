import React, { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import LoginModal from './Modals/LoginModal'
import RegisterModal from './Modals/RegisterModal'
import AuthDropdown from '../Auth/AuthDropdown'
import GuestAuthDropdown from '../Auth/GuestAuthDropdown'

const AuthSection = () => {
  const { isAuthenticated } = useAuth()
  const [ShowLogin, setShowLogin] = useState(false)
  const [ShowRegister, setShowRegister] = useState(false)

  const handleOpenLogin = () => {
    setShowLogin(true)
    setShowRegister(false)
  }

  const handleCloseLogin = () => {
    setShowLogin(false)
  }

  const handleOpenRegister = () => {
    setShowRegister(true)
    setShowLogin(false)
  }

  const handleCloseRegister = () => {
    setShowRegister(false)
  }

  return (
    <>
      {/* Si NO hay sesión: mostrar dropdown con opciones Login y Registrarse */}
      {!isAuthenticated ? (
        <GuestAuthDropdown 
          onOpenLogin={handleOpenLogin}
          onOpenRegister={handleOpenRegister}
        />
      ) : (
        // Si HAY sesión: mostrar dropdown con opciones del usuario
        <AuthDropdown />
      )}

      {/* Modal de Login */}
      <LoginModal 
        isOpen={ShowLogin} 
        onClose={handleCloseLogin}
        onSwitchToRegister={handleOpenRegister}
      />
      
      {/* Modal de Registro */}
      <RegisterModal 
        isOpen={ShowRegister} 
        onClose={handleCloseRegister}
        onSwitchToLogin={handleOpenLogin}
      />
    </>
  )
}

export default AuthSection
