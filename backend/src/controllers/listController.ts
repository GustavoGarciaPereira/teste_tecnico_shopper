import { Request, Response } from 'express';
import { findMeasuresByCustomerCode } from '../services/measureService'; // Supondo um serviço para busca de medidas no banco de dados

export const listReadings = async (req: Request, res: Response) => {
  try {
    const { customerCode } = req.params;
    const measureType = (req.query.measure_type as string)?.toUpperCase();

    // Validação dos parâmetros
    if (!customerCode) {
      return res.status(400).json({ error_code: 'INVALID_DATA', error_description: 'Código do cliente é obrigatório.' });
    }
    
    // Validação do tipo de medida, se fornecido
    if (measureType && !['WATER', 'GAS'].includes(measureType)) {
      return res.status(400).json({ error_code: 'INVALID_TYPE', error_description: 'Tipo de medição não permitida.' });
    }

    // Busca as medidas do cliente e filtra pelo tipo, se especificado
    const measures = await findMeasuresByCustomerCode(customerCode, measureType);

    // Verifica se medidas foram encontradas
    if (measures.length === 0) {
      return res.status(404).json({ error_code: 'MEASURES_NOT_FOUND', error_description: 'Nenhuma leitura encontrada.' });
    }

    // Resposta com as leituras encontradas
    res.status(200).json({ customer_code: customerCode, measures });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(400).json({ error_code: 'INVALID_TYPE', error_description: errorMessage });
  }
};
