import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { supabase } from '../index.js';
import { authenticate } from '../middleware/authenticate.js';
import { AppError } from '../middleware/errorHandler.js';

const router = Router();

router.get('/', authenticate, async (req, res, next) => {
  try {
    const { data: posts, error } = await supabase
      .from('posts')
      .select('*')
      .eq('author_id', req.user!.id)
      .order('created_at', { ascending: false });

    if (error) throw new AppError('Failed to fetch posts', 400);
    res.json({ success: true, data: posts });
  } catch (err) {
    next(err);
  }
});

router.get('/:id', authenticate, async (req, res, next) => {
  try {
    const { data: post, error } = await supabase
      .from('posts')
      .select('*')
      .eq('id', req.params.id)
      .eq('author_id', req.user!.id)
      .single();

    if (error || !post) throw new AppError('Post not found', 404);
    res.json({ success: true, data: post });
  } catch (err) {
    next(err);
  }
});

router.post(
  '/',
  authenticate,
  [body('title').notEmpty(), body('content').optional()],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) throw new AppError('Validation failed', 400);

      const { data: post, error } = await supabase
        .from('posts')
        .insert({ ...req.body, author_id: req.user!.id })
        .select()
        .single();

      if (error) throw new AppError('Failed to create post', 400);
      res.status(201).json({ success: true, data: post });
    } catch (err) {
      next(err);
    }
  }
);

router.put('/:id', authenticate, async (req, res, next) => {
  try {
    const { data: post, error } = await supabase
      .from('posts')
      .update(req.body)
      .eq('id', req.params.id)
      .eq('author_id', req.user!.id)
      .select()
      .single();

    if (error || !post) throw new AppError('Post not found', 404);
    res.json({ success: true, message: 'Post updated' });
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', authenticate, async (req, res, next) => {
  try {
    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', req.params.id)
      .eq('author_id', req.user!.id);

    if (error) throw new AppError('Post not found', 404);
    res.json({ success: true, message: 'Post deleted' });
  } catch (err) {
    next(err);
  }
});

export default router;
