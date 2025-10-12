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
          </div>

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
    />
  </>
  )
}

export default Navbar
