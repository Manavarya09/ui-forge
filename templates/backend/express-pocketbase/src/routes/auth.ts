import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { pb } from '../index.js';
import { authenticate } from '../middleware/authenticate.js';
import { AppError } from '../middleware/errorHandler.js';

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

      const record = await pb.collection('users').create({
        email,
        password,
        passwordConfirm: password,
        name,
      });

      const token = pb.collection('users').authWithPassword(email, password);

      res.status(201).json({
        success: true,
        data: {
          user: { id: record.id, email, name },
          token: (token as any).token,
        },
      });
    } catch (err: any) {
      if (err.status === 400 && err.data?.email) {
        next(new AppError('Email already registered', 400));
      } else {
        next(err);
      }
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

      const authData = await pb.collection('users').authWithPassword(email, password);

      res.json({
        success: true,
        data: {
          user: { id: authData.record.id, email: authData.record.email, name: authData.record.name },
          token: authData.token,
        },
      });
    } catch (err) {
      next(new AppError('Invalid credentials', 401));
    }
  }
);

router.post('/refresh', async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    pb.authStore.loadFromToken(refreshToken);

    if (!pb.authStore.isValid) {
      throw new AppError('Invalid refresh token', 401);
    }

    res.json({
      success: true,
      data: {
        token: pb.authStore.token,
        refreshToken: pb.authStore.token,
      },
    });
  } catch (err) {
    next(new AppError('Invalid refresh token', 401));
  }
});

router.post('/logout', authenticate, async (req, res, next) => {
  try {
    pb.authStore.clear();
    res.json({ success: true, message: 'Logged out successfully' });
  } catch (err) {
    next(err);
  }
});

export default router;
