import React, { createContext, useContext, useState, useEffect } from 'react';

// Configuraciones predefinidas
const DEFAULT_SETTINGS = {
  backgroundTheme: 'autumn',
  sessionDuration: 25,
  soundEnabled: true,
  soundType: 'bell',
  // Configuración de música de fondo
  musicEnabled: false,        // Por defecto desactivada
  musicType: 'piano-romantic', // Tipo de música por defecto
  musicVolume: 0.5            // Volumen por defecto (50%)
};

// Crear el contexto
const SettingsContext = createContext();

// Provider del contexto
export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);

  // Cargar configuraciones guardadas al montar el componente
  useEffect(() => {
    const savedSettings = localStorage.getItem('pomodoroSettings');
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        setSettings(prev => ({ ...prev, ...parsedSettings }));
      } catch (error) {
        console.error('Error al cargar configuraciones:', error);
      }
    }
  }, []);

  // Guardar configuraciones en localStorage cuando cambien
  useEffect(() => {
    localStorage.setItem('pomodoroSettings', JSON.stringify(settings));
  }, [settings]);

  // Función para actualizar el tema de fondo
  const updateBackgroundTheme = (theme) => {
    console.log('🔄 Cambiando fondo a:', theme);
    setSettings(prev => ({
      ...prev,
      backgroundTheme: theme
    }));
  };

  // Función para actualizar la duración de sesión
  const updateSessionDuration = (duration) => {
    console.log('🔄 Cambiando duración a:', duration);
    setSettings(prev => ({
      ...prev,
      sessionDuration: duration
    }));
  };

  // Función para actualizar configuración de sonido
  const updateSoundSettings = (soundEnabled, soundType = 'bell') => {
    setSettings(prev => ({
      ...prev,
      soundEnabled,
      soundType
    }));
  };

  // Función para actualizar configuración de música de fondo
  const updateMusicSettings = (musicEnabled, musicType = 'piano-romantic', musicVolume = 0.5) => {
    console.log('🔄 Actualizando música:', { musicEnabled, musicType, musicVolume });
    setSettings(prev => ({
      ...prev,
      musicEnabled,
      musicType,
      musicVolume
    }));
  };

  // Función para resetear configuraciones
  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
    localStorage.removeItem('pomodoroSettings');
  };

  const value = {
    // Estado
    backgroundTheme: settings.backgroundTheme,
    sessionDuration: settings.sessionDuration,
    soundEnabled: settings.soundEnabled,
    soundType: settings.soundType,
    musicEnabled: settings.musicEnabled,
    musicType: settings.musicType,
    musicVolume: settings.musicVolume,
    
    // Funciones
    updateBackgroundTheme,
    updateSessionDuration,
    updateSoundSettings,
    updateMusicSettings,
    resetSettings
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings debe ser usado dentro de SettingsProvider');
  }
  return context;
};

export default SettingsContext;
