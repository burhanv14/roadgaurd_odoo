import express from 'express';
import { signup, verifyOtp, login, getMe } from '../controllers/authController';
import authMiddleware from '../middlewares/authMiddleware';

const router = express.Router();

// Public routes
router.post('/signup', signup);
router.post('/verify-otp', verifyOtp);
router.post('/login', login);

// Protected routes
router.get('/me', authMiddleware, getMe);

export default router;
