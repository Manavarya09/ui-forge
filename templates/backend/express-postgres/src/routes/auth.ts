import { Router } from 'express';
import { body, param, validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import prisma from '../config/prisma.js';
import { generateTokens } from '../config/jwt.js';
import { AppError } from '../middleware/errorHandler.js';
import { authenticate } from '../middleware/authenticate.js';

const router = Router();

router.post(
  '/register',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 8 }),
    body('name').optional().isString(),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new AppError('Validation failed', 400);
      }

      const { email, password, name } = req.body;

      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        throw new AppError('Email already registered', 400);
      }

      const hashedPassword = await bcrypt.hash(password, 12);

      const user = await prisma.user.create({
        data: { email, password: hashedPassword, name },
        select: { id: true, email: true, name: true, createdAt: true },
      });

      const tokens = generateTokens({ userId: user.id, email: user.email });

      await prisma.token.create({
        data: { token: tokens.refreshToken, type: 'REFRESH', expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), userId: user.id },
      });

      res.status(201).json({ success: true, data: { user, ...tokens } });
    } catch (err) {
      next(err);
    }
  }
);

router.post(
  '/login',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').isString(),
  ],
  async (req, res, next) => {
    try {
      const { email, password } = req.body;

      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        throw new AppError('Invalid credentials', 401);
      }

      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        throw new AppError('Invalid credentials', 401);
      }

      const tokens = generateTokens({ userId: user.id, email: user.email });

      await prisma.token.create({
        data: { token: tokens.refreshToken, type: 'REFRESH', expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), userId: user.id },
      });

      res.json({ success: true, data: tokens });
    } catch (err) {
      next(err);
    }
  }
);

router.post('/refresh', async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    const tokenRecord = await prisma.token.findFirst({
      where: { token: refreshToken, type: 'REFRESH', blacklisted: false },
    });

    if (!tokenRecord || tokenRecord.expires < new Date()) {
      throw new AppError('Invalid refresh token', 401);
    }

    const user = await prisma.user.findUnique({ where: { id: tokenRecord.userId } });
    if (!user) {
      throw new AppError('User not found', 404);
    }

    await prisma.token.update({ where: { id: tokenRecord.id }, data: { blacklisted: true } });

    const tokens = generateTokens({ userId: user.id, email: user.email });

    await prisma.token.create({
      data: { token: tokens.refreshToken, type: 'REFRESH', expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), userId: user.id },
    });

    res.json({ success: true, data: tokens });
  } catch (err) {
    next(err);
  }
});

router.post('/logout', authenticate, async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (refreshToken) {
      await prisma.token.updateMany({
        where: { token: refreshToken },
        data: { blacklisted: true },
      });
    }
    res.json({ success: true, message: 'Logged out successfully' });
  } catch (err) {
    next(err);
  }
});

export default router;
