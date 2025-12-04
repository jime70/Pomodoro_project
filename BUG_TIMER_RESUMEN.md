# 🐛 BUG CRÍTICO: Tiempo Incorrecto en Recesos

## 📋 RESUMEN EJECUTIVO

**Problema Reportado**: A partir del segundo receso, se toma más tiempo del debido.

**Impacto**: Los recesos no duran los 5 minutos esperados, afectando la experiencia del usuario y la funcionalidad del Pomodoro Timer.

## 🔍 FALLAS IDENTIFICADAS QUE AFECTAN EL TIEMPO

### ❌ **FALLA CRÍTICA #1: Race Condition en Transiciones de Estado**

**Ubicación**: `src/hooks/usePomodoroTimer.js:22-27` y `41-65`

**Problema**: 
El `useEffect` que actualiza el tiempo cuando cambia `sessionDuration` (líneas 23-27) puede interferir con las transiciones entre breaks y sesiones, causando que el tiempo se resetee o se establezca incorrectamente.

**Flujo problemático**:
```
1. Break termina → setIsBreak(false) se ejecuta
2. El useEffect (línea 23) detecta que isBreak cambió a false
3. Si isRunning aún es false, ejecuta setTimeLeft(sessionDuration * 60)
4. handleAlarmComplete también ejecuta setTimeLeft(...)
5. Conflicto: dos actualizaciones compiten, una puede sobrescribir a la otra
```

**Evidencia en código**:
```22:27:src/hooks/usePomodoroTimer.js
  useEffect(() => {
    if (!isRunning && !isBreak) {
      setTimeLeft(sessionDuration * 60)
    }
  }, [sessionDuration, isRunning, isBreak])
```

Este efecto se ejecuta cuando `isBreak` cambia, pero puede ejecutarse en el momento incorrecto durante las transiciones.

---

### ❌ **FALLA CRÍTICA #2: Recreación del Intervalo del Contador**

**Ubicación**: `src/hooks/usePomodoroTimer.js:68-93`

**Problema**: 
El `useEffect` del contador tiene `sessionDuration`, `isRunning`, `isBreak` y `sessionCount` como dependencias. Cada vez que cualquiera de estas cambia, el intervalo se destruye y recrea. Esto puede causar:

1. **Pérdida de sincronización**: El nuevo intervalo puede iniciar con un estado obsoleto
2. **Múltiples intervalos**: Si el cleanup no se ejecuta a tiempo, pueden quedar múltiples intervalos corriendo
3. **Tiempo residual**: El intervalo anterior puede dejar tiempo residual que no se limpia

**Evidencia en código**:
```93:93:src/hooks/usePomodoroTimer.js
  }, [isRunning, isBreak, sessionCount, sessionDuration])
```

Cada transición de break a sesión (o viceversa) causa que `isBreak` y posiblemente `sessionCount` cambien, recreando el intervalo.

---

### ❌ **FALLA CRÍTICA #3: Múltiples Actualizaciones Asíncronas de Estado**

**Ubicación**: `src/hooks/usePomodoroTimer.js:41-65`

**Problema**:
En `handleAlarmComplete`, cuando termina un break y comienza una nueva sesión, se ejecutan múltiples `setState` que pueden completarse en cualquier orden:

```javascript
setIsBreak(false)              // 1. Cambia isBreak
setSessionCount(prev => prev + 1)  // 2. Incrementa contador
setTimeLeft(sessionDuration * 60)  // 3. Establece tiempo
setIsRunning(true)             // 4. Inicia timer
```

Cada cambio de estado puede disparar efectos que reaccionan a esos cambios, causando condiciones de carrera.

**Escenario del bug**:
1. `setIsBreak(false)` se completa
2. El `useEffect` de la línea 23 se ejecuta ANTES de que `setIsRunning(true)` se complete
3. Como `isRunning` aún es `false`, el efecto resetea el tiempo
4. Luego `setIsRunning(true)` se completa y el timer inicia con tiempo incorrecto
5. Cuando ese timer termina e inicia el siguiente break, puede tener tiempo residual

---

### ❌ **FALLA CRÍTICA #4: Falta de Limpieza del Intervalo Anterior**

