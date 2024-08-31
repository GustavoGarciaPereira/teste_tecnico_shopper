import express, { Application, Response, Request } from 'express';
import uploadRoutes from './routes/uploadRoutes';
import confirmRoutes from './routes/confirmRoutes';
import listRoutes from './routes/listRoutes';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
dotenv.config();

const app: Application = express();
// app.use(express.static(path.join(__dirname, '../src/', 'public')));

// // Endpoint para servir a página inicial
// app.get('/', (req: Request, res: Response) => {
//   res.sendFile(path.join(__dirname, '../src/', 'public', 'index.html'));
// });

// Aumenta o limite de tamanho do payload para 10MB ou mais
app.use(cors({
    origin: '*' // Permite todas as origens
    // origin: 'http://127.0.0.1:5500' // Para permitir apenas uma origem específica
  }));
app.use(express.json({ limit: '10mb' }));
app.use('/upload', uploadRoutes);
app.use('/confirm', confirmRoutes);
app.use('/:customerCode/list', listRoutes);

export default app;
