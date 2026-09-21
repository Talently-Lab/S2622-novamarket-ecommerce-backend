# Documentación técnica — S2622 Novamarket E-commerce Backend

> Registro de tareas, cambios y problemas resueltos durante el desarrollo del backend.
## Sesión: 15/09/2026

### Objetivo
Crear repositorio en github con las carpetas tal cual en el esquema acordado en jira.

**1. ir a la carpeta del proyecto**
```bash
cd /c/Users/ariel/Links/Desktop/S2622-novamarket-ecommerce-backend
```

**2. inicializar git**
```bash
git init
```
**3. agregar los archivos**
```bash
git add
```
**4. hacer el commit**
```bash
git commit -m  "Primer commit"
```

**5. unificar repositorio remoto con el subido a github**
```bash
git push -u origin main
```
## Probema encontrados y solucion

problema : invalid username or token


solucion : ir a settings en github -> a personal tokens -> tokens classic -> Generate new token

**6. unificar repositorio remoto con el subido a github**
```bash
git pull origin main --allow-unrelated-histories
git add .
git commit -m "merge con repo remoto"
git push -u origin main
```
### Estado actual
_🟢 **Completado** 
### Pendientes para la próxima sesión
Conectar el backend (Node.js + Express) a la base de datos MongoDB Atlas, para luego empezar a definir los modelos de datos (schemas) del proyecto.
---

## Sesión: 19/09/2026

### Objetivo
Conectar el backend (Node.js + Express) a la base de datos MongoDB Atlas, para luego empezar a definir los modelos de datos (schemas) del proyecto.

### Cambios realizados

**1. Instalación de dependencias**
```bash
npm install mongoose dotenv express
```

**2. Configuración de variables de entorno**

Se agregó la variable de conexión en `.env` (archivo no versionado, excluido en `.gitignore`):
```
MONGODB_URI="mongodb+srv://<usuario>:<password>@<cluster>.mongodb.net/?retryWrites=true&w=majority&appName=novamarket-cluster"
```

**3. Módulo de conexión a la base de datos**

Se creó `src/config/db.js`, encargado de establecer la conexión con Mongoose y loguear el resultado:

```js
import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado a MongoDB');
  } catch (error) {
    console.error('❌ Error al conectar a MongoDB:', error.message);
    process.exit(1);
  }
};

export default connectDB;
```

**4. Integración en el servidor principal**

En `src/index.js` se importó y ejecutó `connectDB()` al levantar el servidor Express:

```js
import 'dotenv/config';
import express from 'express';
import connectDB from './config/db.js';

const app = express();
connectDB();
app.use(express.json());

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
```

**5. Script de arranque**

Se agregó en `package.json`:
```json
"scripts": {
  "start": "node src/index.js"
}
```

### Problemas encontrados y solución

| # | Problema | Causa | Solución |
|---|----------|-------|----------|
| 1 | `CommandNotFoundException` al ejecutar `run index.js` | Comando incorrecto en PowerShell | Usar `node index.js` en lugar de `run index.js` |
| 2 | `ReferenceError: require is not defined in ES module scope` | El `package.json` tiene `"type": "module"`, por lo que el proyecto usa ES Modules, no CommonJS | Reemplazar `require`/`module.exports` por `import`/`export` en todo el código |
| 3 | `injected env (0) from .env` — variables no se cargaban | El comando se ejecutaba desde `/src`, pero el archivo `.env` está en la raíz del proyecto | Ejecutar `node src/index.js` desde la raíz del proyecto |
| 4 | `The uri parameter to openUri() must be a string, got "undefined"` | El nombre de variable en `.env` (`MONGODB_URI`) no coincidía con el usado en el código (`MONGO_URI`) | Unificar el nombre de la variable en `.env` y en `db.js` |
| 5 | `querySrv ECONNREFUSED` | Fallo de resolución DNS para el registro SRV de Atlas (bloqueo de red/ISP) | Se resolvió cambiando de red / DNS |
| 6 | `bad auth: Authentication failed` | El `<db_password>` de la connection string no había sido reemplazado por la contraseña real | Reemplazar el placeholder completo por la contraseña real del usuario de la base |
| 7 | `bad auth: Authentication failed` (persiste) | **En investigación.** Se regeneró la contraseña del usuario en Atlas sin resolver el problema | Pendiente para la próxima sesión — ver sección "Pendientes" |

