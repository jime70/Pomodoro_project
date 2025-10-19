import React from 'react';
import useSettings from '../../../hooks/useSettings';

const TimeConfig = () => {
  const { sessionDuration, updateSessionDuration } = useSettings();

  const handleDurationChange = (duration) => {
    updateSessionDuration(parseInt(duration, 10));
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
          flexDirection: 'row'
        }}>
        {['25', '35', '45'].map(duration => (
          <button
            key={duration}
            onClick={() => handleDurationChange(duration)}
            style={{
              flex: 1,
              padding: '16px',
              border: `2px solid ${sessionDuration === parseInt(duration, 10) ? '#10b981' : '#e5e7eb'}`,
              borderRadius: '12px',
              backgroundColor: sessionDuration === parseInt(duration, 10) ? '#d1fae5' : 'white',
              color: sessionDuration === parseInt(duration, 10) ? '#10b981' : '#374151',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'all 0.2s'
            }}
          >
            {duration} min
          </button>
        ))}
      </div>

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