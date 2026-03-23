import { Router } from 'express';
import { db } from '../index.js';
import { authenticate } from '../middleware/authenticate.js';
import { AppError } from '../middleware/errorHandler.js';

const router = Router();

router.get('/me', authenticate, async (req, res, next) => {
  try {
    const userDoc = await db.collection('users').doc(req.user!.uid).get();
    if (!userDoc.exists) throw new AppError('User not found', 404);
    res.json({ success: true, data: { id: userDoc.id, ...userDoc.data() } });
  } catch (err) {
    next(err);
  }
});

router.put('/me', authenticate, async (req, res, next) => {
  try {
    await db.collection('users').doc(req.user!.uid).update(req.body);
    const userDoc = await db.collection('users').doc(req.user!.uid).get();
    res.json({ success: true, data: { id: userDoc.id, ...userDoc.data() } });
  } catch (err) {
    next(err);
  }
});

export default router;
