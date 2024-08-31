import { Request, Response } from 'express';
import { findMeasureByUUID, updateMeasureValue } from '../services/measureService'; // Importações fictícias para manipulação do banco de dados

export const confirmReading = async (req: Request, res: Response) => {
  try {
    const { measure_uuid, confirmed_value } = req.body;

    // Validação dos parâmetros
    if (!measure_uuid || typeof confirmed_value !== 'number') {
      return res.status(400).json({ error_code: 'INVALID_DATA', error_description: 'UUID e valor confirmado são obrigatórios.' });
    }

    // Busca a medida pelo UUID no banco de dados
    const measure = await findMeasureByUUID(measure_uuid);
    if (!measure) {
      return res.status(404).json({ error_code: 'MEASURE_NOT_FOUND', error_description: 'Leitura não encontrada.' });
    }

    // Verifica se a leitura já foi confirmada
    if (measure.has_confirmed) {
      return res.status(409).json({ error_code: 'CONFIRMATION_DUPLICATE', error_description: 'Leitura já confirmada.' });
    }

    // Atualiza o valor da medida no banco de dados
    await updateMeasureValue(measure_uuid, confirmed_value);

    // Resposta de sucesso
    res.status(200).json({ success: true });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(400).json({ error_code: 'INVALID_DATA', error_description: errorMessage });
  }
};
