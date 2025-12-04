# 🐛 ANÁLISIS DEL BUG: TIEMPO INCORRECTO EN RECESOS

## 🔍 PROBLEMA REPORTADO
**"A partir del segundo receso se toma más tiempo del debido"**

## 📊 FLUJO ACTUAL DEL TIMER

### Lógica en `usePomodoroTimer.js`:

1. **Primer Break (Después de Sesión 1)**:
   - `sessionCount = 1`, `isBreak = false`
   - Cuando `timeLeft` llega a 0: `pendingAction = 'start-break'`
   - En `handleAlarmComplete`: `setTimeLeft(BREAK_TIME)` → 300 segundos (5 min) ✅

2. **Segunda Sesión (Después del Primer Break)**:
   - `sessionCount = 2`, `isBreak = false`
   - Cuando `timeLeft` llega a 0: `pendingAction = 'start-break'`
   - En `handleAlarmComplete`: `setTimeLeft(BREAK_TIME)` → 300 segundos (5 min) ✅

3. **Segundo Break (Después de Sesión 2)**: ⚠️ **AQUÍ ESTÁ EL PROBLEMA**
   - `sessionCount = 2`, `isBreak = true`
   - Cuando `timeLeft` llega a 0: `pendingAction = 'start-new-session'`
   - En `handleAlarmComplete`:
     ```javascript
     setIsBreak(false)
     setSessionCount(prev => prev + 1)  // sessionCount = 3
     setTimeLeft(sessionDuration * 60)  // 25 * 60 = 1500 segundos
     setIsRunning(true)
     ```

## 🐛 BUG IDENTIFICADO

### **BUG #1: useEffect que modifica tiempo durante el break**

**Ubicación**: `src/hooks/usePomodoroTimer.js:22-27`

```javascript
useEffect(() => {
  if (!isRunning && !isBreak) {
    setTimeLeft(sessionDuration * 60)
  }
}, [sessionDuration, isRunning, isBreak])
```

**Problema**: Este efecto se ejecuta cuando cambian `sessionDuration`, `isRunning` o `isBreak`. 

**Escenario del bug**:
1. Durante un break (`isBreak = true`), el tiempo es `BREAK_TIME` (300 seg)
2. Si el usuario cambia la configuración de `sessionDuration`, este efecto NO se ejecuta (porque `isBreak = true`)
3. PERO cuando el break termina y se establece `isBreak = false`, este efecto SE EJECUTA
4. Si el timer no está corriendo aún (entre la alarma y el inicio), puede resetear el tiempo incorrectamente

**Impacto**: Puede causar que el tiempo se resetee cuando no debería, o que no se resetee cuando debería.

---

### **BUG #2: Dependencias del useEffect del contador causan recreación del intervalo**

**Ubicación**: `src/hooks/usePomodoroTimer.js:68-93`

```javascript
useEffect(() => {
  if (!isRunning || isWaitingForAlarmRef.current) return

  const interval = setInterval(() => {
    setTimeLeft(prev => {
      if (prev <= 0) return 0
      const newTime = prev - 1
      if (newTime === 0) {
        clearInterval(interval)
        setIsRunning(false)
        isWaitingForAlarmRef.current = true
        
        if (!isBreak) {
          setPendingAction(sessionCount < TOTAL_SESSIONS ? 'start-break' : 'complete-cycle')
        } else {
          setPendingAction('start-new-session')
        }
        
        setShouldPlayAlarm(true)
      }
      return newTime
    })
  }, 1000)

  return () => clearInterval(interval)
}, [isRunning, isBreak, sessionCount, sessionDuration])  // ⚠️ PROBLEMA AQUÍ
```

**Problema**: Este efecto tiene `sessionDuration` como dependencia, lo que significa que:
- Cada vez que cambia `sessionDuration`, el intervalo se destruye y recrea
- Esto puede causar que se pierdan segundos o que el tiempo no se actualice correctamente

**Impacto**: Si el usuario cambia la duración de la sesión mientras el timer está corriendo, el intervalo se reinicia y puede perder tiempo.

---

### **BUG #3: Posible race condition en actualizaciones de estado**

