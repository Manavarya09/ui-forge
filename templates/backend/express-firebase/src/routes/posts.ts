import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { db } from '../index.js';
import { authenticate } from '../middleware/authenticate.js';
import { AppError } from '../middleware/errorHandler.js';

const router = Router();

router.get('/', authenticate, async (req, res, next) => {
  try {
    const snapshot = await db.collection('posts')
      .where('authorId', '==', req.user!.uid)
      .orderBy('createdAt', 'desc')
      .get();
    const posts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json({ success: true, data: posts });
  } catch (err) {
    next(err);
  }
});

router.get('/:id', authenticate, async (req, res, next) => {
  try {
    const postDoc = await db.collection('posts').doc(req.params.id).get();
    if (!postDoc.exists) throw new AppError('Post not found', 404);
    const post = postDoc.data();
    if (post?.authorId !== req.user!.uid) throw new AppError('Post not found', 404);
    res.json({ success: true, data: { id: postDoc.id, ...post } });
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

      const postData = {
        ...req.body,
        authorId: req.user!.uid,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const docRef = await db.collection('posts').add(postData);
      res.status(201).json({ success: true, data: { id: docRef.id, ...postData } });
    } catch (err) {
      next(err);
    }
  }
);

router.put('/:id', authenticate, async (req, res, next) => {
  try {
    const postDoc = await db.collection('posts').doc(req.params.id).get();
    if (!postDoc.exists) throw new AppError('Post not found', 404);
    const post = postDoc.data();
    if (post?.authorId !== req.user!.uid) throw new AppError('Post not found', 404);

    await db.collection('posts').doc(req.params.id).update({
      ...req.body,
      updatedAt: new Date(),
    });

    res.json({ success: true, message: 'Post updated' });
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', authenticate, async (req, res, next) => {
  try {
    const postDoc = await db.collection('posts').doc(req.params.id).get();
    if (!postDoc.exists) throw new AppError('Post not found', 404);
    const post = postDoc.data();
    if (post?.authorId !== req.user!.uid) throw new AppError('Post not found', 404);

    await db.collection('posts').doc(req.params.id).delete();
    res.json({ success: true, message: 'Post deleted' });
  } catch (err) {
    next(err);
  }
});

export default router;
