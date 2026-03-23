import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { generateTokens } from '../config/jwt.js';
import { authenticate } from '../middleware/authenticate.js';
import { AppError } from '../middleware/errorHandler.js';

const router = Router();

router.post('/register', async (req, res, next) => {
  try {
    const { email, password, name } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) throw new AppError('Email already registered', 400);
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({ email, password: hashedPassword, name });
    const tokens = generateTokens({ userId: user.id, email: user.email });
    res.status(201).json({ success: true, data: { user: { id: user.id, email: user.email, name: user.name }, ...tokens } });
  } catch (err) {
    next(err);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) throw new AppError('Invalid credentials', 401);
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) throw new AppError('Invalid credentials', 401);
    const tokens = generateTokens({ userId: user.id, email: user.email });
    res.json({ success: true, data: tokens });
  } catch (err) {
    next(err);
  }
});

router.post('/refresh', async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    // Simplified - in production validate refresh token from DB
    res.json({ success: true, message: 'Token refreshed' });
  } catch (err) {
    next(err);
  }
});

router.post('/logout', authenticate, async (req, res, next) => {
  res.json({ success: true, message: 'Logged out successfully' });
});

export default router;
