import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import AuthDropdown from '../Auth/AuthDropdown';
import Loginform from '../Auth/Loginform';
import RegisterForm from '../Auth/registerForm';

const Navbar = () => {
  const { isAuthenticated, loading } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  const handleSwitchToRegister = () => {
    setShowLoginModal(false);
    setShowRegisterModal(true);
  };

  const handleSwitchToLogin = () => {
    setShowRegisterModal(false);
    setShowLoginModal(true);
  };

  return (
    <>
      <nav 
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(8px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          height: '64px'
        }}
      >
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '64px' }}>
            {/* Logo/Título */}
            <div>
              <h1 style={{ fontSize: '20px', fontWeight: 'bold', color: 'white', margin: 0 }}>
                🍅 Pomodoro Timer
              </h1>
            </div>

            {/* Menú de navegación */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {!loading && (
                <>
                  {!isAuthenticated ? (
                    // Mostrar botones de Login y Registro si NO hay sesión
                    <>
                      <button 
                        onClick={() => setShowLoginModal(true)}
                        style={{
                          backgroundColor: 'rgba(255, 255, 255, 0.2)',
                          color: 'white',
                          padding: '8px 20px',
                          borderRadius: '8px',
                          border: 'none',
                          cursor: 'pointer',
                          fontSize: '14px',
                          fontWeight: '500',
                          transition: 'background-color 0.2s'
                        }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.3)'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'}
                      >
                        Login
                      </button>
                      
                      <button 
                        onClick={() => setShowRegisterModal(true)}
                        style={{
                          backgroundColor: '#3b82f6',
                          color: 'white',
                          padding: '8px 20px',
                          borderRadius: '8px',
                          border: 'none',
                          cursor: 'pointer',
                          fontSize: '14px',
                          fontWeight: '500',
                          transition: 'background-color 0.2s'
                        }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = '#2563eb'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = '#3b82f6'}
                      >
                        Registrarse
                      </button>
                    </>
                  ) : (
                    // Mostrar Dropdown de usuario si HAY sesión
                    <AuthDropdown />
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Modal de Login */}
      {showLoginModal && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '20px'
          }}
          onClick={() => setShowLoginModal(false)}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <Loginform 
              onClose={() => setShowLoginModal(false)}
              onSwitchToRegister={handleSwitchToRegister}
            />
          </div>
        </div>
      )}

      {/* Modal de Registro */}
      {showRegisterModal && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '20px'
          }}
          onClick={() => setShowRegisterModal(false)}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <RegisterForm 
              onClose={() => setShowRegisterModal(false)}
              onSwitchToLogin={handleSwitchToLogin}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
