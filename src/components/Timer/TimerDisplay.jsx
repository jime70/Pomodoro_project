import React from 'react'
import { formatTime, TOTAL_SESSIONS } from '../../utils/timerUtils'

const TimerDisplay = ({ timeLeft, sessionCount, isBreak }) => {
  return (
    <>
      <h1 style={{ marginBottom: '20px', fontSize: '24px' }}>
        {isBreak ? 'Descanso' : `Sesión ${sessionCount} de ${TOTAL_SESSIONS}`}
      </h1>
      <div style={{ fontSize: '48px', fontWeight: 'bold', marginBottom: '20px' }}>
        {formatTime(timeLeft)}
      </div>
    </>
  )
}

export default TimerDisplay




