import { Router } from 'express';
import { User } from '../models/User.js';
import { authenticate } from '../middleware/authenticate.js';
import { AppError } from '../middleware/errorHandler.js';

const router = Router();

router.get('/me', authenticate, async (req, res, next) => {
  try {
    const user = await User.findById(req.user!.userId).select('-password');
    if (!user) throw new AppError('User not found', 404);
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
});

router.put('/me', authenticate, async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.user!.userId, req.body, { new: true }).select('-password');
    if (!user) throw new AppError('User not found', 404);
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
});

export default router;
