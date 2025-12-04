import React, { useState, useRef, useEffect } from 'react';
import { useSettings } from '../../../context/SettingsContext';
import { MUSIC_OPTIONS } from '../../../config/audioConfig';

const MusicConfig = () => {
  const { 
    musicEnabled, 
    musicType, 
    musicVolume,
    updateMusicSettings
  } = useSettings();
  
  const [playingPreview, setPlayingPreview] = useState(null);
  const previewAudioRef = useRef(null);

  // Limpiar preview al desmontar o cambiar música
  useEffect(() => {
    return () => {
      if (previewAudioRef.current) {
        previewAudioRef.current.pause();
        previewAudioRef.current = null;
      }
    };
  }, []);

  // Función para toggle de música
  const handleToggleMusic = (enabled) => {
    updateMusicSettings(enabled, musicType, musicVolume);
  };

  // Función para cambiar tipo de música
  const handleMusicTypeChange = (newType) => {
    // Detener preview si está sonando
    if (previewAudioRef.current) {
      previewAudioRef.current.pause();
      previewAudioRef.current.currentTime = 0;
      setPlayingPreview(null);
    }
    updateMusicSettings(musicEnabled, newType, musicVolume);
  };

  // Función para preview
  const handlePreviewMusic = (musicId) => {
    // Si ya está reproduciendo este mismo, pausarlo
    if (playingPreview === musicId && previewAudioRef.current) {
      previewAudioRef.current.pause();
      previewAudioRef.current.currentTime = 0;
      setPlayingPreview(null);
      return;
    }

    // Detener preview anterior
    if (previewAudioRef.current) {
      previewAudioRef.current.pause();
      previewAudioRef.current.currentTime = 0;
    }

    // Encontrar la música seleccionada
    const music = MUSIC_OPTIONS.find(m => m.id === musicId);
    if (!music) return;

    // Crear nuevo audio para preview
    const audio = new Audio(music.file);
    audio.volume = musicVolume;
    
    // Event listeners
    audio.addEventListener('ended', () => {
      setPlayingPreview(null);
      previewAudioRef.current = null;
    });

    // Reproducir
    audio.play()
      .then(() => {
        previewAudioRef.current = audio;
        setPlayingPreview(musicId);
      })
      .catch(error => {
        console.error('Error al reproducir preview:', error);
        setPlayingPreview(null);
        previewAudioRef.current = null;
      });

    // Detener automáticamente después de 10 segundos
    setTimeout(() => {
      if (previewAudioRef.current && previewAudioRef.current === audio) {
        audio.pause();
        audio.currentTime = 0;
        setPlayingPreview(null);
        previewAudioRef.current = null;
      }
    }, 10000);
  };

  // Función para cambiar volumen
  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    updateMusicSettings(musicEnabled, musicType, newVolume);
    
    // Actualizar volumen del preview si está sonando
    if (previewAudioRef.current) {
      previewAudioRef.current.volume = newVolume;
    }
  };

  return (
    <div style={{ marginBottom: '32px' }}>
      {/* Título */}
      <h3 style={{
        fontSize: '18px',
        fontWeight: '600',
        color: '#374151',
        marginBottom: '16px'
      }}>
        Música de Fondo
      </h3>

      {/* Toggle activar/desactivar */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '12px',
          cursor: 'pointer'
        }}>
          <input
            type="checkbox"
            checked={musicEnabled}
            onChange={(e) => handleToggleMusic(e.target.checked)}
            style={{ 
              width: '18px', 
              height: '18px',
              cursor: 'pointer'
            }}
          />
          <span style={{ 
            fontSize: '14px', 
            color: '#374151',
            userSelect: 'none'
          }}>
            Activar música ambiental durante sesiones de estudio
          </span>
        </label>
        
        {/* Nota sobre alarma automática */}
        <p style={{
          fontSize: '12px',
          color: '#6b7280',
          marginTop: '8px',
          marginBottom: 0,
          fontStyle: 'italic'
        }}>
          ℹ️ La alarma sonará automáticamente al inicio y fin de cada sesión de estudio
        </p>
      </div>

      {/* Selector de tipo (solo si está activado) */}
      {musicEnabled && (
        <>
          <div style={{ marginBottom: '20px' }}>
            <h4 style={{
              fontSize: '16px',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '12px'
            }}>
              Tipo de Ambiente
            </h4>

            <div 
              className="music-buttons"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                gap: '12px'
              }}
            >
              {MUSIC_OPTIONS.map(music => (
                <div key={music.id} style={{ display: 'flex', flexDirection: 'column' }}>
                  <button
                    onClick={() => handleMusicTypeChange(music.id)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: `2px solid ${musicType === music.id ? '#10b981' : '#e5e7eb'}`,
                      borderRadius: '12px',
                      backgroundColor: musicType === music.id ? '#d1fae5' : 'white',
                      color: musicType === music.id ? '#10b981' : '#374151',
                      cursor: 'pointer',
                      fontSize: '13px',
                      fontWeight: '500',
                      transition: 'all 0.2s',
                      marginBottom: '6px'
                    }}
                  >
                    {music.name}
                  </button>

                  {/* Botón preview */}
                  <button
                    onClick={() => handlePreviewMusic(music.id)}
                    style={{
                      width: '100%',
                      padding: '6px 8px',
                      fontSize: '11px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      backgroundColor: playingPreview === music.id ? '#fef3c7' : 'white',
                      color: '#374151',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    {playingPreview === music.id ? '⏸️ Pausar' : '▶️ Preview'}
                  </button>
                </div>
              ))}
            </div>

            {/* CSS Responsivo */}
            <style>{`
              @media (max-width: 768px) {
                .music-buttons {
                  grid-template-columns: 1fr !important;
                }
              }
            `}</style>
          </div>

          {/* Control de volumen */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '8px'
            }}>
              Volumen: {Math.round(musicVolume * 100)}%
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={musicVolume}
              onChange={handleVolumeChange}
              style={{
                width: '100%',
                height: '6px',
                borderRadius: '3px',
                outline: 'none',
                backgroundColor: '#e5e7eb',
                cursor: 'pointer'
              }}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default MusicConfig;
