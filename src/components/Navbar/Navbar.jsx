import React, { useState } from 'react'
import ConfigButton from './ConfigButton/ConfigButton'
import SettingsModal from './Modals/SettingsModal'

const Navbar = () => {
  const [ShowSettings, setShowSettings] = useState(false); // TODO: Usar para mostrar modal de configuración

  const handleOpenSettings = () => {
    setShowSettings(true);
  };

  const handleCloseSettings = () => {
    setShowSettings(false);
  };

  const handleBackgroundChange = (background) => {
    console.log('Fondo cambiado a:', background);
    // TODO: Aplicar el fondo a la app
  };

  const handleDurationChange = (duration) => {
    console.log('Duración cambiada a:', duration);
    // TODO: Aplicar la duración al timer
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
            <h1 style={{ fontSize: '20px', fontWeight: 'bold', color: 'white', margin: 0 }}>Pomodoro Timer</h1>
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

          {/* Menú de navegación */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <ConfigButton onOpenSettings={handleOpenSettings} />
            <SettingsModal isOpen={ShowSettings} onClose={handleCloseSettings} />
            
            {/* Dropdown de Autenticación */}
            <button 
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                padding: '8px 16px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Usuario
            </button>
          </div>
        </div>
      </div>
    </nav>

    {/* Modal de configuración */}
    <SettingsModal 
      isOpen={ShowSettings} 
      onClose={handleCloseSettings}
      onBackgroundChange={handleBackgroundChange}
      onDurationChange={handleDurationChange}
    />
  </>
  )
}
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
