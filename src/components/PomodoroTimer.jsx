import React from 'react'
import { useSettings } from '../context/SettingsContext'
import { usePomodoroTimer } from '../hooks/usePomodoroTimer'
import AlarmPlayer from './Audio/AlarmPlayer'
import BackgroundMusicPlayer from './Audio/BackgroundMusicPlayer'
import TimerDisplay from './Timer/TimerDisplay'
import TimerControls from './Timer/TimerControls'

const PomodoroTimer = () => {
  const { sessionDuration } = useSettings()
  
  const {
    timeLeft,
    isRunning,
    sessionCount,
    isBreak,
    shouldPlayAlarm,
    isWaitingForAlarm,
    handleStartStop,
    handleReset,
    handleAlarmComplete
  } = usePomodoroTimer(sessionDuration)

  return (
    <>
      <AlarmPlayer 
        shouldPlay={shouldPlayAlarm}
        onPlayComplete={handleAlarmComplete}
      />
      
      <BackgroundMusicPlayer
        isStudySession={isRunning && !isBreak}
        isRunning={isRunning}
      />
      
      <div style={{
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '10px',
        padding: '30px',
        textAlign: 'center',
        color: 'white',
        maxWidth: '400px',
        width: '100%'
      }}>
        <TimerDisplay 
          timeLeft={timeLeft}
          sessionCount={sessionCount}
          isBreak={isBreak}
        />
        
        <TimerControls
          isRunning={isRunning}
          isWaitingForAlarm={isWaitingForAlarm}
          onStartStop={handleStartStop}
          onReset={handleReset}
        />
      </div>
    </>
  )
}

export default PomodoroTimer