**Ubicación**: `src/hooks/usePomodoroTimer.js:41-65`

**Problema**: En `handleAlarmComplete`, se hacen múltiples actualizaciones de estado:
1. `setIsBreak(true)` o `setIsBreak(false)`
2. `setTimeLeft(...)`
3. `setIsRunning(true)`
4. `setSessionCount(...)` (en algunos casos)

Estas actualizaciones son asíncronas y pueden no completarse en el orden esperado. Además, el `useEffect` del contador se recrea cuando cambia `isBreak` o `sessionCount`, lo que puede causar que el intervalo se cree antes de que `timeLeft` se haya actualizado correctamente.

**Escenario del bug**:
1. El break termina (`timeLeft = 0`)
2. `handleAlarmComplete` se ejecuta:
   - `setIsBreak(false)` 
   - `setSessionCount(3)`
   - `setTimeLeft(1500)` 
   - `setIsRunning(true)`
3. El `useEffect` del contador se ejecuta cuando cambia `isBreak` o `sessionCount`
4. Si el intervalo se crea ANTES de que `setTimeLeft(1500)` se complete, puede usar el valor anterior (0 o el tiempo del break)
5. El timer puede iniciarse con el tiempo incorrecto

---

### **BUG #4: El efecto que actualiza el tiempo puede interferir con breaks**

**Ubicación**: `src/hooks/usePomodoroTimer.js:22-27`

**Problema detallado**:

Cuando termina un break y se inicia una nueva sesión:
1. `setIsBreak(false)` se ejecuta
2. Esto dispara el `useEffect` que tiene la condición `if (!isRunning && !isBreak)`
3. Si `isRunning` aún es `false` en ese momento (antes de que `setIsRunning(true)` se ejecute), el efecto se ejecutará y reseteará el tiempo
4. Esto puede sobrescribir el `setTimeLeft(sessionDuration * 60)` que se hizo en `handleAlarmComplete`

**Secuencia problemática**:
```
handleAlarmComplete ejecuta:
  setIsBreak(false)         → isBreak = false
  setSessionCount(3)        → sessionCount = 3
  setTimeLeft(1500)         → timeLeft = 1500
  setIsRunning(true)        → isRunning = true

PERO el useEffect (líneas 22-27) puede ejecutarse ANTES de setIsRunning(true):
  isBreak = false (ya cambió)
  isRunning = false (aún no cambió)
  → Condición se cumple: !isRunning && !isBreak
  → setTimeLeft(sessionDuration * 60) se ejecuta OTRA VEZ

Luego setIsRunning(true) se ejecuta y el timer inicia con tiempo incorrecto
```

---

## 🎯 CAUSA RAÍZ DEL PROBLEMA

El problema principal es una **race condition** entre múltiples actualizaciones de estado y los efectos que reaccionan a esos cambios. Específicamente:

1. **Múltiples actualizaciones asíncronas**: Cuando termina el break, se hacen 4 actualizaciones de estado que pueden completarse en cualquier orden.

2. **Efectos que reaccionan demasiado pronto**: El `useEffect` que resetea el tiempo se ejecuta cuando `isBreak` cambia a `false`, pero puede ejecutarse antes de que `isRunning` cambie a `true`, causando que se resetee el tiempo cuando no debería.

3. **Dependencias innecesarias**: El `useEffect` del contador tiene `sessionDuration` como dependencia, lo que causa que se recree innecesariamente.

## 🔴 BUG CRÍTICO IDENTIFICADO

### **El problema específico con el segundo break:**

Cuando termina el **segundo break** (después de la sesión 2), ocurre lo siguiente:

1. El break llega a 0 segundos
2. `handleAlarmComplete` se ejecuta con `action = 'start-new-session'`
3. Se ejecutan estas actualizaciones en este orden:
   ```javascript
   setIsBreak(false)          // Cambia isBreak a false
   setSessionCount(prev => prev + 1)  // sessionCount = 3
   setTimeLeft(sessionDuration * 60)  // timeLeft = 1500 (25 min)
   setIsRunning(true)         // isRunning = true
   ```