**Ubicación**: `src/hooks/usePomodoroTimer.js:71-90`

**Problema**:
Cuando el intervalo detecta que `timeLeft` llega a 0, llama a `clearInterval(interval)`, pero esto solo limpia el intervalo actual. Si el `useEffect` se recrea ANTES de que el cleanup se ejecute, pueden quedar múltiples intervalos corriendo simultáneamente, causando que el tiempo se decremente más rápido o de forma inconsistente.

**Evidencia**:
```71:90:src/hooks/usePomodoroTimer.js
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
```

El problema es que cuando `newTime === 0`, se hace `clearInterval(interval)`, pero luego se cambian estados (`setIsRunning`, `setPendingAction`, etc.) que pueden causar que el `useEffect` se recree y cree un nuevo intervalo antes de que el cleanup se complete.

---

## 🎯 CAUSA RAÍZ DEL PROBLEMA REPORTADO

El bug "a partir del segundo receso se toma más tiempo del debido" se debe a:

1. **Acumulación de tiempo residual**: Cuando hay múltiples intervalos o transiciones mal sincronizadas, el tiempo puede no estar exactamente en 0 cuando comienza un nuevo break, y ese tiempo residual se acumula.

2. **Conflicto entre efectos**: El `useEffect` que resetea el tiempo (línea 23) compite con las actualizaciones en `handleAlarmComplete`, causando que el tiempo se establezca incorrectamente.

3. **Recreación del intervalo**: Cada vez que cambia `isBreak` o `sessionCount`, el intervalo se recrea. Si el intervalo anterior aún estaba corriendo, puede haber tiempo residual que no se limpia correctamente.

4. **Condición de carrera**: Las múltiples actualizaciones asíncronas de estado pueden causar que los efectos se ejecuten en el orden incorrecto, estableciendo el tiempo en valores incorrectos.

---

## 📊 FLUJO DEL BUG (Ejemplo)

### Flujo Normal (Primer Break - Funciona):
1. Sesión 1 completa → `timeLeft = 0`
2. Break inicia → `setTimeLeft(BREAK_TIME)` = 300 segundos ✅
3. Timer cuenta de 300 a 0 ✅

### Flujo con Bug (Segundo Break - Falla):
1. Sesión 2 completa → `timeLeft = 0`
2. Break 2 debería iniciar con 300 segundos
3. PERO:
   - `setIsBreak(false)` (de la sesión anterior) puede disparar el `useEffect`
   - El intervalo se recrea antes de que `setTimeLeft(BREAK_TIME)` se complete
   - Hay tiempo residual de la transición anterior
   - El break inicia con tiempo > 300 segundos ❌

---

## ✅ VERIFICACIÓN DEL BUG

Para confirmar el bug, verificar:

1. **Valor inicial del break**: Cuando comienza el segundo break, `timeLeft` debería ser exactamente 300, pero podría ser mayor.

2. **Múltiples intervalos**: Verificar si hay múltiples intervalos corriendo simultáneamente usando DevTools.

3. **Orden de ejecución**: Agregar logs para verificar el orden en que se ejecutan los efectos y las actualizaciones de estado.

4. **Tiempo residual**: Verificar si hay tiempo residual acumulado cuando se hace la transición de sesión a break.

---

## 🔧 SOLUCIONES RECOMENDADAS

1. **Eliminar el useEffect problemático** (líneas 23-27) que resetea el tiempo, ya que el tiempo se establece explícitamente en `handleAlarmComplete` y `handleReset`.

2. **Reducir dependencias del useEffect del contador**: Solo incluir `isRunning` y usar refs para valores que no deberían causar recreación.

3. **Usar un estado de transición**: Agregar un estado que indique cuando se está en transición para evitar que los efectos interfieran.

4. **Combinar actualizaciones de estado**: Usar `setState` con función de actualización para hacer cambios atómicos.

5. **Mejorar la limpieza del intervalo**: Asegurar que el intervalo se limpie correctamente antes de crear uno nuevo.

---

## 📝 PRIORIDAD

**ALTA** - Este bug afecta la funcionalidad principal de la aplicación y causa una mala experiencia de usuario. Debe corregirse antes de cualquier despliegue a producción.

