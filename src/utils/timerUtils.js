// Constantes del timer
export const BREAK_TIME = 5 * 60  // 5 minutos en segundos
export const TOTAL_SESSIONS = 4

// Formatear tiempo en formato mm:ss
export const formatTime = (seconds) => {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}




