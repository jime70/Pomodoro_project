import React, { useState } from 'react'

const TimerSettings = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedPreset, setSelectedPreset] = useState('classic')

  // Datos temporales
  const presets = {
    classic: { name: 'Clásico', workTime: 25, breakTime: 5 },
    long: { name: 'Largo', workTime: 45, breakTime: 10 },
    medium: { name: 'Medio', workTime: 35, breakTime: 5 }
  }

  const handlePresetChange = (presetKey) => {
    setSelectedPreset(presetKey)
    console.log('Preset seleccionado:', presetKey)
    setIsOpen(false)
  }

  return (
    <div className="relative" style={{ position: 'relative' }}>
      {/* Botón del dropdown */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg hover:bg-white/30 transition-colors duration-200 flex items-center gap-2"
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          color: 'white',
          padding: '8px 16px',
          borderRadius: '8px',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}
      >
        <span>{presets[selectedPreset].label}</span>
        <svg 
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
          style={{ width: '16px', height: '16px', transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-full bg-white/90 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden z-50">
          {Object.entries(presets).map(([key, preset]) => (
            <button
              key={key}
              onClick={() => handlePresetChange(key)}
              className={`w-full text-left px-4 py-3 hover:bg-white/50 transition-colors duration-200 ${
                selectedPreset === key ? 'bg-blue-100 text-blue-800' : 'text-gray-800'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      )}

      {/* Overlay para cerrar el dropdown */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}

export default TimerSettings
