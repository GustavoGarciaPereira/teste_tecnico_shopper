# Use uma imagem base Node.js
FROM node:18

# Define o diretório de trabalho no container
WORKDIR /app

# Copia os arquivos do frontend
COPY . .

# Instala as dependências
RUN npm install

# Compila o TypeScript para JavaScript
RUN npm run build

# Use o pacote 'serve' para servir os arquivos da pasta dist
CMD ["npx", "serve", "-s", "dist"]
