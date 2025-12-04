import React from 'react'

const TimerControls = ({ isRunning, isWaitingForAlarm, onStartStop, onReset }) => {
  return (
    <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
      <button
        onClick={onStartStop}
        disabled={isWaitingForAlarm}
        style={{
          padding: '10px 20px',
          backgroundColor: isRunning ? '#ef4444' : '#22c55e',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: isWaitingForAlarm ? 'not-allowed' : 'pointer',
          fontSize: '16px',
          opacity: isWaitingForAlarm ? 0.5 : 1
        }}
      >
        {isWaitingForAlarm ? 'Esperando alarma...' : (isRunning ? 'Pausar' : 'Iniciar')}
      </button>
      
      <button
        onClick={onReset}
        style={{
          padding: '10px 20px',
          backgroundColor: '#6b7280',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          fontSize: '16px'
        }}
      >
        Resetear
      </button>
    </div>
  )
}

export default TimerControls

