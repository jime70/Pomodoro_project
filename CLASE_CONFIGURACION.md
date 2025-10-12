# 🎓 Clase Completa: Sistema de Configuración del Pomodoro Timer

## 📚 Índice de la Clase

1. [Introducción: ¿Qué Construimos?](#introducción)
2. [Lección 1: El Hook useSettings (El Cerebro)](#lección-1)
3. [Lección 2: El Componente TimerSettings (La Interfaz)](#lección-2)
4. [Lección 3: Integración con HomePage](#lección-3)
5. [Lección 4: Conexión con el Timer](#lección-4)
6. [Examen Práctico: Cómo Usar el Sistema](#examen-práctico)
7. [Conceptos Clave Aprendidos](#conceptos-clave)

---

## 🎯 Introducción: ¿Qué Construimos?

Imagina que tienes un **microondas**. El modelo básico tiene solo un botón: "2 minutos". Siempre cocina por 2 minutos, sin opción de cambiar.

Ahora imagina un **microondas inteligente**: puedes elegir 2, 3 o 5 minutos. Recuerda tu preferencia. Puedes cambiar el color de la pantalla. Y puedes elegir el sonido de la alarma.

**Eso es exactamente lo que construimos** para tu app de Pomodoro:
- ✅ Elegir duración (25, 35 o 45 minutos)
- ✅ Cambiar el fondo (Otoño 🍂 o Tormenta ⛈️)
- ✅ Seleccionar sonido de notificación
- ✅ **Recordar tus preferencias** para la próxima vez

---

## 🎓 Lección 1: El Hook useSettings (El Cerebro)

### ¿Qué es un Hook Personalizado?

**Analogía:** Es como crear tu propio **control remoto universal**.

Piensa en tu casa: tienes un control remoto para la TV, otro para el aire acondicionado, otro para el ventilador. ¡Son muchos controles!

Un hook personalizado es como crear **UN SOLO control remoto** que maneje todo. Presionas un botón y controla lo que necesites.

### ¿Qué hace `useSettings`?

```javascript
const useSettings = () => {
  // 1. ESTADO: Guarda las preferencias actuales
  const [sessionDuration, setSessionDuration] = useState(25);
  const [backgroundTheme, setBackgroundTheme] = useState('autumn');
  const [notificationSound, setNotificationSound] = useState('bell');
  
  // 2. CARGAR: Lee las preferencias guardadas (como abrir Netflix y ver tu historial)
  useEffect(() => {
    loadSettings(); // Lee de localStorage
  }, []);
  
  // 3. ACTUALIZAR: Cambia y guarda las preferencias
  const updateSessionDuration = (duration) => {
    setSessionDuration(duration);
    localStorage.setItem('sessionDuration', duration);
  };
  
  // 4. RETORNAR: Da acceso a todo
  return {
    sessionDuration,
    backgroundTheme,
    notificationSound,
    updateSessionDuration,
    updateBackgroundTheme,
    updateNotificationSound
  };
};
```

### Conceptos Importantes:

#### A) **localStorage** - La Memoria de Tu Navegador

**Analogía:** Es como los Post-its en tu nevera.

Cuando apagas tu computadora, el navegador "olvida" muchas cosas. Pero localStorage es como escribir en un Post-it y pegarlo en la nevera: **la próxima vez que abras la nevera (navegador), el Post-it sigue ahí**.

```javascript
// GUARDAR (escribir en el Post-it)
localStorage.setItem('sessionDuration', '45');

// LEER (leer el Post-it)
const duration = localStorage.getItem('sessionDuration'); // "45"

// BORRAR (quitar el Post-it)
localStorage.removeItem('sessionDuration');
```

#### B) **useEffect** - El Guardia Automático

**Analogía:** Es como un sensor de movimiento que enciende las luces automáticamente.

```javascript
useEffect(() => {
  loadSettings(); // Esto se ejecuta AUTOMÁTICAMENTE al cargar el componente
}, []); // Los [] significan: "hazlo solo una vez, al inicio"
```

Es como decir: _"Cuando entres a la casa (componente), enciende las luces (carga settings) automáticamente"._

#### C) **useState** - La Caja de Cambios

**Analogía:** Es como una caja con dos cosas:
1. El contenido actual (la carta adentro)
2. Un método para cambiar el contenido (abrir la caja y poner otra carta)

```javascript
const [sessionDuration, setSessionDuration] = useState(25);
//     ↑ lo que hay ahora    ↑ función para cambiarlo     ↑ valor inicial

// Leer el valor actual
console.log(sessionDuration); // 25

// Cambiar el valor
setSessionDuration(45);
console.log(sessionDuration); // 45 (actualizado)
```

---

## 🎓 Lección 2: El Componente TimerSettings (La Interfaz)

### ¿Qué es un Componente con Modal?

**Analogía:** Es como el panel de control de tu aire acondicionado en tu celular.

Imagina una app de control remoto:
- Presionas el botón ⚙️ → Se abre una pantalla sobre tu app actual
- Ves las opciones: temperatura, modo, velocidad
- Cambias lo que quieres
- Presionas "Guardar" → La pantalla desaparece

**Eso es exactamente un modal:** una ventana que aparece SOBRE tu contenido actual.

### Estructura del Componente

```javascript
const TimerSettings = ({ isOpen, onClose }) => {
  // 1. Obtener configuración actual
  const { sessionDuration, backgroundTheme, updateSessionDuration } = useSettings();
  
  // 2. Si no está abierto, no mostrar nada
  if (!isOpen) return null;
  
  // 3. Mostrar el modal
  return (
    <div className="overlay">  {/* Fondo oscuro */}
      <div className="panel">   {/* Panel blanco */}
        {/* Sección 1: Duración */}
        {/* Sección 2: Tema */}
        {/* Sección 3: Sonido */}
      </div>
    </div>
  );
};
```

### Las 3 Secciones Explicadas

#### **Sección 1: Duración de Sesión** ⏱️

**Analogía:** Como elegir el tamaño de tu café en Starbucks.

```
☕ Corto (25 min)  |  🥤 Mediano (35 min)  |  🍺 Grande (45 min)
```

**¿Cómo funciona?**

1. Usuario hace clic en "35 min"
2. Llama a `updateSessionDuration(35)`
3. El hook guarda "35" en localStorage
4. El timer se actualiza automáticamente a 35 minutos

**Código simplificado:**

```javascript
<button onClick={() => updateSessionDuration(35)}>
  35 minutos
</button>
```

#### **Sección 2: Tema Visual** 🎨

**Analogía:** Como cambiar el fondo de pantalla de tu escritorio.

Tienes dos opciones:
- 🍂 Otoño (autumn.gif)
- ⛈️ Tormenta (storm.gif)

**¿Cómo funciona?**

1. Usuario hace clic en "Tormenta"
2. Llama a `updateBackgroundTheme('storm')`
3. El hook guarda 'storm' en localStorage
4. HomePage detecta el cambio y actualiza el background

**Código simplificado:**

```javascript
// Mostrar preview del tema
<div style={{ backgroundImage: `url(${stormGif})` }} />

// Al hacer clic
<button onClick={() => updateBackgroundTheme('storm')}>
  Seleccionar
</button>
```

#### **Sección 3: Sonido de Notificación** 🔊

**Analogía:** Como elegir el ringtone de tu celular.

**¿Cómo funciona?**

1. Usuario hace clic en "▶️ Probar" → Reproduce el sonido
2. Usuario hace clic en la opción → Selecciona ese sonido
3. Se guarda en localStorage

**Código simplificado:**

```javascript
const handlePreviewSound = (soundId) => {
  console.log('Reproduciendo:', soundId);
  // TODO: Reproducir audio real
  // const audio = new Audio(`/sounds/${soundId}.mp3`);
  // audio.play();
};

<button onClick={() => handlePreviewSound('bell')}>
  ▶️ Probar
</button>
```

---

## 🎓 Lección 3: Integración con HomePage

### El Botón Flotante ⚙️

**Analogía:** Como el botón de "Configuración" en WhatsApp (abajo a la derecha).

```javascript
<button
  onClick={() => setShowSettings(true)}
  style={{
    position: 'fixed',
    bottom: '32px',
    right: '32px',
    // ... estilos de botón flotante
  }}
>
  ⚙️
</button>
```

**¿Qué hace?**
- Cambia `showSettings` de `false` a `true`
- Esto causa que `<TimerSettings isOpen={showSettings} />` se muestre

### Cambio Dinámico del Background

**Analogía:** Como cuando cambias el modo día/noche en tu teléfono.

```javascript
const { backgroundTheme } = useSettings(); // Lee la preferencia

// Elegir imagen según configuración
const backgroundImage = backgroundTheme === 'storm' ? stormGif : autumnGif;

// Aplicar al div
<div style={{ backgroundImage: `url(${backgroundImage})` }}>
```

**Flujo completo:**

1. HomePage lee `backgroundTheme` → "autumn"
2. Asigna `backgroundImage = autumnGif`
3. Renderiza con fondo de otoño 🍂
4. Usuario abre settings y cambia a "storm" ⛈️
5. `useSettings` detecta el cambio
6. HomePage se re-renderiza automáticamente
7. Ahora `backgroundImage = stormGif`
8. ¡El fondo cambió con transición suave!

---

## 🎓 Lección 4: Conexión con el Timer

### El Problema que Resolvimos

**Antes:** El timer siempre usaba 25 minutos (hardcoded)

```javascript
const STUDY_TIME = 25 * 60; // ❌ Siempre 25 minutos, no se puede cambiar
```

**Después:** El timer lee la configuración del usuario

```javascript
const { sessionDuration } = useSettings(); // Lee: 25, 35 o 45
const STUDY_TIME = sessionDuration * 60;   // ✅ Usa lo que el usuario eligió
```

### Sincronización Automática

**Analogía:** Como cuando ajustas la temperatura del aire y el aparato cambia automáticamente.

```javascript
useEffect(() => {
  if (!isRunning) {
    setTimeLeft(STUDY_TIME); // Actualiza el tiempo cuando cambia la config
  }
}, [sessionDuration, STUDY_TIME, isRunning]);
```

**Flujo:**

1. Timer muestra 25:00 (config por defecto)
2. Usuario abre settings y elige "45 min"
3. useSettings actualiza `sessionDuration = 45`
4. Timer detecta el cambio (gracias a useEffect)
5. Timer actualiza `STUDY_TIME = 45 * 60 = 2700 segundos`
6. Timer actualiza `timeLeft = 2700`
7. ¡Ahora muestra 45:00!

---

## 📝 Examen Práctico: Cómo Usar el Sistema

### Paso 1: Iniciar Servidores

```bash
# Terminal 1 - Backend
cd d:\pomodoro-project\pomodoro-backend
npm run server

# Terminal 2 - Frontend
cd c:\Users\Hp\Downloads\pomodoro-timer-main\pomodoro-frontend
npm run dev
```

### Paso 2: Abrir la App

```
http://localhost:5173/
```

### Paso 3: Hacer Login

1. Clic en "Registrarse" o "Login"
2. Ingresar credenciales
3. Verás tu nombre arriba a la derecha

### Paso 4: Probar la Configuración

#### A) Cambiar Duración:

1. Clic en el botón flotante ⚙️ (abajo derecha)
2. En "⏱️ Duración de Sesión", clic en "45 min"
3. Clic en "✓ Guardar Cambios"
4. **Observa:** El timer ahora muestra "45 minutos"
5. Si recargas la página (F5), sigue en 45 minutos (¡se guardó!)

#### B) Cambiar Tema:

1. Abrir configuración ⚙️
2. En "🎨 Tema Visual", clic en "Tormenta ⛈️"
3. Guardar
4. **Observa:** El fondo cambió a la animación de tormenta
5. Si recargas, sigue con tormenta (¡se guardó!)

#### C) Cambiar Sonido:

1. Abrir configuración ⚙️
2. En "🔊 Sonido de Notificación", clic en "▶️ Probar" en cada opción
3. Seleccionar tu favorito
4. Guardar
5. (Por ahora solo se guarda, el audio real está pendiente de implementar)

### Paso 5: Usar el Timer

1. Con la duración configurada (ej: 45 min)
2. Clic en "Iniciar"
3. El timer empieza desde 45:00
4. ¡Funciona con tu configuración!

---

## 💡 Conceptos Clave Aprendidos

### 1. **Custom Hooks** (Hooks Personalizados)

```javascript
const useSettings = () => {
  // Lógica reutilizable
  return { valores, funciones };
};
```

**Beneficio:** Separar la lógica de la UI. Como tener el motor (lógica) separado del tablero (UI).

### 2. **localStorage** (Persistencia de Datos)

```javascript
localStorage.setItem('key', 'value');  // Guardar
const value = localStorage.getItem('key'); // Leer
```

**Beneficio:** Los datos sobreviven al cerrar el navegador.

### 3. **Props y Estado**

```javascript
// HomePage pasa props a TimerSettings
<TimerSettings isOpen={showSettings} onClose={() => setShowSettings(false)} />

// TimerSettings recibe y usa los props
const TimerSettings = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  // ...
};
```

**Beneficio:** Comunicación entre componentes padre-hijo.

### 4. **Modales** (Ventanas Emergentes)

Estructura típica:

```javascript
{isOpen && (
  <div className="overlay" onClick={onClose}>
    <div className="modal" onClick={(e) => e.stopPropagation()}>
      {/* Contenido */}
    </div>
  </div>
)}
```

**Truco:** `stopPropagation()` evita que al hacer clic dentro del modal, se cierre.

### 5. **Sincronización Reactiva**

```javascript
useEffect(() => {
  // Se ejecuta cuando 'sessionDuration' cambia
  setTimeLeft(STUDY_TIME);
}, [sessionDuration]);
```

**Beneficio:** Los componentes se actualizan automáticamente cuando cambian los datos.

---

## 🎯 Diagrama de Flujo Completo

```
USUARIO
  │
  ├─> Abre Configuración (clic en ⚙️)
  │     │
  │     └─> HomePage cambia showSettings = true
  │           │
  │           └─> TimerSettings se renderiza
  │                 │
  │                 ├─> useSettings lee preferencias actuales
  │                 │     (desde localStorage)
  │                 │
  │                 └─> Usuario selecciona "45 min"
  │                       │
  │                       └─> updateSessionDuration(45)
  │                             │
  │                             ├─> Actualiza estado local
  │                             └─> Guarda en localStorage
  │
  ├─> Cierra Configuración
  │     │
  │     └─> HomePage detecta cambio en sessionDuration
  │           │
  │           └─> PomodoroTimer se re-renderiza
  │                 │
  │                 └─> STUDY_TIME = 45 * 60
  │                       │
  │                       └─> Timer muestra 45:00
  │
  └─> Inicia Timer
        │
        └─> Corre con 45 minutos configurados
```

---

## 🏆 Resumen: ¿Qué Logramos?

✅ **Sistema de configuración completo** con 3 opciones  
✅ **Persistencia de preferencias** en localStorage  
✅ **UI intuitiva** con previews visuales  
✅ **Sincronización automática** entre componentes  
✅ **Código organizado** con hooks personalizados  
✅ **Experiencia de usuario** mejorada (como apps profesionales)  

---

## 📚 Tarea para el Alumno

Para profundizar tu aprendizaje, intenta:

1. **Agregar más duraciones:** 10 min, 60 min
2. **Agregar más temas:** Playa, Montaña, Ciudad
3. **Implementar audio real:** Agregar archivos .mp3 y reproducirlos
4. **Agregar modo oscuro:** Tema claro/oscuro para la UI
5. **Guardar en backend:** En vez de localStorage, guardar preferencias en la base de datos

---

## 🎓 Fin de la Clase

**¡Felicidades!** 🎉 Has completado el sistema de configuración.

**Aprendiste:**
- Crear hooks personalizados
- Usar localStorage
- Crear modales
- Sincronizar componentes
- Mejorar UX

**Próxima clase:** Integración con el backend para guardar sesiones completadas y crear estadísticas.

---

**Profesor:** Tu Asistente AI  
**Curso:** Desarrollo Full-Stack con React y Node.js  
**Proyecto:** Pomodoro Timer App  
**Fase:** 4 de 6 ✅

