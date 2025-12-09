# Equipo-Bots

Miniproyecto 3 – Detección de Bots por Tiempo Mínimo de Respuesta

## Planteamiento del Problema

La empresa Burritos Blancos Solutions S.A. de C.V., luego de implementar controles de honeypot y rate limiting, observó un nuevo tipo de ataque automatizado: scripts que simulan usuarios humanos pero envían formularios de inicio de sesión y registro de forma casi instantánea, antes de que un usuario real pudiera hacerlo manualmente.

Estos bots logran evadir los controles básicos al no llenar campos trampa, pero su velocidad de envío es anormalmente alta (menos de un segundo).

El departamento de Ciberseguridad requiere una solución que mida el tiempo transcurrido entre la carga del formulario y su envío, bloqueando cualquier solicitud que ocurra demasiado rápido.

El objetivo de este miniproyecto es implementar un sistema de autenticación con detección de comportamiento humano, mediante un tiempo mínimo de respuesta. Si el tiempo entre solicitudes es menor a un umbral predefinido (por ejemplo, 1 segundo), el sistema debe considerarlo sospechoso y bloquearlo.

## Definición del Proyecto

### Nombre

MiniSistema de Inicio de Sesión con Detección por Tiempo Mínimo

### Objetivo

Implementar un sistema web con roles (admin, user) que:

- Permita registro e inicio de sesión.
- Detecte y bloquee solicitudes enviadas demasiado rápido.
- Aplique sesiones seguras y buenas prácticas de ciberseguridad.

## Módulos Principales de Ciberseguridad

Capa Técnica — Descripción / Propósito

1. Autenticación Segura — Hash de contraseñas con bcrypt. Protege credenciales.
2. Detección de bots — Tiempo mínimo entre acciones. Evita envíos automáticos instantáneos.
3. Seguridad de sesión — Cookies httpOnly, sameSite=strict. Impide robo de sesión.
4. Cabeceras HTTP seguras — helmet middleware. Previene XSS, click-jacking, etc.
5. Validación de entradas — Sanitización y validación de formularios. Previene inyecciones.

## Estructura del Proyecto

```bash
/time-protection-project
├── prisma/
│    └── schema.prisma
├── src/
│    ├── app.js
│    ├── routes/
│    │    ├── authRoutes.js
│    │    └── adminRoutes.js
│    ├── controllers/
│    │    ├── authController.js
│    │    └── adminController.js
│    ├── middleware/
│    │    └── timeProtection.js
│    └── views/
│        ├── login.ejs
│        ├── register.ejs
│        ├── user.ejs
│        └── admin.ejs
├── .env
├── package.json
└── README.md
```

## Ejemplo de Desarrollo

### 1. Instalar Node.js y comprobar que funciona

#### Paso 1 — Descargar

- Ir a: https://nodejs.org/
- Descargar la versión LTS (Long Term Support).

#### Paso 2 — Instalar

Ejecutar el instalador y mantener las opciones por defecto.
- Añadir a PATH
- Instalar npm

#### Paso 3 — Comprobar instalación

Debe mostrar los números de versión correctamente.

```bash
node -v
npm -v
```

### 2. Crear carpeta de proyecto

``` bash
mkdir time-protection-project
cd time-protection-project
npm init -y
```

### 3. Instalar dependencias y añadir a PATH

``` bash
npm install express express-session ejs bcrypt dotenv helmet @prisma/client
npm install prisma --save-dev
```
## Paquetes

A continuación se listan los paquetes necesarios y su función:

- **express** — Servidor web principal
- **express-session** — Sesiones seguras
- **ejs** — Plantillas HTML dinámicas
- **bcrypt** — Hash de contraseñas
- **dotenv** — Variables de entorno
- **helmet** — Cabeceras HTTP seguras
- **@prisma/client** — ORM para PostgreSQL
- **prisma** — CLI para migraciones

## 4. Configurar PostgreSQL y Prisma

### Crear base de datos

``` bash
CREATE DATABASE  timeprotection_db ;
```

### Archivo `.env`:

