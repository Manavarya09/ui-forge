import { Router } from 'express';
import { supabase } from '../index.js';
import { authenticate } from '../middleware/authenticate.js';
import { AppError } from '../middleware/errorHandler.js';

const router = Router();

router.get('/me', authenticate, async (req, res, next) => {
  try {
    const { data: user, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', req.user!.id)
      .single();

    if (error) throw new AppError('User not found', 404);
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
});

router.put('/me', authenticate, async (req, res, next) => {
  try {
    const { data: user, error } = await supabase
      .from('profiles')
      .update(req.body)
      .eq('id', req.user!.id)
      .select()
      .single();

    if (error) throw new AppError('Update failed', 400);
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
});

export default router;
