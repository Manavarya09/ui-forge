import { Router } from 'express';
import { Post } from '../models/Post.js';
import { authenticate } from '../middleware/authenticate.js';
import { AppError } from '../middleware/errorHandler.js';

const router = Router();

router.get('/', authenticate, async (req, res, next) => {
  try {
    const posts = await Post.find({ authorId: req.user!.userId }).sort({ createdAt: -1 });
    res.json({ success: true, data: posts });
  } catch (err) {
    next(err);
  }
});

router.get('/:id', authenticate, async (req, res, next) => {
  try {
    const post = await Post.findOne({ _id: req.params.id, authorId: req.user!.userId });
    if (!post) throw new AppError('Post not found', 404);
    res.json({ success: true, data: post });
  } catch (err) {
    next(err);
  }
});

router.post('/', authenticate, async (req, res, next) => {
  try {
    const post = await Post.create({ ...req.body, authorId: req.user!.userId });
    res.status(201).json({ success: true, data: post });
  } catch (err) {
    next(err);
  }
});

router.put('/:id', authenticate, async (req, res, next) => {
  try {
    const post = await Post.findOneAndUpdate({ _id: req.params.id, authorId: req.user!.userId }, req.body, { new: true });
    if (!post) throw new AppError('Post not found', 404);
    res.json({ success: true, data: post });
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', authenticate, async (req, res, next) => {
  try {
    const post = await Post.findOneAndDelete({ _id: req.params.id, authorId: req.user!.userId });
    if (!post) throw new AppError('Post not found', 404);
    res.json({ success: true, message: 'Post deleted' });
  } catch (err) {
    next(err);
  }
});

export default router;
