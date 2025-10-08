import React, { createContext, useContext, useState } from 'react'

// Configuraciones predefinidas del timer
const TIMER_PRESETS = {
  short: { 
    work: 25, 
    break: 5, 
    label: 'Corto (25min trabajo, 5min descanso)' 
  },
  medium: { 
    work: 35, 
    break: 5, 
    label: 'Medio (35min trabajo, 5min descanso)' 
  },
  long: { 
    work: 45, 
    break: 10, 
    label: 'Largo (45min trabajo, 10min descanso)' 
  }
}

// Estado inicial
const initialState = {
  selectedPreset: 'short',
  workTime: TIMER_PRESETS.short.work,
  breakTime: TIMER_PRESETS.short.break,
  isWorkSession: true,
  isRunning: false,
  timeLeft: TIMER_PRESETS.short.work * 60 // en segundos
}

// Crear el contexto
const TimerContext = createContext()

// Provider del contexto
export const TimerProvider = ({ children }) => {
  const [timerState, setTimerState] = useState(initialState)

  // Función para cambiar la configuración del timer
  const updateTimerPreset = (presetKey) => {
    const preset = TIMER_PRESETS[presetKey]
    setTimerState(prev => ({
      ...prev,
      selectedPreset: presetKey,
      workTime: preset.work,
      breakTime: preset.break,
      timeLeft: preset.work * 60, // Resetear al tiempo de trabajo
      isWorkSession: true,
      isRunning: false
    }))
  }

  // Función para alternar entre trabajo y descanso
  const switchSession = () => {
    setTimerState(prev => ({
      ...prev,
      isWorkSession: !prev.isWorkSession,
      timeLeft: prev.isWorkSession ? prev.breakTime * 60 : prev.workTime * 60
    }))
  }

  // Función para iniciar/pausar el timer
  const toggleTimer = () => {
    setTimerState(prev => ({
      ...prev,
      isRunning: !prev.isRunning
    }))
  }

  // Función para resetear el timer
  const resetTimer = () => {
    setTimerState(prev => ({
      ...prev,
      timeLeft: prev.workTime * 60,
      isWorkSession: true,
      isRunning: false
    }))
  }

  // Función para actualizar el tiempo restante
  const updateTimeLeft = (newTime) => {
    setTimerState(prev => ({
      ...prev,
      timeLeft: newTime
    }))
  }

  const value = {
    ...timerState,
    presets: TIMER_PRESETS,
    updateTimerPreset,
    switchSession,
    toggleTimer,
    resetTimer,
    updateTimeLeft
  }

  return (
    <TimerContext.Provider value={value}>
      {children}
    </TimerContext.Provider>
  )
}

// Hook personalizado para usar el contexto
export const useTimer = () => {
  const context = useContext(TimerContext)
  if (!context) {
    throw new Error('useTimer debe ser usado dentro de TimerProvider')
  }
  return context
}