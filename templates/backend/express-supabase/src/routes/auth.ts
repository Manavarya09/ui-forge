import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { supabase } from '../index.js';
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

      const { data: { user }, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name } },
      });

      if (error) throw new AppError(error.message, 400);

      const { data: { session } } = await supabase.auth.getSession();

      res.status(201).json({
        success: true,
        data: {
          user: { id: user?.id, email, name },
          token: session?.access_token,
        },
      });
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

      const { data: { user, session }, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw new AppError('Invalid credentials', 401);

      res.json({
        success: true,
        data: {
          user: { id: user?.id, email: user?.email, name: (user as any)?.user_metadata?.name },
          token: session?.access_token,
        },
      });
    } catch (err) {
      next(err);
    }
  }
);

router.post('/refresh', async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    const { data: { session }, error } = await supabase.auth.refreshSession({
      refresh_token: refreshToken,
    });

    if (error || !session) {
      throw new AppError('Invalid refresh token', 401);
    }

    res.json({
      success: true,
      data: {
        token: session.access_token,
        refreshToken: session.refresh_token,
      },
    });
  } catch (err) {
    next(err);
  }
});

router.post('/logout', authenticate, async (req, res, next) => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw new AppError('Logout failed', 400);
    res.json({ success: true, message: 'Logged out successfully' });
  } catch (err) {
    next(err);
  }
});

export default router;
