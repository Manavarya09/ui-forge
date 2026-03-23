import { Request, Response, NextFunction } from 'express';
import { AppError } from './errorHandler.js';

export const notFound = (req: Request, res: Response, next: NextFunction) => {
  throw new AppError(`Route ${req.method} ${req.originalUrl} not found`, 404);
};
