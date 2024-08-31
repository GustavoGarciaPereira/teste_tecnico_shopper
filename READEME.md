### Documentação para o README com Docker

## API de Upload e Processamento de Imagens

### Descrição
Este projeto implementa uma API para o upload de imagens de medidores e processamento usando a API Google Generative AI para extrair leituras de consumo. A aplicação suporta leituras de água, gás e eletricidade.

### Endpoints

1. **POST /upload**
   - **Descrição**: Recebe uma imagem em base64, consulta a API Gemini, e retorna a medida lida.
   - **Request Body**:
     ```json
     {
       "image": "base64",
       "customer_code": "string",
       "measure_datetime": "datetime",
       "measure_type": "WATER" ou "GAS"
     }
     ```
   - **Response Body**:
     - **200**: 
       ```json
       {
         "image_url": "string",
         "measure_value": integer,
         "measure_uuid": "string"
       }
       ```
     - **400**:
       ```json
       {
         "error_code": "INVALID_DATA",
         "error_description": "Descrição do erro"
       }
       ```
     - **409**:
       ```json
       {
         "error_code": "DOUBLE_REPORT",
         "error_description": "Leitura do mês já realizada"
       }
       ```

### Instalação e Execução com Docker

1. **Clone o repositório**:
   ```bash
   git clone https://github.com/seu-repositorio.git
   cd seu-repositorio
   ```

2. **Configure as variáveis de ambiente** no arquivo `.env`:
   ```env
   GEMINI_API_KEY=sua_chave_api
   ```

3. **Construa e execute o contêiner com Docker Compose**:
   ```bash
   docker-compose up --build
   ```

4. **Acesse a API**:
   - A API estará disponível em `http://localhost:80`.

### Arquitetura do Docker
- **`app`**: Serviço Node.js que executa a API.
- **`db`**: Banco de dados MongoDB para armazenar as leituras.

### Tecnologias Utilizadas
- Node.js
- Express
- Multer
- Google Generative AI
- Docker e Docker Compose
