import React, { useState } from 'react';
import PomodoroTimer from '../components/PomodoroTimer';
import Navbar from '../components/Navbar/Navbar';
import GoalsList from '../components/Goals/GoalsList';
import TimerSettings from '../components/Settings/TimerSettings';
import { useAuth } from '../context/AuthContext';
import useSettings from '../hooks/useSettings';
import autumnGif from '../assets/images/autumn.gif';
import stormGif from '../assets/images/storm.gif';

/**
 * HomePage - La página principal de la aplicación
 * 
 * Analogía: Es como el living de tu casa. Aquí tienes:
 * - El reloj en la pared (Timer)
 * - Tu lista de tareas en la nevera (Goals)
 * - El control remoto del aire (Settings)
 * - El ambiente que elegiste (Background)
 */
const HomePage = () => {
  const { isAuthenticated } = useAuth();
  const [currentSession] = useState(1); // TODO: Conectar con el timer para cambiar sesión
  
  // Hook de configuración - Nos da acceso al tema seleccionado
  const { backgroundTheme } = useSettings();
  
  // Estado para abrir/cerrar el panel de configuración
  const [showSettings, setShowSettings] = useState(false);

  // Elegir el background según la configuración del usuario
  // Analogía: Como cambiar el wallpaper de tu escritorio según tu mood
  const backgroundImage = backgroundTheme === 'storm' ? stormGif : autumnGif;

  return (
    <div 
      style={{
        minHeight: '100vh',
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        paddingTop: '64px', // Espacio para el navbar fijo
        transition: 'background-image 0.5s ease-in-out' // Transición suave al cambiar tema
      }}
    >
      <Navbar />
      
      {/* Botón flotante de configuración (solo si está autenticado) */}
      {isAuthenticated && (
        <button
          onClick={() => setShowSettings(true)}
          style={{
            position: 'fixed',
            bottom: '32px',
            right: '32px',
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            fontSize: '24px',
            cursor: 'pointer',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)',
            zIndex: 40,
            transition: 'transform 0.2s, background-color 0.2s'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'scale(1.1)';
            e.target.style.backgroundColor = '#2563eb';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'scale(1)';
            e.target.style.backgroundColor = '#3b82f6';
          }}
          title="Configuración"
        >
          ⚙️
        </button>
      )}
      
      {/* Panel de Configuración (Modal) */}
      <TimerSettings 
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />
      
      <div style={{
        display: 'flex',
        gap: '24px',
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '40px 20px',
        minHeight: 'calc(100vh - 64px)',
        alignItems: 'flex-start'
      }}>
        {/* Timer - Centro */}
        <div style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '400px'
        }}>
          <PomodoroTimer />
        </div>

        {/* Panel de Objetivos - Lateral Derecho */}
        {isAuthenticated && (
          <div style={{
            width: '400px',
            flexShrink: 0
          }}>
            <GoalsList currentSession={currentSession} />
          </div>
        )}
      </div>

      {/* Versión móvil - Objetivos abajo del timer */}
      <style>{`
        @media (max-width: 1024px) {
          .main-container {
            flex-direction: column !important;
            align-items: center !important;
          }
          .goals-panel {
            width: 100% !important;
            max-width: 500px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default HomePage;
