import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError, asyncHandler } from './errorHandler.js';

interface AuthRequest extends Request {
  user?: any;
}

export const protect = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  let token;

  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies?.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    throw new AppError(401, 'Não autorizado. Por favor, faça login');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || '');
    req.user = decoded;
    next();
  } catch (error) {
    throw new AppError(401, 'Token inválido ou expirado');
  }
});

export const authorize = (...roles: string[]) => {
  return asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new AppError(401, 'Não autorizado');
    }

    if (!roles.includes(req.user.role)) {
      throw new AppError(403, 'Acesso negado');
    }

    next();
  });
};