import React, { useState, useEffect } from 'react'

const PomodoroTimer = () => {
  const STUDY_TIME = 25 * 60 // 25 minutos
  const BREAK_TIME = 5 * 60  // 5 minutos
  const TOTAL_SESSIONS = 4

  const [timeLeft, setTimeLeft] = useState(STUDY_TIME)
  const [isRunning, setIsRunning] = useState(false)
  const [sessionCount, setSessionCount] = useState(1)
  const [isBreak, setIsBreak] = useState(false)

  // Formatear tiempo mm:ss
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  // Efecto principal del temporizador
  useEffect(() => {
    if (!isRunning) return

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev > 0) return prev - 1

        // --- Cuando llega a 0 ---
        clearInterval(timer)

        if (!isBreak) {
          // Terminó sesión de trabajo
          if (sessionCount < TOTAL_SESSIONS) {
            setIsBreak(true)
            setTimeLeft(BREAK_TIME)
          } else {
            // Ciclo completo terminado
            setIsRunning(false)
            setSessionCount(1)
            setIsBreak(false)
            setTimeLeft(STUDY_TIME)
          }
        } else {
          // Terminó break → siguiente sesión
          setIsBreak(false)
          setSessionCount(prev => prev + 1)
          setTimeLeft(STUDY_TIME)
        }

        return 0
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isRunning, isBreak, sessionCount])

  const handleStartStop = () => setIsRunning(prev => !prev)

  const handleReset = () => {
    setIsRunning(false)
    setSessionCount(1)
    setIsBreak(false)
    setTimeLeft(STUDY_TIME)
  }

  return (
    <div style={{
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      borderRadius: '10px',
      padding: '30px',
      textAlign: 'center',
      color: 'white',
      maxWidth: '400px',
      width: '100%'
    }}>
      <h1 style={{ marginBottom: '20px', fontSize: '24px' }}>
        {isBreak ? 'Descanso' : `Sesión ${sessionCount} de ${TOTAL_SESSIONS}`}
      </h1>
      
      <div style={{ fontSize: '48px', fontWeight: 'bold', marginBottom: '20px' }}>
        {formatTime(timeLeft)}
      </div>
      
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
        <button
          onClick={handleStartStop}
          style={{
            padding: '10px 20px',
            backgroundColor: isRunning ? '#ef4444' : '#22c55e',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          {isRunning ? 'Pausar' : 'Iniciar'}
        </button>
        
        <button
          onClick={handleReset}
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
    </div>
  )
}

export default PomodoroTimer