// Configuración de archivos de música de fondo

// Importar los archivos de audio
import pianoRomantic from '../assets/sounds/background/piano-romantic.mp3'
import pianoRain from '../assets/sounds/background/piano-rain.mp3'
import rainAmbience from '../assets/sounds/background/rain-ambience.mp3'
import forestBirds from '../assets/sounds/background/forest-birds.mp3'
import summerMemories from '../assets/sounds/background/summer-memories.wav'

// Configuración de música disponible
export const BACKGROUND_MUSIC = {
  'piano-romantic': {
    id: 'piano-romantic',
    name: 'Piano Romántico',
    file: pianoRomantic
  },
  'piano-rain': {
    id: 'piano-rain',
    name: 'Piano + Lluvia',
    file: pianoRain
  },
  'rain-ambience': {
    id: 'rain-ambience',
    name: 'Ambiente de Lluvia',
    file: rainAmbience
  },
  'forest-birds': {
    id: 'forest-birds',
    name: 'Bosque con Pájaros',
    file: forestBirds
  },
  'summer-memories': {
    id: 'summer-memories',
    name: 'Recuerdos de Verano',
    file: summerMemories
  }
}

// Obtener todas las opciones de música como array (útil para iterar)
export const MUSIC_OPTIONS = Object.values(BACKGROUND_MUSIC)

// Obtener música por ID
export const getMusicById = (id) => {
  return BACKGROUND_MUSIC[id] || BACKGROUND_MUSIC['piano-romantic']
}

// ID por defecto
export const DEFAULT_MUSIC_ID = 'piano-romantic'

