import express from 'express';
import { signup, verifyOtp, login, getMe, resendOtp } from '../controllers/authController';
import authMiddleware from '../middlewares/authMiddleware';
import { testEmailConfiguration } from '../services/emailService';

const router = express.Router();

// Test email configuration route
router.get('/test-email', async (req, res) => {
  try {
    const isValid = await testEmailConfiguration();
    if (isValid) {
      res.status(200).json({
        success: true,
        message: 'Email configuration is valid and ready to use.'
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Email configuration is invalid. Please check your environment variables.'
      });
    }
  } catch (error) {
    console.error('Email test error:', error);
    res.status(500).json({
      success: false,
      message: 'Error testing email configuration.'
    });
  }
});

// Public routes
router.post('/signup', signup);
router.post('/verify-otp', verifyOtp);
router.post('/login', login);
router.post('/resend-otp', resendOtp);

// Protected routes
router.get('/me', authMiddleware, getMe);

export default router;
