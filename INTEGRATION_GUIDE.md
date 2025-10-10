# 🔗 Guía de Integración Frontend-Backend

## 📍 Configuración de Puertos

- **Backend:** `http://localhost:3000`
- **Frontend:** `http://localhost:5173` (Vite)

## 🚀 Pasos para Ejecutar la Aplicación Completa

### 1. Iniciar MongoDB

```bash
# Windows
net start MongoDB

# macOS/Linux
sudo systemctl start mongod
```

### 2. Configurar Backend

```bash
# Navegar al directorio del backend
cd d:\pomodoro-project\pomodoro-backend

# Crear archivo .env (si no existe)
# Copiar env.example y renombrar a .env
# Asegurarse de tener:
# PORT=3000
# MONGODB_URI=mongodb://localhost:27017/pomodoro-db
# JWT_SECRET=tu_clave_secreta_aqui

# Iniciar el servidor
npm run server
```

Deberías ver:
```
🚀 Servidor corriendo en http://localhost:3000
📱 Entorno: development
✅ MongoDB conectado: localhost
⏰ API de Pomodoro lista para usar
```

### 3. Configurar Frontend

```bash
# Navegar al directorio del frontend
cd c:\Users\Hp\Downloads\pomodoro-timer-main\pomodoro-frontend

# Iniciar el servidor de desarrollo
npm run dev
```

Deberías ver:
```
  VITE v7.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### 4. Abrir la Aplicación

Abre tu navegador en `http://localhost:5173/`

## 🎯 Flujo de Prueba Completo

### A. Autenticación

1. **Registrar Usuario**
   - Clic en "Registrarse"
   - Llenar: Nombre, Email, Contraseña
   - El sistema automáticamente inicia sesión

2. **Login** (si ya tienes cuenta)
   - Clic en "Login"
   - Email y Contraseña
   - Guardar token automáticamente

3. **Verificar Sesión**
   - Deberías ver tu nombre en el navbar
   - Panel de objetivos visible a la derecha

### B. Gestión de Objetivos

1. **Crear Objetivo**
   - En el panel lateral derecho
   - Escribir objetivo: "Estudiar React Hooks"
   - Seleccionar sesión: 1
   - Clic en "+ Agregar Objetivo"

2. **Ver Objetivos**
   - Los objetivos aparecen listados
   - Contador muestra: "0 de 1 completados"

3. **Marcar Completado**
   - Hacer clic en checkbox
   - El texto aparece tachado

4. **Editar Objetivo**
   - Clic en botón ✏️
   - Modificar texto
   - Enter para guardar o ✓

5. **Eliminar Objetivo**
   - Clic en botón 🗑️
   - Confirmar eliminación

### C. Usar el Timer (Actual)

1. **Iniciar Sesión de Estudio**
   - Clic en "Iniciar"
   - El contador empieza desde 25:00

2. **Pausar**
   - Clic en "Pausar"

3. **Resetear**
   - Clic en "Resetear"

## 📡 Endpoints de la API

### Autenticación

- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/me` - Obtener usuario actual (requiere token)
- `POST /api/auth/logout` - Cerrar sesión (requiere token)

### Objetivos (Goals)

Todos requieren autenticación con token JWT:

- `POST /api/goals` - Crear objetivo
- `GET /api/goals` - Listar objetivos del usuario
- `GET /api/goals/set/:setNumber` - Objetivos por sesión (1-4)
- `PUT /api/goals/:id` - Actualizar objetivo
- `DELETE /api/goals/:id` - Eliminar objetivo

### Sesiones

Todos requieren autenticación:

- `POST /api/sessions` - Registrar sesión completada
- `GET /api/sessions` - Listar sesiones del usuario
- `GET /api/sessions/stats` - Obtener estadísticas

## 🔐 Cómo Funciona la Autenticación

### En el Frontend:

1. Al hacer login/register, el token JWT se guarda en `localStorage`
2. Cada petición al backend incluye: `Authorization: Bearer <token>`
3. Si el token es inválido (401), se limpia y redirecciona al login

### En el Backend:

1. El middleware `protect` verifica el token en cada petición protegida
2. Extrae el usuario del token y lo agrega a `req.user`
3. Los controladores usan `req.user._id` para filtrar datos por usuario

## 🐛 Solución de Problemas

### Frontend no se conecta al Backend

**Error:** Network Error o CORS Error

**Solución:**
1. Verificar que el backend esté corriendo en puerto 3000
2. El CORS ya está habilitado en el backend
3. Verificar la URL en `src/config/api.js`:
   ```javascript
   export const API_URL = 'http://localhost:3000/api';
   ```

### Token Inválido / No Autorizado

**Error:** 401 Unauthorized

**Solución:**
1. Hacer logout y login de nuevo
2. Verificar que JWT_SECRET en backend `.env` no haya cambiado
3. Limpiar localStorage del navegador:
   ```javascript
   localStorage.clear()
   ```

### MongoDB No Conecta

**Error:** Error conectando a MongoDB

**Solución:**
1. Verificar que MongoDB esté corriendo
2. Verificar MONGODB_URI en `.env`:
   ```
   MONGODB_URI=mongodb://localhost:27017/pomodoro-db
   ```
3. Probar conexión:
   ```bash
   mongosh mongodb://localhost:27017/pomodoro-db
   ```

### Objetivos no se Cargan

**Error:** Error al cargar objetivos

**Solución:**
1. Verificar que estés logueado (token válido)
2. Abrir DevTools → Network → ver petición a `/api/goals/set/1`
3. Verificar header Authorization
4. Ver respuesta del servidor en consola del backend

## 📝 Próximos Pasos (TODO)

- [ ] Implementar configuración de timer (25/35/45 min)
- [ ] Guardar preferencias de usuario en backend
- [ ] Selector de temas visuales (autumn.gif / storm.gif)
- [ ] Selector de sonidos de notificación
- [ ] Página de estadísticas completa
- [ ] Integrar timer con sesiones (registrar automáticamente)
- [ ] Conectar currentSession del HomePage con el timer real

## 🎨 Estructura de Archivos Clave

### Frontend
```
src/
├── config/
│   └── api.js              # Configuración de URLs
├── services/
│   └── api.js              # Servicios de API (axios)
├── context/
│   ├── AuthContext.jsx     # Gestión de autenticación
│   └── TimerContext.jsx    # Gestión del timer
├── components/
│   ├── Auth/               # Login, Register, AuthDropdown
│   ├── Goals/              # GoalsForm, GoalsList
│   └── Navbar/             # Navbar con auth
└── pages/
    └── HomePage.jsx        # Layout principal
```

### Backend
```
src/
├── config/
│   ├── db.js               # Conexión MongoDB
│   └── env.js              # Variables de entorno
├── models/
│   ├── users.js            # Schema Usuario
│   ├── Goals.js            # Schema Objetivos
│   └── Session.js          # Schema Sesiones
├── controllers/
│   ├── authController.js   # Lógica de auth
│   ├── goalsController.js  # Lógica de goals
│   └── sessionController.js # Lógica de sessions
├── routes/
│   ├── authRoutes.js
│   ├── goalsRoutes.js
│   └── sessionRoutes.js
├── middleware/
│   └── authMiddleware.js   # Protección con JWT
└── server.js               # Punto de entrada
```

## 📚 Recursos Adicionales

- **API Documentation:** Ver `d:\pomodoro-project\pomodoro-backend\API_DOCUMENTATION.md`
- **Backend Setup:** Ver `d:\pomodoro-project\pomodoro-backend\SETUP_GUIDE.md`
- **Backend README:** Ver `d:\pomodoro-project\pomodoro-backend\README.md`

## ✅ Checklist de Verificación

Antes de considerar la integración completa:

- [x] Backend corriendo en puerto 3000
- [x] Frontend corriendo en puerto 5173
- [x] MongoDB conectado
- [x] Registro de usuarios funciona
- [x] Login funciona y guarda token
- [x] Navbar muestra usuario logueado
- [x] Dropdown de usuario funciona
- [x] Panel de objetivos visible cuando hay sesión
- [x] Crear objetivos funciona
- [x] Listar objetivos funciona
- [x] Editar objetivos funciona
- [x] Eliminar objetivos funciona
- [x] Marcar completado funciona
- [x] Logout funciona y limpia token
- [ ] Timer integrado con sesiones
- [ ] Configuración de timer implementada
- [ ] Estadísticas implementadas

---

**¡Tu aplicación Pomodoro está casi lista!** 🎉

Ahora puedes:
1. Registrarte como usuario
2. Agregar objetivos de estudio
3. Usar el timer (actualmente 25 min fijos)
4. Gestionar tus objetivos por sesión

Los siguientes pasos serán implementar la configuración personalizada del timer y las estadísticas.

