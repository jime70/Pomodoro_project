import React from 'react'
import PomodoroTimer from '../components/PomodoroTimer'
import Navbar from '../components/Navbar/Navbar'
import { useSettings } from '../context/SettingsContext'
import autumnGif from '../assets/images/autumn.gif'
import stormGif from '../assets/images/storm.gif'

const HomePage = () => {
  const { backgroundTheme } = useSettings()
  
  // Debug
  console.log('🏠 HomePage - backgroundTheme:', backgroundTheme);
  
  // Seleccionar imagen de fondo basada en el tema
  const backgroundImage = backgroundTheme === 'storm' ? stormGif : autumnGif
  console.log('🏠 HomePage - backgroundImage:', backgroundImage);
  console.log('🏠 HomePage - stormGif:', stormGif);
  console.log('🏠 HomePage - autumnGif:', autumnGif);
  
  return (
    <div 
      style={{
        minHeight: '100vh',
        backgroundImage: `url(${backgroundImage})`,
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
