# Use uma imagem Node.js como base
FROM node:20

# Diretório de trabalho dentro do container
WORKDIR /usr/src/app

# Copie o package.json e o package-lock.json para o diretório de trabalho
COPY package*.json ./

# Instale as dependências do projeto e as declarações de tipos necessárias
RUN npm install

# Instale as dependências de desenvolvimento, incluindo as declarações de tipos necessárias
RUN npm install --save-dev @types/node @types/express @types/mongoose @types/axios @types/dotenv typescript @google/generative-ai @types/multer @types/cors

# Copie todo o código fonte para o diretório de trabalho
COPY . .

# Compile o TypeScript para JavaScript
RUN npx tsc

# Exponha a porta 80 para acesso externo
EXPOSE 80

# Comando para iniciar o aplicativo
CMD ["node", "dist/index.js"]
