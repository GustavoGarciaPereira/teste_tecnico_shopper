import { Request, Response, NextFunction } from 'express';

export const validateData = (req: Request, res: Response, next: NextFunction) => {
  // Validação dos dados...
  next();
};
