import { useState, useEffect, useRef } from 'react'
import { BREAK_TIME, TOTAL_SESSIONS } from '../utils/timerUtils'

export const usePomodoroTimer = (sessionDuration) => {
  const STUDY_TIME = sessionDuration * 60

  const [timeLeft, setTimeLeft] = useState(STUDY_TIME)
  const [isRunning, setIsRunning] = useState(false)
  const [sessionCount, setSessionCount] = useState(1)
  const [isBreak, setIsBreak] = useState(false)
  const [shouldPlayAlarm, setShouldPlayAlarm] = useState(false)
  const [pendingAction, setPendingAction] = useState(null)
  
  const isWaitingForAlarmRef = useRef(false)
  const pendingActionRef = useRef(null)
  const isBreakRef = useRef(false)
  const sessionCountRef = useRef(1)
  const sessionDurationRef = useRef(sessionDuration)

  // Sincronizar refs con estados
  useEffect(() => {
    pendingActionRef.current = pendingAction
  }, [pendingAction])

  useEffect(() => {
    isBreakRef.current = isBreak
  }, [isBreak])

  useEffect(() => {
    sessionCountRef.current = sessionCount
  }, [sessionCount])

  useEffect(() => {
    sessionDurationRef.current = sessionDuration
  }, [sessionDuration])

  // Actualizar tiempo cuando cambie la duración SOLO si no hay sesión activa y no estamos en transición
  // Este efecto solo debe ejecutarse cuando cambia sessionDuration, pero debemos verificar condiciones actuales
  useEffect(() => {
    // Solo actualizar si no hay sesión activa y no estamos en transición
    if (!isRunning && !isBreak && !isWaitingForAlarmRef.current && !pendingAction) {
      setTimeLeft(sessionDuration * 60)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionDuration]) // Solo dependemos de sessionDuration para evitar recreaciones innecesarias

  // Handler para iniciar/pausar
  const handleStartStop = () => {
    if (!isRunning && !isBreak && !isWaitingForAlarmRef.current && !pendingAction) {
      isWaitingForAlarmRef.current = true
      setPendingAction('start-session')
      setShouldPlayAlarm(true)
    } else if (isRunning) {
      setIsRunning(false)
    }
  }

  // Callback cuando la alarma termina
  const handleAlarmComplete = () => {
    if (!isWaitingForAlarmRef.current) return
    
    const action = pendingActionRef.current
    
    // Actualizar refs primero para evitar race conditions
    isWaitingForAlarmRef.current = false
    
    // Realizar todas las actualizaciones de estado de forma atómica
    if (action === 'start-session') {
      setIsRunning(true)
      setShouldPlayAlarm(false)
      setPendingAction(null)
    } else if (action === 'start-break') {
      // Actualizar todos los estados necesarios para iniciar break
      // Actualizar ref primero
      isBreakRef.current = true
      setIsBreak(true)
      setTimeLeft(BREAK_TIME)
      setIsRunning(true)
      setShouldPlayAlarm(false)
      setPendingAction(null)
    } else if (action === 'start-new-session') {
      // Actualizar todos los estados necesarios para iniciar nueva sesión
      // Actualizar refs primero
      isBreakRef.current = false
      const newCount = sessionCountRef.current + 1
      sessionCountRef.current = newCount
      
      setIsBreak(false)
      setSessionCount(newCount)
      setTimeLeft(sessionDurationRef.current * 60)
      setIsRunning(true)
      setShouldPlayAlarm(false)
      setPendingAction(null)
    } else if (action === 'complete-cycle') {
      // Resetear todo al completar el ciclo
      sessionCountRef.current = 1
      isBreakRef.current = false
      setSessionCount(1)
      setIsBreak(false)
      setTimeLeft(sessionDurationRef.current * 60)
      setShouldPlayAlarm(false)
      setPendingAction(null)
    }
  }

  // Efecto del contador - solo depende de isRunning para evitar recreaciones innecesarias
  useEffect(() => {
    if (!isRunning || isWaitingForAlarmRef.current) return

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0) return 0
        const newTime = prev - 1
        if (newTime === 0) {
          // Detener el intervalo primero
          clearInterval(interval)
          
          // Actualizar ref antes de actualizar estados
          isWaitingForAlarmRef.current = true
          
          // Detener el timer
          setIsRunning(false)
          
          // Determinar la acción basándose en los valores actuales de los refs
          if (!isBreakRef.current) {
            // Sesión de estudio terminó
            const action = sessionCountRef.current < TOTAL_SESSIONS ? 'start-break' : 'complete-cycle'
            setPendingAction(action)
          } else {
            // Break terminó
            setPendingAction('start-new-session')
          }
          
          setShouldPlayAlarm(true)
        }
        return newTime
      })
    }, 1000)

    // Cleanup: asegurar que el intervalo se limpie correctamente
    return () => {
      clearInterval(interval)
    }
  }, [isRunning]) // Solo isRunning como dependencia para evitar recreaciones innecesarias

  // Handler para resetear
  const handleReset = () => {
    // Actualizar refs primero
    isWaitingForAlarmRef.current = false
    isBreakRef.current = false
    sessionCountRef.current = 1
    
    // Limpiar estados
    if (shouldPlayAlarm) {
      setShouldPlayAlarm(false)
    }
    if (pendingAction) {
      setPendingAction(null)
    }
    setIsRunning(false)
    setSessionCount(1)
    setIsBreak(false)
    setTimeLeft(sessionDurationRef.current * 60)
  }

  const isWaitingForAlarm = isWaitingForAlarmRef.current || shouldPlayAlarm

  return {
    timeLeft,
    isRunning,
    sessionCount,
    isBreak,
    shouldPlayAlarm,
    isWaitingForAlarm,
    handleStartStop,
    handleReset,
    handleAlarmComplete
  }
}

