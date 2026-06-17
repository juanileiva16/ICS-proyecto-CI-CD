# Imagen base: Node.js 22 en su variante "slim" (liviana pero compatible).
# Sobre esta base se construye todo lo demás.
FROM node:22-slim

# Carpeta de trabajo dentro del contenedor. A partir de acá, los comandos
# y copias se hacen relativos a /app.
WORKDIR /app

# Copiamos PRIMERO solo los manifiestos de dependencias.
# Esto aprovecha la caché por capas de Docker: si package.json no cambió,
# Docker reutiliza la capa de "npm ci" y no reinstala todo en cada build.
COPY package*.json ./

# Instala SOLO las dependencias de producción (omite jest, eslint, supertest).
# Resultado: imagen más liviana y sin herramientas de desarrollo.
RUN npm ci --omit=dev

# Ahora sí copiamos el resto del código de la app.
COPY . .

# Documenta que la app escucha en el puerto 3001 (informativo).
EXPOSE 3001

# Comando que se ejecuta al arrancar el contenedor: levanta el servidor.
CMD ["node", "src/server.js"]