4. **PROBLEMA**: Cuando `setIsBreak(false)` se ejecuta, el `useEffect` de las líneas 23-27 se dispara:
   ```javascript
   useEffect(() => {
     if (!isRunning && !isBreak) {  // isBreak ya es false, pero isRunning aún es false
       setTimeLeft(sessionDuration * 60)  // SE EJECUTA ESTO
     }
   }, [sessionDuration, isRunning, isBreak])
   ```

5. **PERO**: `setIsRunning(true)` aún no se ha completado, entonces `isRunning` es `false`
6. La condición `!isRunning && !isBreak` es `true`
7. Se ejecuta `setTimeLeft(sessionDuration * 60)` **OTRA VEZ**

**PERO ESPERA** - Esto no explica por qué el break toma MÁS tiempo. El problema debe ser otro...

### **REVISANDO EL FLUJO DEL BREAK:**

Cuando comienza un break:
```javascript
setIsBreak(true)
setTimeLeft(BREAK_TIME)  // 300 segundos (5 minutos)
setIsRunning(true)
```

El `useEffect` del contador (líneas 68-93) comienza a decrementar desde 300.

**PERO** - Si hay algún problema con cómo se maneja el tiempo cuando termina el break anterior y comienza una nueva sesión, el tiempo podría no estar en 0 cuando debería iniciar el break.

### **POSIBLE CAUSA REAL:**

El problema podría estar en que cuando termina un break y comienza una nueva sesión:

1. El break termina → `timeLeft = 0`
2. Se ejecuta `setTimeLeft(sessionDuration * 60)` = 1500 segundos
3. **PERO** si el `useEffect` del contador ya está corriendo y se recrea, podría estar usando un valor anterior de `timeLeft`
4. O peor aún, si hay alguna acumulación de tiempo residual

### **HIPÓTESIS MÁS PROBABLE:**

El bug está en que cuando se hace la transición de break a nueva sesión, hay un momento donde:
- El tiempo del break puede no haber llegado exactamente a 0
- O el tiempo de la nueva sesión se establece pero el contador no se resetea correctamente
- Y cuando esa sesión termina y comienza el siguiente break, el tiempo del break se suma con tiempo residual

**Ejemplo del bug**:
1. Segundo break termina en `timeLeft = 1` (no llega exactamente a 0)
2. Nueva sesión inicia con `timeLeft = 1500`
3. Pero si el contador aún está activo, puede estar en `timeLeft = 1501` o tener tiempo residual
4. Cuando esa sesión termina e inicia el siguiente break:
   - Se establece `setTimeLeft(BREAK_TIME)` = 300
   - Pero si hay tiempo residual acumulado, podría iniciar con más tiempo

---

## 🔧 SOLUCIÓN PROPUESTA

### Solución 1: Eliminar el useEffect problemático (líneas 22-27)
Este efecto parece innecesario porque el tiempo se establece explícitamente en `handleAlarmComplete` y `handleReset`.

### Solución 2: Usar un estado de "transición" para evitar race conditions
Usar un estado adicional para indicar que se está en transición y evitar que los efectos interfieran.

### Solución 3: Combinar actualizaciones de estado en una sola
Usar una función de actualización de estado que combine todas las actualizaciones atómicamente.

### Solución 4: Remover `sessionDuration` de las dependencias del contador
Solo incluir `isRunning` y `isBreak` como dependencias, y usar `sessionDuration` directamente sin que sea dependencia.

---

## 📝 IMPACTO ESPERADO DEL BUG

- **Primer break**: Funciona correctamente (5 minutos)
- **Segundo break en adelante**: El tiempo puede ser incorrecto porque:
  - El tiempo del break puede acumularse con el tiempo de la sesión
  - O el tiempo puede resetearse incorrectamente
  - Puede iniciarse con el tiempo de la sesión anterior + tiempo del break

---

## ✅ VERIFICACIÓN

Para confirmar el bug, revisar:
1. Si `timeLeft` se establece correctamente cuando termina cada break
2. Si el `useEffect` de las líneas 22-27 se ejecuta en momentos inesperados
3. Si hay acumulación de tiempo entre breaks y sesiones

