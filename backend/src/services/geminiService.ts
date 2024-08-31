import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleAIFileManager } from "@google/generative-ai/server";
import fs from 'fs';
import path from 'path';
import os from 'os';

// Obtenha a chave da API do ambiente e assegure que ela seja uma string
const apiKey = process.env.GEMINI_API_KEY || "";
if (!apiKey) {
  console.log("apiKey",apiKey)
  throw new Error("API Key for Google Gemini is not defined");
}

// Inicializa a API Generative AI e o gerenciador de arquivos
const genAI = new GoogleGenerativeAI(apiKey);
const fileManager = new GoogleAIFileManager(apiKey);

// Função para converter base64 para arquivo temporário e fazer o upload da imagem para o Gemini
const uploadToGemini = async (base64Image: string, mimeType: string) => {
  try {
    // Decodifica o base64 em um buffer
    const imageBuffer = Buffer.from(base64Image, 'base64');

    // Cria um arquivo temporário para o upload
    const tempFilePath = path.join(os.tmpdir(), `${Date.now()}-image.png`);
    fs.writeFileSync(tempFilePath, imageBuffer);

    console.log("MIME Type:", mimeType); // Verifica se o MIME type está correto

    // Upload do arquivo temporário usando o caminho correto (string)
    const uploadResult = await fileManager.uploadFile(tempFilePath, {
      mimeType,
      displayName: "Uploaded Image",
    });

    const file = uploadResult.file;
    console.log(`Uploaded file ${file.displayName} as: ${file.name}`);

    // Remove o arquivo temporário após o upload
    fs.unlinkSync(tempFilePath);

    return file.uri; // Retorna a URI do arquivo enviado
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Failed to upload file: ${error.message}`);
    } else {
      console.error('Failed to upload file: Unknown error occurred');
    }
    throw new Error("Failed to upload image to Gemini.");
  }
};

// Função para processar a imagem com o modelo generativo da API
const processImage = async (base64Image: string, mimeType: string) => {
  try {
    const fileUri = await uploadToGemini(base64Image, mimeType);

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

    const generationConfig = {
      temperature: 1,
      topP: 0.95,
      topK: 64,
      maxOutputTokens: 8192,
      responseMimeType: "text/plain",
    };

    const chatSession = model.startChat({
      generationConfig,
      history: [
        {
          role: "user",
          parts: [{ text: "Qual o consumo desse medidor?" }],
        },
        {
          role: "model",
          parts: [
            {
              fileData: {
                mimeType: mimeType,
                fileUri: fileUri,
              },
            },
          ],
        },
      ],
    });

    const result = await chatSession.sendMessage("Aqui está a imagem do medidor, por favor informe o consumo.");
    // Ajuste aqui, simulando um retorno que inclui as propriedades necessárias.
    return {
      image_url: fileUri, // Esta é uma suposição, ajuste conforme a resposta real.
      measure_value: parseInt(result.response.text()), // Convertendo texto para número, ajuste conforme necessário.
      measure_uuid: "unique-guid-123", // Simulando um UUID, ajuste conforme necessário.
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    throw new Error('Failed to process image: ' + errorMessage);
  }
};
// const retryProcessImage = async (base64Image: string, mimeType: string, retries = 3) => {
//   for (let attempt = 0; attempt < retries; attempt++) {
//     try {
//       return await processImage(base64Image, mimeType);
//     } catch (error) {
//       console.error(`Attempt ${attempt + 1} failed: ${error.message}`);
//       if (attempt === retries - 1) {
//         throw error; // Re-throw se todas as tentativas falharem
//       }
//       await new Promise(res => setTimeout(res, 2000)); // Espera 2 segundos antes de tentar novamente
//     }
//   }
// };

// Chamando a função de retry
// retryProcessImage(base64Image, mimeType)
//   .then(response => console.log('Processed successfully:', response))
//   .catch(error => console.error('Failed to process image:', error));
export default { processImage };
