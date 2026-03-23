import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { auth, db } from '../index.js';
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

      const userRecord = await auth.createUser({
        email,
        password,
        displayName: name,
      });

      await db.collection('users').doc(userRecord.uid).set({
        email,
        name,
        createdAt: new Date(),
      });

      const token = await auth.createCustomToken(userRecord.uid);

      res.status(201).json({
        success: true,
        data: {
          user: { uid: userRecord.uid, email, name },
          token,
        },
      });
    } catch (err: any) {
      if (err.code === 'auth/email-already-exists') {
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

      const userRecord = await auth.getUserByEmail(email);
      const token = await auth.createCustomToken(userRecord.uid);

      res.json({
        success: true,
        data: {
          user: { uid: userRecord.uid, email: userRecord.email, name: userRecord.displayName },
          token,
        },
      });
    } catch (err) {
      next(new AppError('Invalid credentials', 401));
    }
  }
);

router.post('/refresh', async (req, res, next) => {
  try {
    const { uid } = req.body;
    const user = await auth.getUser(uid);
    const token = await auth.createCustomToken(uid);

    res.json({
      success: true,
      data: {
        user: { uid: user.uid, email: user.email, name: user.displayName },
        token,
      },
    });
  } catch (err) {
    next(new AppError('Invalid request', 400));
  }
});

router.post('/logout', authenticate, async (req, res, next) => {
  try {
    res.json({ success: true, message: 'Logged out successfully' });
  } catch (err) {
    next(err);
  }
});

export default router;
