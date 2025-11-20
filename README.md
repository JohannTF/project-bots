# Miniproyecto 3 – Detección de Bots por Tiempo Mínimo de Respuesta

Sistema de autenticación con detección de bots por tiempo mínimo de respuesta.

## Inicio Rápido

### Desarrollo Local 

#### 1. Instalar dependencias
```bash
npm install
```

#### 2. Copia el archivo de ejemplo y configura tus variables
```bash
cp .env.example .env
```

#### 3. Configurar base de datos
Asegúrate de que PostgreSQL esté corriendo y crea la base de datos:
```sql
CREATE DATABASE timeprotection_db;
```

#### 4. Ejecutar migraciones de Prisma
```bash
npx prisma migrate dev --name init
```

#### 5. Iniciar el servidor
```bash
node src/app.js
```

El servidor estará disponible en `http://localhost:3000`

### Desarrollo con Docker

#### 1. Copia el archivo de ejemplo y configura tus variables
```bash
cp .env.example .env
```

#### 2. Levantar el proyecto con Docker Compose
```bash
docker-compose up --build
```

El servidor estará disponible en `http://localhost:3000`

#### Comandos útiles de Docker:

**Entrar al contenedor de Node.js:**
```bash
docker exec -it timeprotection-app  sh
```

**Entrar directamente a la base de datos en PostgreSQL:**
```bash
docker exec -it timeprotection-db psql -U DATABASE_USER -d DATABASE_NAME
```

**Entrar únicamente al contenedor de PostgreSQL:**
```bash
docker exec -it timeprotection-db sh
```

**Ver logs en tiempo real de algun servicio:**
```bash
docker logs -f timeprotection-app
docker logs -f timeprotection-db
```

**Detener y eliminar los contenedores:**
```bash
docker-compose down
```

**Detener y eliminar los contenedores y eliminar volumenes**
```bash
docker-compose down -v
```

## Pruebas

Para probar la detección de bots:
```bash
# En caso de usar docker, entrar primero al contenedor app antes de iniciar
node test/fast_submit.js
```

> **Nota:**
> Si modificas el archivo `prisma/schema.prisma`, regenera el cliente:
```bash
npx prisma generate
```
