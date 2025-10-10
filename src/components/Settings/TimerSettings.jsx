import React, { useState } from 'react';
import useSettings from '../../hooks/useSettings';
import autumnGif from '../../assets/images/autumn.gif';
import stormGif from '../../assets/images/storm.gif';

/**
 * Componente de Configuración del Timer
 * 
 * Analogía: Es como el menú de configuración de tu teléfono.
 * Tiene secciones para diferentes tipos de ajustes.
 */
const TimerSettings = ({ isOpen, onClose }) => {
  const {
    sessionDuration,
    backgroundTheme,
    notificationSound,
    updateSessionDuration,
    updateBackgroundTheme,
    updateNotificationSound
  } = useSettings();

  // Estado local para vista previa de sonidos
  const [playingSound, setPlayingSound] = useState(null);

  /**
   * Lista de sonidos disponibles
   * En una app real, estos serían archivos de audio reales.
   * Analogía: Como los tonos de alarma en tu celular.
   */
  const soundOptions = [
    { id: 'bell', name: '🔔 Campana', description: 'Clásico y suave' },
    { id: 'chime', name: '🎵 Carillón', description: 'Melodioso' },
    { id: 'alert', name: '⏰ Alerta', description: 'Más fuerte' },
    { id: 'none', name: '🔇 Silencio', description: 'Sin sonido' }
  ];

  /**
   * Manejar cambio de duración
   * Analogía: Como ajustar el temporizador del horno (25, 35 o 45 minutos)
   */
  const handleDurationChange = (duration) => {
    updateSessionDuration(duration);
  };

  /**
   * Manejar cambio de tema
   * Analogía: Como cambiar el wallpaper de tu escritorio
   */
  const handleThemeChange = (theme) => {
    updateBackgroundTheme(theme);
    // En HomePage, esto cambiará el background automáticamente
  };

  /**
   * Previsualizar sonido
   * Analogía: Como el botón "probar sonido" en la configuración de alarmas
   */
  const handlePreviewSound = (soundId) => {
    setPlayingSound(soundId);
    console.log(`🔊 Reproduciendo: ${soundId}`);
    
    // Simular que termina después de 1 segundo
    setTimeout(() => {
      setPlayingSound(null);
    }, 1000);
    
    // TODO: Aquí irá la lógica real para reproducir audio
    // const audio = new Audio(`/sounds/${soundId}.mp3`);
    // audio.play();
  };

  /**
   * Seleccionar sonido
   */
  const handleSelectSound = (soundId) => {
    updateNotificationSound(soundId);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay oscuro (como cuando abres un modal en apps) */}
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '20px'
        }}
        onClick={onClose}
      >
        {/* Panel de configuración */}
        <div 
          onClick={(e) => e.stopPropagation()} // Evitar cerrar al hacer clic dentro
          style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '32px',
            maxWidth: '600px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
          }}
        >
          {/* Header */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '24px'
          }}>
            <h2 style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#1f2937',
              margin: 0
            }}>
              ⚙️ Configuración
            </h2>
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '28px',
                cursor: 'pointer',
                color: '#6b7280',
                lineHeight: 1
              }}
            >
              ×
            </button>
          </div>

          {/* SECCIÓN 1: Duración de Sesión */}
          <div style={{ marginBottom: '32px' }}>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '16px'
            }}>
              ⏱️ Duración de Sesión
            </h3>
            <p style={{
              fontSize: '14px',
              color: '#6b7280',
              marginBottom: '16px'
            }}>
              Elige cuánto tiempo durarán tus sesiones de estudio.
              Piensa en esto como elegir el tamaño de tu café ☕
            </p>
            
            {/* Opciones de duración */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              {[
                { value: 25, label: '25 min', desc: 'Corto', emoji: '☕' },
                { value: 35, label: '35 min', desc: 'Medio', emoji: '🥤' },
                { value: 45, label: '45 min', desc: 'Largo', emoji: '🍺' }
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleDurationChange(option.value)}
                  style={{
                    flex: 1,
                    minWidth: '120px',
                    padding: '16px',
                    border: `2px solid ${sessionDuration === option.value ? '#3b82f6' : '#e5e7eb'}`,
                    backgroundColor: sessionDuration === option.value ? '#eff6ff' : 'white',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{ fontSize: '24px', marginBottom: '8px' }}>
                    {option.emoji}
                  </div>
                  <div style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: sessionDuration === option.value ? '#3b82f6' : '#1f2937',
                    marginBottom: '4px'
                  }}>
                    {option.label}
                  </div>
                  <div style={{
                    fontSize: '12px',
                    color: '#6b7280'
                  }}>
                    {option.desc}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* SECCIÓN 2: Tema Visual (Background) */}
          <div style={{ marginBottom: '32px' }}>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '16px'
            }}>
              🎨 Tema Visual
            </h3>
            <p style={{
              fontSize: '14px',
              color: '#6b7280',
              marginBottom: '16px'
            }}>
              Cambia el ambiente de tu espacio de estudio.
              Como elegir si estudias en el parque 🍂 o bajo la lluvia 🌧️
            </p>
            
            {/* Opciones de tema */}
            <div style={{ display: 'flex', gap: '16px' }}>
              {[
                { id: 'autumn', name: 'Otoño', img: autumnGif, emoji: '🍂' },
                { id: 'storm', name: 'Tormenta', img: stormGif, emoji: '⛈️' }
              ].map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => handleThemeChange(theme.id)}
                  style={{
                    flex: 1,
                    border: `3px solid ${backgroundTheme === theme.id ? '#10b981' : '#e5e7eb'}`,
                    borderRadius: '12px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    position: 'relative',
                    padding: 0,
                    background: 'white'
                  }}
                >
                  {/* Thumbnail del gif */}
                  <div style={{
                    width: '100%',
                    height: '120px',
                    backgroundImage: `url(${theme.img})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }} />
                  
                  {/* Etiqueta */}
                  <div style={{
                    padding: '12px',
                    backgroundColor: backgroundTheme === theme.id ? '#d1fae5' : '#f9fafb',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}>
                    <span style={{ fontSize: '20px' }}>{theme.emoji}</span>
                    <span style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      color: backgroundTheme === theme.id ? '#10b981' : '#374151'
                    }}>
                      {theme.name}
                    </span>
                  </div>
                  
                  {/* Check mark si está seleccionado */}
                  {backgroundTheme === theme.id && (
                    <div style={{
                      position: 'absolute',
                      top: '8px',
                      right: '8px',
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      backgroundColor: '#10b981',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '16px',
                      fontWeight: 'bold'
                    }}>
                      ✓
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* SECCIÓN 3: Sonido de Notificación */}
          <div>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '16px'
            }}>
              🔊 Sonido de Notificación
            </h3>
            <p style={{
              fontSize: '14px',
              color: '#6b7280',
              marginBottom: '16px'
            }}>
              Elige el sonido que te avisará al terminar una sesión.
              Como el ringtone de tu despertador 📱
            </p>
            
            {/* Lista de sonidos */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {soundOptions.map((sound) => (
                <div
                  key={sound.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px',
                    border: `2px solid ${notificationSound === sound.id ? '#8b5cf6' : '#e5e7eb'}`,
                    backgroundColor: notificationSound === sound.id ? '#f5f3ff' : 'white',
                    borderRadius: '8px',
                    cursor: 'pointer'
                  }}
                  onClick={() => handleSelectSound(sound.id)}
                >
                  {/* Radio button visual */}
                  <div style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    border: `2px solid ${notificationSound === sound.id ? '#8b5cf6' : '#d1d5db'}`,
                    backgroundColor: notificationSound === sound.id ? '#8b5cf6' : 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    {notificationSound === sound.id && (
                      <div style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: 'white'
                      }} />
                    )}
                  </div>

                  {/* Información del sonido */}
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#1f2937'
                    }}>
                      {sound.name}
                    </div>
                    <div style={{
                      fontSize: '12px',
                      color: '#6b7280'
                    }}>
                      {sound.description}
                    </div>
                  </div>

                  {/* Botón de preview */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePreviewSound(sound.id);
                    }}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: playingSound === sound.id ? '#10b981' : '#f3f4f6',
                      color: playingSound === sound.id ? 'white' : '#374151',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: '500',
                      cursor: 'pointer'
                    }}
                  >
                    {playingSound === sound.id ? '▶️ ...' : '▶️ Probar'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Botón Guardar/Cerrar */}
          <div style={{ marginTop: '32px', textAlign: 'right' }}>
            <button
              onClick={onClose}
              style={{
                padding: '12px 32px',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              ✓ Guardar Cambios
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default TimerSettings;
