import { Router } from 'express';
import { pb } from '../index.js';
import { authenticate } from '../middleware/authenticate.js';
import { AppError } from '../middleware/errorHandler.js';

const router = Router();

router.get('/me', authenticate, async (req, res, next) => {
  try {
    const user = await pb.collection('users').getOne(req.user!.id);
    res.json({ success: true, data: user });
  } catch (err) {
    next(new AppError('User not found', 404));
  }
});

router.put('/me', authenticate, async (req, res, next) => {
  try {
    const user = await pb.collection('users').update(req.user!.id, req.body);
    res.json({ success: true, data: user });
  } catch (err) {
    next(new AppError('Update failed', 400));
  }
});

export default router;
