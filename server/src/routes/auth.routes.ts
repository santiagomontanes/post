import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../utils/prisma';
import { env } from '../config/env';
import { authGuard, roleGuard, type AuthRequest } from '../middleware/auth';

export const authRouter = Router();

authRouter.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(401).json({ message: 'Credenciales inválidas' });
  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return res.status(401).json({ message: 'Credenciales inválidas' });

  const token = jwt.sign({ id: user.id, role: user.role, name: user.name }, env.jwtSecret, { expiresIn: '10h' });
  return res.json({ token, user: { id: user.id, name: user.name, role: user.role } });
});

authRouter.post('/register', authGuard, roleGuard('ADMIN'), async (req: AuthRequest, res) => {
  const { name, email, password, role } = req.body;
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({ data: { name, email, passwordHash, role } });
  return res.status(201).json({ id: user.id, name: user.name, email: user.email, role: user.role });
});