### Estado actual
🟡 **En progreso** — El servidor Express levanta correctamente en el puerto 3000, pero la conexión a MongoDB Atlas todavía falla con error de autenticación.

### Pendientes para la próxima sesión
- Verificar que el usuario `arielgonzalezmaillard_db_user` en Atlas → Database Access tenga permisos asignados (rol de lectura/escritura).
- Confirmar que la IP actual esté en la whitelist de Atlas (Network Access).
- Probar generar una contraseña 100% alfanumérica (sin símbolos) para descartar problemas de encoding en la URI.
- Una vez conectada la base, comenzar a definir los modelos en `src/models/` (Product, User, Order, etc.).

---
## Sesión: 20/09/2026

### Objetivo
Conexion con MongoDB

### Cambios realizados
Primero pase al modo sin SRV que la estructura es la siguiente:
mongodb://arielgonzalezmaillard_db_user:<db_password>@ac-yylonhv-shard-00-00.jpixuum.mongodb.net:27017,ac-yylonhv-shard-00-01.jpixuum.mongodb.net:27017,ac-yylonhv-shard-00-02.jpixuum.mongodb.net:27017/?ssl=true&replicaSet=atlas-hiv50b-shard-0&authSource=admin&appName=novamarket-cluster

### Problemas encontrados y solución
| # | Problema | Causa | Solución |
|---|----------|-------|----------|
| 1 | `❌ Error al conectar a MongoDB: bad auth : authentication failed | no sacar los "<>" de la contraseña| Sacar los "<>" ahora dice : Servidor corriendo en puerto 3000
✅ Conectado a MongoDB |

### Estado actual
_🟢 **Completado** 

### Pendientes para la próxima sesión
- [1] **Schema `users`**: modificar `carrito` para que sea `{ items: [...], fechaCreacion, fechaActualizacion }` en vez de array suelto
- [2] **Schema `users`**: agregar `{ timestamps: true }` al userSchema (da `createdAt` = fecha_registro)
- [3] **Schema `orders`**: agregar campo `fechaInicioCarrito` (Date, default null)
- [4] **Schema `orders`**: agregar `{ timestamps: true }` al orderSchema (da `createdAt` = fecha_pedido)
- [5] **Nuevo modelo `CartEvent`**: crear `models/CartEvent.js` con `userId`, `tipo` (enum: creado/checkout), `fecha`
- [6] **Controller `POST /api/cart`**: cuando el carrito pasa de vacío a tener 1er ítem, setear `fechaCreacion` + crear `CartEvent` tipo `creado`
- [7] **Controllers `PUT /PATCH /DELETE /api/cart/:id`**: actualizar `fechaActualizacion` en cada modificación
- [8] **Controller `POST /api/checkout`**: guardar `fechaInicioCarrito` en la orden nueva, crear `CartEvent` tipo `checkout` (antes de vaciar el carrito), y resetear `carrito.fechaCreacion` a null al vaciar
- [9] **Probar endpoints contra la base real** (Postman/Thunder Client), en este orden: registro → login → CRUD productos → carrito (agregar/editar/vaciar) → checkout → verificar que la orden quedó con snapshot de precio y `fechaInicioCarrito`
- [10] **Verificar que las colecciones se crean solas** en Atlas a medida que se prueban los endpoints (users, products, orders, cartevents)
- [11] **Query de prueba**: correr a mano el `aggregate` de tasa de abandono y tiempo promedio en checkout (los que armamos), aunque sea con 2-3 datos de prueba, para confirmar que las fechas se están guardando bien
- [12] **Responderle a Francisco**: confirmarle que el precio histórico ya estaba cubierto (`precioUnitario`) y que se sumaron `fechaCreacion`/`fechaActualizacion` al carrito para la tasa de abandono
- [13] **Avisarle a la PM** que la conexión ya está resuelta 

Plantilla 
## Sesión: DD/MM/AAAA

### Objetivo
_(Qué se buscaba lograr en esta sesión)_

### Cambios realizados
_(Código agregado/modificado, archivos creados, comandos ejecutados)_

### Problemas encontrados y solución
| # | Problema | Causa | Solución |
|---|----------|-------|----------|
| | | | |

### Estado actual
_(🟢 Completado / 🟡 En progreso / 🔴 Bloqueado)_

### Pendientes para la próxima sesión
- 
