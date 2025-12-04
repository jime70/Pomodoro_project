import React, { useEffect, useRef } from 'react';
import alarmSound from '../../assets/sounds/alerts/session-alarm.mp3';

/**
 * Componente que reproduce la alarma cuando ocurren transiciones importantes:
 * - Inicio de sesión de estudio
 * - Fin de sesión de estudio
 * - Fin de break (inicio de nueva sesión)
 */
const AlarmPlayer = ({ 
  shouldPlay,  // true cuando debe reproducirse la alarma
  onPlayComplete // callback opcional cuando termina de reproducir
}) => {
  const audioRef = useRef(null);
  const hasPlayedRef = useRef(false);
  const prevShouldPlayRef = useRef(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Configurar evento ended una sola vez
    const handleEnded = () => {
      console.log('🔔 Alarma terminó de reproducir');
      hasPlayedRef.current = false;
      if (onPlayComplete) {
        onPlayComplete();
      }
    };

    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('ended', handleEnded);
    };
  }, [onPlayComplete]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Si shouldPlay cambia de false a true, resetear hasPlayedRef para permitir nueva reproducción
    if (shouldPlay && !prevShouldPlayRef.current) {
      hasPlayedRef.current = false;
    }
    
    prevShouldPlayRef.current = shouldPlay;

    // Si shouldPlay cambia a false, resetear todo
    if (!shouldPlay) {
      if (!audio.paused) {
        audio.pause();
      }
      audio.currentTime = 0;
      hasPlayedRef.current = false;
      return;
    }

    // Si shouldPlay es true y no se ha reproducido, reproducir
    if (shouldPlay && !hasPlayedRef.current) {
      hasPlayedRef.current = true;
      audio.currentTime = 0;
      audio.loop = false;
      
      const playPromise = audio.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log('🔔 Alarma empezó a reproducirse');
          })
          .catch(error => {
            console.error('Error al reproducir alarma:', error);
            hasPlayedRef.current = false;
            // Si hay error, llamar al callback después de un delay
            if (onPlayComplete) {
              setTimeout(() => {
                onPlayComplete();
              }, 100);
            }
          });
      }
    }
  }, [shouldPlay, onPlayComplete]);

  return (
    <audio
      ref={audioRef}
      src={alarmSound}
      preload="auto"
      style={{ display: 'none' }}
    />
  );
};

export default AlarmPlayer;

