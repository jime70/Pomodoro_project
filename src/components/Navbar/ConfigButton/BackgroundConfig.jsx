import React from 'react';
import useSettings from '../../../hooks/useSettings';

const BackgroundConfig = () => {
  const { backgroundTheme, updateBackgroundTheme } = useSettings();

  const handleBackgroundChange = (background) => {
    updateBackgroundTheme(background);
  };

  return (
    <div style={{ marginBottom: '32px' }}>
      <h3 style={{
        fontSize: '18px',
        fontWeight: '600',
        color: '#374151',
        marginBottom: '16px'
      }}>
        Fondo Visual
      </h3>
      
      <div 
        className="background-buttons"
        style={{ 
          display: 'flex', 
          gap: '16px',
          flexDirection: 'row' // Desktop: horizontal
        }}>
        <button 
          onClick={() => handleBackgroundChange('autumn')}
          style={{
            flex: 1,
            padding: '16px',
            border: `2px solid ${backgroundTheme === 'autumn' ? '#10b981' : '#e5e7eb'}`,
            borderRadius: '12px',
            backgroundColor: backgroundTheme === 'autumn' ? '#d1fae5' : 'white',
            color: backgroundTheme === 'autumn' ? '#10b981' : '#374151',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            transition: 'all 0.2s'
          }}
        >
          Otoño
        </button>
        
        <button 
          onClick={() => handleBackgroundChange('storm')}
          style={{
            flex: 1,
            padding: '16px',
            border: `2px solid ${backgroundTheme === 'storm' ? '#10b981' : '#e5e7eb'}`,
            borderRadius: '12px',
            backgroundColor: backgroundTheme === 'storm' ? '#d1fae5' : 'white',
            color: backgroundTheme === 'storm' ? '#10b981' : '#374151',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            transition: 'all 0.2s'
          }}
        >
          Tormenta
        </button>
      </div>
      
      {/* CSS Responsivo */}
      <style>{`
        @media (max-width: 768px) {
          .background-buttons {
            flex-direction: column !important;
          }
        }
      `}</style>
    </div>
  );
};

export default BackgroundConfig;