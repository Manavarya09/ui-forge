import { Router } from 'express';
import { pool } from '../config/database.js';
import { authenticate } from '../middleware/authenticate.js';

const router = Router();

router.get('/me', authenticate, async (req, res, next) => {
  try {
    const [users] = await pool.query('SELECT id, email, name, created_at FROM users WHERE id = ?', [req.user!.userId]);
    res.json({ success: true, data: (users as any[])[0] });
  } catch (err) {
    next(err);
  }
});

router.put('/me', authenticate, async (req, res, next) => {
  try {
    await pool.query('UPDATE users SET ? WHERE id = ?', [req.body, req.user!.userId]);
    res.json({ success: true, message: 'User updated' });
  } catch (err) {
    next(err);
  }
});

export default router;
