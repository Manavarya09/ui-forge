import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { pb } from '../index.js';
import { authenticate } from '../middleware/authenticate.js';
import { AppError } from '../middleware/errorHandler.js';

const router = Router();

router.get('/', authenticate, async (req, res, next) => {
  try {
    const posts = await pb.collection('posts').getFullList({
      filter: `author_id="${req.user!.id}"`,
      sort: '-created',
    });
    res.json({ success: true, data: posts });
  } catch (err) {
    next(err);
  }
});

router.get('/:id', authenticate, async (req, res, next) => {
  try {
    const post = await pb.collection('posts').getOne(req.params.id);
    if (post.author_id !== req.user!.id) throw new AppError('Post not found', 404);
    res.json({ success: true, data: post });
  } catch (err: any) {
    if (err.status === 404) {
      next(new AppError('Post not found', 404));
    } else {
      next(err);
    }
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

      const post = await pb.collection('posts').create({
        ...req.body,
        author_id: req.user!.id,
      });

      res.status(201).json({ success: true, data: post });
    } catch (err) {
      next(err);
    }
  }
);

router.put('/:id', authenticate, async (req, res, next) => {
  try {
    const existing = await pb.collection('posts').getOne(req.params.id);
    if (existing.author_id !== req.user!.id) throw new AppError('Post not found', 404);

    const post = await pb.collection('posts').update(req.params.id, req.body);
    res.json({ success: true, message: 'Post updated' });
  } catch (err: any) {
    if (err.status === 404) {
      next(new AppError('Post not found', 404));
    } else {
      next(err);
    }
  }
});

router.delete('/:id', authenticate, async (req, res, next) => {
  try {
    const existing = await pb.collection('posts').getOne(req.params.id);
    if (existing.author_id !== req.user!.id) throw new AppError('Post not found', 404);

    await pb.collection('posts').delete(req.params.id);
    res.json({ success: true, message: 'Post deleted' });
  } catch (err: any) {
    if (err.status === 404) {
      next(new AppError('Post not found', 404));
    } else {
      next(err);
    }
  }
});

export default router;
