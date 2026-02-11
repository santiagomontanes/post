import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';

export type AuthUser = { id: string; role: 'ADMIN' | 'SELLER'; name: string };

export interface AuthRequest extends Request {
  user?: AuthUser;
}

export const authGuard = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token requerido' });
  }

  const token = authHeader.replace('Bearer ', '');
  try {
    req.user = jwt.verify(token, env.jwtSecret) as AuthUser;
    return next();
  } catch {
    return res.status(401).json({ message: 'Token inválido' });
  }
};

export const roleGuard = (...roles: Array<'ADMIN' | 'SELLER'>) => (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) return res.status(401).json({ message: 'No autenticado' });
  if (!roles.includes(req.user.role)) return res.status(403).json({ message: 'Sin permiso' });
  return next();
};
