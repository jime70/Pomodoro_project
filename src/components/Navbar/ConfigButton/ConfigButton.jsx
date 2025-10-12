import React from 'react';

const ConfigButton = ({ onOpenSettings }) => {
  const handleClick = () => {
    onOpenSettings();
  };

  return (
    <button 
      onClick={handleClick}
      style={{
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        color: 'white',
        padding: '8px 16px',
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
              Configuración
            </button>
  );
};

export default ConfigButton;