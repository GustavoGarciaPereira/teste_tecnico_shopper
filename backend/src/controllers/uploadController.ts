import { Request, Response } from 'express';
import multer from 'multer';
import geminiService from '../services/geminiService';

// Configuração do multer para salvar o arquivo na memória
const upload = multer({ storage: multer.memoryStorage() });

// Extende a interface Request para adicionar a propriedade 'file'
interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

export const uploadImage = async (req: MulterRequest, res: Response) => {
  try {
    const { customer_code, measure_datetime, measure_type } = req.body;
    const imageBuffer = req.file?.buffer;
    const mimeType = req.file?.mimetype;

    console.log(req.body);
    console.log("File received:", req.file);

    // Validação dos dados recebidos
    if (!imageBuffer || !customer_code || !measure_datetime || !measure_type || !mimeType) {
      return res.status(400).json({
        error_code: 'INVALID_DATA',
        error_description: 'Todos os campos são obrigatórios.',
      });
    }

    // Verifica se já existe uma leitura para este tipo e mês
    const existingMeasure = await checkForExistingMeasure(
      customer_code,
      measure_type,
      measure_datetime
    );
    if (existingMeasure) {
      return res.status(409).json({
        error_code: 'DOUBLE_REPORT',
        error_description: 'Leitura do mês já realizada.',
      });
    }

    try {
      // Converte o buffer da imagem para base64
      const imageBase64 = imageBuffer.toString('base64');

      // Processa a imagem base64 com a API Gemini para extrair a leitura
      const { image_url, measure_value, measure_uuid } = await geminiService.processImage(imageBase64, mimeType);

      // Retorna a resposta com o resultado da leitura
      res.status(200).json({
        image_url,
        measure_value,
        measure_uuid,
      });
    } catch (processError) {
      console.error("Error processing image:", processError);
      res.status(422).json({
        error_code: 'PROCESSING_ERROR',
        error_description: 'Erro ao processar a imagem. Verifique o formato e tente novamente.',
      });
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido ao processar a requisição.';
    res.status(400).json({
      error_code: 'INVALID_DATA',
      error_description: errorMessage,
    });
  }
};

// Função fictícia para verificar se já existe uma leitura para o tipo e mês
async function checkForExistingMeasure(
  customer_code: string,
  measure_type: string,
  measure_datetime: string
) {
  // Lógica para verificar no banco de dados se já existe uma leitura
  return false; // Retorne verdadeiro se a leitura já existir
}

// Exporta o middleware de upload
export const uploadMiddleware = upload.single('image');
