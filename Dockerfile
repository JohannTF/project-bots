FROM node:22-alpine

# Instalar dependencias del sistema necesarias para Prisma
RUN apk add --no-cache openssl libc6-compat

# Crear directorio de la aplicación
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./
COPY prisma ./prisma/

# Copiar el resto de la aplicación
COPY . .

# Instalar dependencias
RUN npm ci

# Cambiar permisos del directorio a usuario node
RUN chown -R node:node /app

# Exponer el puerto
EXPOSE 3000

# Usuario no-root por seguridad
USER node

# Comando por defecto
CMD ["node", "src/app.js"]
