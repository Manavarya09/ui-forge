import { Router } from 'express';
import { pool } from '../config/database.js';
import { authenticate } from '../middleware/authenticate.js';
import { AppError } from '../middleware/errorHandler.js';

const router = Router();

router.get('/', authenticate, async (req, res, next) => {
  try {
    const [posts] = await pool.query('SELECT * FROM posts WHERE author_id = ? ORDER BY created_at DESC', [req.user!.userId]);
    res.json({ success: true, data: posts });
  } catch (err) {
    next(err);
  }
});

router.post('/', authenticate, async (req, res, next) => {
  try {
    const { title, content, published } = req.body;
    const [result] = await pool.query('INSERT INTO posts (title, content, published, author_id) VALUES (?, ?, ?, ?)', [title, content, published || false, req.user!.userId]);
    res.status(201).json({ success: true, data: { id: (result as any).insertId, title, content, published } });
  } catch (err) {
    next(err);
  }
});

router.put('/:id', authenticate, async (req, res, next) => {
  try {
    const [result] = await pool.query('UPDATE posts SET ? WHERE id = ? AND author_id = ?', [req.body, req.params.id, req.user!.userId]);
    if (!(result as any).affectedRows) throw new AppError('Post not found', 404);
    res.json({ success: true, message: 'Post updated' });
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', authenticate, async (req, res, next) => {
  try {
    const [result] = await pool.query('DELETE FROM posts WHERE id = ? AND author_id = ?', [req.params.id, req.user!.userId]);
    if (!(result as any).affectedRows) throw new AppError('Post not found', 404);
    res.json({ success: true, message: 'Post deleted' });
  } catch (err) {
    next(err);
  }
});

export default router;
