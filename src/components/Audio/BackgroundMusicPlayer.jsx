import React, { useEffect, useRef } from 'react';
import { useSettings } from '../../context/SettingsContext';
import { getMusicById } from '../../config/audioConfig';

/**
 * Componente que reproduce música de fondo durante sesiones de estudio.
 * Solo se reproduce cuando:
 * - Es sesión de estudio (no break)
 * - Timer está corriendo
 * - Música está activada en configuración
 */
const BackgroundMusicPlayer = ({ 
  isStudySession,      // true = sesión de estudio, false = break o pausado
  isRunning            // true = timer corriendo
}) => {
  const { musicEnabled, musicType, musicVolume } = useSettings();
  const audioRef = useRef(null);

  useEffect(() => {
    // Solo reproducir si:
    // 1. Es sesión de estudio (no break)
    // 2. Timer está corriendo
    // 3. Música está activada
    if (isStudySession && isRunning && musicEnabled && audioRef.current) {
      const music = getMusicById(musicType);
      
      // Si el archivo cambió, actualizar src
      if (audioRef.current.src !== music.file) {
        audioRef.current.src = music.file;
      }
      
      // Configurar volumen y loop
      audioRef.current.volume = musicVolume;
      audioRef.current.loop = true;
      
      // Reproducir
      audioRef.current.play()
        .then(() => {
          console.log('🎵 Música de fondo iniciada:', music.name);
        })
        .catch(error => {
          console.error('Error al reproducir música:', error);
        });
    } else {
      // Pausar si no cumple condiciones
      if (audioRef.current && !audioRef.current.paused) {
        audioRef.current.pause();
        console.log('🎵 Música de fondo pausada');
      }
    }
  }, [isStudySession, isRunning, musicEnabled, musicType, musicVolume]);

  // Actualizar volumen cuando cambie
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = musicVolume;
    }
  }, [musicVolume]);

  // Actualizar tipo de música cuando cambie (solo si está reproduciendo)
  useEffect(() => {
    if (audioRef.current && !audioRef.current.paused && musicEnabled) {
      const music = getMusicById(musicType);
      if (audioRef.current.src !== music.file) {
        audioRef.current.pause();
        audioRef.current.src = music.file;
        audioRef.current.volume = musicVolume;
        audioRef.current.loop = true;
        audioRef.current.play()
          .then(() => {
            console.log('🎵 Música cambiada a:', music.name);
          })
          .catch(error => {
            console.error('Error al cambiar música:', error);
          });
      }
    }
  }, [musicType, musicEnabled, musicVolume]);

  return (
    <audio
      ref={audioRef}
      style={{ display: 'none' }}
    />
  );
};

export default BackgroundMusicPlayer;