``` bash
DATABASE_URL="postgresql://postgres:admin123@localhost:5432/timeprotection_db?
schema=public"
SESSION_SECRET="clave_segura_para_sesiones"
PORT=3000
```

### Archivo `prisma/schema.prisma`:

``` prisma
generator client {
  provider = "prisma-client-js"
}
datasource db {
  provider = "postgresql"
  url      = env("DA TABASE_URL")
}
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  password  String
  role      String   @default("user")
  createdAt DateTime @default(now())
}
```

Ejecutar migración:

```bash
npx prisma migrate dev --name init
```

## 5. Configurar servidor Express
Archivo `src/app.js`:

```js
import express from "express";
import session from "express-session";
import helmet from "helmet";
import dotenv from "dotenv";
import path from "path";
import { PrismaClient } from "@prisma/client";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
dotenv.config();
const app = express();
const prisma = new PrismaClient();
app.use(helmet());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, sameSite: "strict" }
}));
app.set("view engine", "ejs");
app.set("views", path.join(process.cwd(), "src/views" ));
app.use("/", authRoutes );
app.use("/admin", adminRoutes );
const  POR T = process.env.POR T || 3000;
app.listen(POR T, () => console.log(`Servidor en http://localhost: ${POR T}`));
```

## 6. Middleware de detección por tiempo mínimo

Archivo `src/middleware/timeProtection.js`:

```js
export function timeProtection(req, res, next) {
  const lastTime = req.session.lastRequestTime || 0;
  const now = Date.now();
  const elapsed = now - lastTime;
  req.session.lastRequestTime = now;
  if (elapsed < 1000) {
    console.log("Acción sospechosa: solicitud demasiado rápida");
    return res.status(403).send("Acción sospechosa detectada.");
  }
  next();
}
```

Este middleware bloquea cualquier acción que se repita antes de 1 segundo.

## 7. Rutas con protección de tiempo

Archivo `src/routes/authRoutes.js`:

```js
import express from "express";
import { showLogin, showRegister, registerUser, loginUser, logoutUser, userPage } from "../controllers/authController.js";
import { timeProtection } from "../middleware/timeProtection.js";
const router = express.Router();
router.get("/login", showLogin);
router.post("/login", timeProtection, loginUser);
router.get("/register", showRegister);
router.post("/register", timeProtection, registerUser);
router.get("/user", userPage);
router.get("/logout", logoutUser);
export default router;
```

## 8. Vistas básicas EJS

`login.ejs`

```html
<h2>Iniciar Sesión </h2>
<form method="POST" action="/login">
  <input type="email" name="email" required><br>
  <input type="password" name="password" required><br>
  <button type="submit">Entrar</button>
</form>
<a href="/register">Registrarse </a>
```

`register.ejs`

```html
<h2>Registro</h2>
<form method="POST" action="/register">
  <input type="email" name="email" required><br>
  <input type="password" name="password" required><br>
  <button type="submit">Registrar</button>
</form>
<a href="/login">Iniciar sesión </a>
```

## 9. Prueba de simulación (bot de envío rápido)

Crear archivo `test/fast_submit.js`:

```js
import fetch from "node-fetch";
const loginURL = "http://localhost:3000/login";
async function simulateFastSubmit() {
  for (let i = 0; i < 3; i++) {
    const res = await fetch(loginURL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: "email=usuario@valido.com&password=1234"
    });
    console.log(`Envío ${i + 1}: ${res.status}`);
    const text = await res.text();
    console.log(text.substring(0, 80), "...");
  }
}
simulateFastSubmit();
```

Ejecutar:

```bash
node test/fast_submit.js
```

Resultado esperado

Primer envío: procesado normalmente (200 OK).
Segundo y tercer envío (demasiado rápidos):

``` bash
403 Acción sospechosa detectada.
```

## 10. Prueba manual en navegador:

1. Abrir http://localhost:3000/register .
2. Intentar enviar el formulario varias veces en menos de 1 segundo.
3. El servidor deberá bloquear la segunda solicitud rápida.