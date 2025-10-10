import React, { useState, useEffect } from 'react';
import useSettings from '../hooks/useSettings';

// Constantes fuera del componente
const BREAK_TIME = 5 * 60  // 5 minutos (siempre fijo)
const TOTAL_SESSIONS = 4

/**
 * PomodoroTimer - El temporizador principal
 * 
 * Analogía: Es como un cronómetro de cocina inteligente.
 * Recuerda tu configuración de tiempo preferida y la usa automáticamente.
 */
const PomodoroTimer = () => {
  // Obtener la duración configurada por el usuario
  // Analogía: Como leer cuántos minutos pusiste en el temporizador del horno
  const { sessionDuration } = useSettings();
  
  // Convertir minutos a segundos (porque el timer trabaja en segundos)
  const STUDY_TIME = sessionDuration * 60;

  const [timeLeft, setTimeLeft] = useState(STUDY_TIME)
  const [isRunning, setIsRunning] = useState(false)
  const [sessionCount, setSessionCount] = useState(1)
  const [isBreak, setIsBreak] = useState(false)
  
  // Cuando el usuario cambia la duración en settings, actualizar el timer
  // Analogía: Como cuando ajustas la alarma y el reloj se actualiza
  useEffect(() => {
    if (!isRunning) {
      setTimeLeft(STUDY_TIME);
    }
  }, [sessionDuration, STUDY_TIME, isRunning]);

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
  }, [isRunning, isBreak, sessionCount, STUDY_TIME])

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
        {isBreak ? 'Descanso 😌' : `Sesión ${sessionCount} de ${TOTAL_SESSIONS}`}
      </h1>
      
      {/* Mostrar duración configurada */}
      {!isBreak && !isRunning && (
        <p style={{ 
          fontSize: '14px', 
          color: 'rgba(255, 255, 255, 0.8)',
          marginTop: '-10px',
          marginBottom: '10px'
        }}>
          {sessionDuration} minutos
        </p>
      )}
      
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