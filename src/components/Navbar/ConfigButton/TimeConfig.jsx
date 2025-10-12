import React, { useState, useEffect } from 'react';

const TimeConfig = ({ onDurationChange }) => {
  const [selectedDuration, setSelectedDuration] = useState('25');

  // Cargar preferencia guardada al montar el componente
  useEffect(() => {
    const savedDuration = localStorage.getItem('sessionDuration');
    if (savedDuration) {
      setSelectedDuration(savedDuration);
      if (onDurationChange && typeof onDurationChange === 'function') {
        onDurationChange(savedDuration); // Aplicar la duración guardada
      }
    }
  }, [onDurationChange]);

  const handleDurationChange = (duration) => {
    setSelectedDuration(duration);
    localStorage.setItem('sessionDuration', duration); // Guardar preferencia
    if (onDurationChange && typeof onDurationChange === 'function') {
      onDurationChange(duration);
    }
  };

  return (
    <div style={{ marginBottom: '32px' }}>
      <h3 style={{
        fontSize: '18px',
        fontWeight: '600',
        color: '#374151',
        marginBottom: '16px'
      }}>
        Duración de Sesión
      </h3>
      
      <div 
        className="duration-buttons"
        style={{ 
          display: 'flex', 
          gap: '16px',
          flexDirection: 'row' // Desktop: horizontal
        }}>
        <button 
          onClick={() => handleDurationChange('25')}
          style={{
            flex: 1,
            padding: '16px',
            border: `2px solid ${selectedDuration === '25' ? '#10b981' : '#e5e7eb'}`,
            borderRadius: '12px',
            backgroundColor: selectedDuration === '25' ? '#d1fae5' : 'white',
            color: selectedDuration === '25' ? '#10b981' : '#374151',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            transition: 'all 0.2s'
          }}
        >
          25 min
        </button>
        
        <button 
          onClick={() => handleDurationChange('35')}
          style={{
            flex: 1,
            padding: '16px',
            border: `2px solid ${selectedDuration === '35' ? '#10b981' : '#e5e7eb'}`,
            borderRadius: '12px',
            backgroundColor: selectedDuration === '35' ? '#d1fae5' : 'white',
            color: selectedDuration === '35' ? '#10b981' : '#374151',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            transition: 'all 0.2s'
          }}
        >
          35 min
        </button>
        
        <button 
          onClick={() => handleDurationChange('45')}
          style={{
            flex: 1,
            padding: '16px',
            border: `2px solid ${selectedDuration === '45' ? '#10b981' : '#e5e7eb'}`,
            borderRadius: '12px',
            backgroundColor: selectedDuration === '45' ? '#d1fae5' : 'white',
            color: selectedDuration === '45' ? '#10b981' : '#374151',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            transition: 'all 0.2s'
          }}
        >
          45 min
        </button>
      </div>
      
      {/* CSS Responsivo */}
      <style>{`
        @media (max-width: 768px) {
          .duration-buttons {
            flex-direction: column !important;
          }
        }
      `}</style>
    </div>
  );
};

export default TimeConfig;