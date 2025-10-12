import { useState, useEffect } from 'react';

/**
 * Hook personalizado para gestionar la configuración de la app
 * 
 * Piensa en esto como el "control remoto" de tu app de Pomodoro.
 * Guarda tus preferencias y las aplica automáticamente.
 */
const useSettings = () => {
  // Estado para la duración de sesión (en minutos)
  // Analogía: Es como elegir si quieres un café pequeño (25), mediano (35) o grande (45)
  const [sessionDuration, setSessionDuration] = useState(25);
  
  // Estado para el tema visual (background)
  // Analogía: Es como elegir si estudias con vista al bosque (autumn) o con lluvia (storm)
  const [backgroundTheme, setBackgroundTheme] = useState('autumn');
  
  // Estado para el sonido de notificación
  // Analogía: Es como elegir el tono de tu alarma del celular
  const [notificationSound, setNotificationSound] = useState('bell');
  
  // Estado de carga
  const [loading, setLoading] = useState(true);

  // PASO 1: Al cargar el hook, recuperar configuración guardada
  useEffect(() => {
    loadSettings();
  }, []);

  /**
   * Cargar configuración desde localStorage
   * 
   * Analogía: Es como cuando abres Netflix y recuerda qué estabas viendo.
   * Aquí "recordamos" tus preferencias guardadas anteriormente.
   */
  const loadSettings = () => {
    try {
      // Obtener duración (default: 25 min)
      const savedDuration = localStorage.getItem('sessionDuration');
      if (savedDuration) {
        setSessionDuration(parseInt(savedDuration));
      }

      // Obtener tema (default: autumn)
      const savedTheme = localStorage.getItem('backgroundTheme');
      if (savedTheme) {
        setBackgroundTheme(savedTheme);
      }

      // Obtener sonido (default: bell)
      const savedSound = localStorage.getItem('notificationSound');
      if (savedSound) {
        setNotificationSound(savedSound);
      }
    } catch (error) {
      console.error('Error cargando configuración:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Actualizar duración de sesión
   * 
   * @param {number} duration - Duración en minutos (25, 35, o 45)
   * 
   * Analogía: Es como ajustar el timer de tu microondas.
   * El cambio se guarda para la próxima vez que lo uses.
   */
  const updateSessionDuration = (duration) => {
    // Validar que sea un valor permitido
    if (![25, 35, 45].includes(duration)) {
      console.error('Duración no válida. Debe ser 25, 35 o 45 minutos.');
      return;
    }

    setSessionDuration(duration);
    localStorage.setItem('sessionDuration', duration.toString());
    
    console.log(`✅ Duración actualizada a ${duration} minutos`);
  };

  /**
   * Actualizar tema visual (background)
   * 
   * @param {string} theme - 'autumn' o 'storm'
   * 
   * Analogía: Es como cambiar el fondo de pantalla de tu escritorio.
   * El cambio es inmediato y se guarda para la próxima vez.
   */
  const updateBackgroundTheme = (theme) => {
    if (!['autumn', 'storm'].includes(theme)) {
      console.error('Tema no válido. Debe ser "autumn" o "storm".');
      return;
    }

    setBackgroundTheme(theme);
    localStorage.setItem('backgroundTheme', theme);
    
    console.log(`✅ Tema actualizado a ${theme}`);
  };

  /**
   * Actualizar sonido de notificación
   * 
   * @param {string} sound - Nombre del sonido
   * 
   * Analogía: Es como cambiar el ringtone de tu teléfono.
   */
  const updateNotificationSound = (sound) => {
    setNotificationSound(sound);
    localStorage.setItem('notificationSound', sound);
    
    console.log(`✅ Sonido actualizado a ${sound}`);
  };

  /**
   * Resetear todas las configuraciones a valores por defecto
   * 
   * Analogía: Es como hacer "factory reset" en tu control remoto.
   * Todo vuelve a como venía de fábrica.
   */
  const resetSettings = () => {
    setSessionDuration(25);
    setBackgroundTheme('autumn');
    setNotificationSound('bell');
    
    localStorage.removeItem('sessionDuration');
    localStorage.removeItem('backgroundTheme');
    localStorage.removeItem('notificationSound');
    
    console.log('✅ Configuración reseteada a valores por defecto');
  };

  // Retornar todo lo que el componente necesita usar
  return {
    // Estados actuales
    sessionDuration,
    backgroundTheme,
    notificationSound,
    loading,
    
    // Funciones para actualizar
    updateSessionDuration,
    updateBackgroundTheme,
    updateNotificationSound,
    resetSettings
  };
};

export default useSettings;

