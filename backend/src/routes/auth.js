const express = require('express');
const rateLimit = require('express-rate-limit');
const {
  signup,
  verifyEmail,
  login,
  resendOTP,
  forgotPassword,
  resetPassword,
  getProfile
} = require('../controllers/auth.controller');

const {
  validateSignup,
  validateLogin,
  validateOTP,
  validateEmail,
  validatePasswordReset
} = require('../middleware/validation');

const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// Rate limiting for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: {
    error: 'Too many authentication attempts, please try again later.'
  }
});

const otpLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 3, // limit each IP to 3 OTP requests per minute
  message: {
    error: 'Too many OTP requests, please try again later.'
  }
});

// Authentication routes
router.post('/signup', authLimiter, validateSignup, signup);
router.post('/verify-email', authLimiter, validateOTP, verifyEmail);
router.post('/login', authLimiter, validateLogin, login);
router.post('/resend-otp', otpLimiter, validateEmail, resendOTP);
router.post('/forgot-password', otpLimiter, validateEmail, forgotPassword);
router.post('/reset-password', authLimiter, validatePasswordReset, resetPassword);

// Protected routes
router.get('/profile', authMiddleware, getProfile);

// Health check for auth routes
router.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Auth routes are working',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
