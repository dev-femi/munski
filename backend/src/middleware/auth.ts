import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from './errorHandler';
import { CustomRequest } from '../types';

export const authenticate = (req: CustomRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new AppError(401, 'No authorization token provided');
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    throw new AppError(401, 'Invalid authorization header format');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    req.user = decoded as { id: string; email: string };
    next();
  } catch (error) {
    throw new AppError(401, 'Invalid or expired token');
  }
};

export const asyncHandler =
  (fn: (req: CustomRequest, res: Response, next: NextFunction) => Promise<void>) =>
  (req: CustomRequest, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
