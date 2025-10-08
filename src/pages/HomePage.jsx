import React from 'react'
import PomodoroTimer from '../components/PomodoroTimer'
import Navbar from '../components/Navbar/Navbar'
import autumnGif from '../assets/images/autumn.gif'

const HomePage = () => {
  return (
    <div 
      style={{
        minHeight: '100vh',
        backgroundImage: `url(${autumnGif})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        paddingTop: '64px' // Espacio para el navbar fijo
      }}
    >
      <Navbar />
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'calc(100vh - 64px)',
        padding: '20px'
      }}>
        <PomodoroTimer />
      </div>
    </div>
  )
}

export default HomePage
