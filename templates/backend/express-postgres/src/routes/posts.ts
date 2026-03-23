import { Router } from 'express';
import { body, param, validationResult } from 'express-validator';
import prisma from '../config/prisma.js';
import { authenticate } from '../middleware/authenticate.js';
import { AppError } from '../middleware/errorHandler.js';

const router = Router();

router.get('/', authenticate, async (req, res, next) => {
  try {
    const posts = await prisma.post.findMany({
      where: { authorId: req.user!.userId },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ success: true, data: posts });
  } catch (err) {
    next(err);
  }
});

router.get('/:id', authenticate, async (req, res, next) => {
  try {
    const post = await prisma.post.findFirst({
      where: { id: req.params.id, authorId: req.user!.userId },
    });
    if (!post) throw new AppError('Post not found', 404);
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
      const post = await prisma.post.create({
        data: { ...req.body, authorId: req.user!.userId },
      });
      res.status(201).json({ success: true, data: post });
    } catch (err) {
      next(err);
    }
  }
);

router.put('/:id', authenticate, async (req, res, next) => {
  try {
    const post = await prisma.post.updateMany({
      where: { id: req.params.id, authorId: req.user!.userId },
      data: req.body,
    });
    if (!post.count) throw new AppError('Post not found', 404);
    res.json({ success: true, message: 'Post updated' });
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', authenticate, async (req, res, next) => {
  try {
    const post = await prisma.post.deleteMany({
      where: { id: req.params.id, authorId: req.user!.userId },
    });
    if (!post.count) throw new AppError('Post not found', 404);
    res.json({ success: true, message: 'Post deleted' });
  } catch (err) {
    next(err);
  }
});

export default router;
