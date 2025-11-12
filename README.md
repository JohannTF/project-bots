# Miniproyecto 3 – Detección de Bots por Tiempo Mínimo de Respuesta

Sistema de autenticación con detección de bots por tiempo mínimo de respuesta.

## Inicio Rápido

### 1. Instalar dependencias
```bash
npm install
```

### 2. Copia el archivo de ejemplo y configura tus variables
´´´ bash
cp .env.example .env
´´´

### 3. Configurar base de datos
Asegúrate de que PostgreSQL esté corriendo y crea la base de datos:
```sql
CREATE DATABASE timeprotection_db;
```

### 4. Ejecutar migraciones de Prisma
```bash
npx prisma migrate dev --name init
```

### 5. Iniciar el servidor
```bash
node src/app.js
```

El servidor estará disponible en `http://localhost:3000`

## Pruebas

Para probar la detección de bots:
```bash
node test/fast_submit.js
```

> **Nota:**
> Si modificas el archivo `prisma/schema.prisma`, regenera el cliente:
```bash
npx prisma generate
```
