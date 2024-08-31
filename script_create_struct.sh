#!/bin/bash

# Define o diretório raiz
ROOT_DIR="./backend"

# Cria a estrutura de diretórios
mkdir -p $ROOT_DIR/src/{controllers,models,routes,services,middlewares,utils}

# Cria os arquivos no diretório src/controllers
touch $ROOT_DIR/src/controllers/{uploadController.ts,confirmController.ts,listController.ts}

# Cria o arquivo no diretório src/models
touch $ROOT_DIR/src/models/measureModel.ts

# Cria os arquivos no diretório src/routes
touch $ROOT_DIR/src/routes/{uploadRoutes.ts,confirmRoutes.ts,listRoutes.ts}

# Cria o arquivo no diretório src/services
touch $ROOT_DIR/src/services/geminiService.ts

# Cria o arquivo no diretório src/middlewares
touch $ROOT_DIR/src/middlewares/validationMiddleware.ts

# Cria o arquivo no diretório src/utils
touch $ROOT_DIR/src/utils/helpers.ts

# Cria o arquivo app.ts e index.ts no diretório src
touch $ROOT_DIR/src/{app.ts,index.ts}

# Cria os arquivos na raiz do diretório backend
touch $ROOT_DIR/{Dockerfile,docker-compose.yml,.env}

echo "Estrutura de diretórios e arquivos criada com sucesso!"
