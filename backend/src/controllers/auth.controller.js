const jwt = require('jsonwebtoken');
const { User, OTP } = require('../models');
const EmailService = require('../services/email.service');

const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

const signup = async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    
    if (existingUser) {
      if (existingUser.isVerified) {
        return res.status(400).json({ 
          error: 'User already exists with this email' 
        });
      } else {
        // User exists but not verified, update their info and resend OTP
        await existingUser.update({
          password,
          firstName,
          lastName
        });
        
        // Generate new OTP
        const otpRecord = await OTP.createEmailVerificationOTP(email);
        
        // Send OTP email
        await EmailService.sendOTPEmail(email, otpRecord.otp, 'email_verification');
        
        return res.status(200).json({
          message: 'Account updated. Please check your email for verification OTP.',
          email: email
        });
      }
    }

    // Create new user
    const user = await User.create({
      email,
      password,
      firstName,
      lastName
    });

    // Generate OTP
    const otpRecord = await OTP.createEmailVerificationOTP(email);

    // Send OTP email
    await EmailService.sendOTPEmail(email, otpRecord.otp, 'email_verification');

    res.status(201).json({
      message: 'User created successfully. Please check your email for verification OTP.',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        isVerified: user.isVerified
      }
    });

  } catch (error) {
    console.error('Signup error:', error);
    
    if (error.name === 'SequelizeValidationError') {
      const errors = error.errors.map(err => err.message);
      return res.status(400).json({ 
        error: 'Validation failed',
        details: errors 
      });
    }
    
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ 
        error: 'User already exists with this email' 
      });
    }
    
    res.status(500).json({ error: 'Internal server error' });
  }
};

const verifyEmail = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Find the OTP record
    const otpRecord = await OTP.findOne({
      where: {
        email,
        otp,
        type: 'email_verification',
        isUsed: false
      }
    });

    if (!otpRecord) {
      return res.status(400).json({ 
        error: 'Invalid or expired OTP' 
      });
    }

    // Check if OTP is expired
    if (new Date() > otpRecord.expiresAt) {
      return res.status(400).json({ 
        error: 'OTP has expired. Please request a new one.' 
      });
    }

    // Check attempt limit
    if (otpRecord.attempts >= 3) {
      return res.status(400).json({ 
        error: 'Too many attempts. Please request a new OTP.' 
      });
    }

    // Mark OTP as used
    await otpRecord.update({ isUsed: true });

    // Find and verify the user
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ 
        error: 'User not found' 
      });
    }

    // Mark user as verified
    await user.update({ isVerified: true });

    // Send welcome email
    await EmailService.sendWelcomeEmail(email, user.firstName);

    // Generate token
    const token = generateToken(user.id);

    res.status(200).json({
      message: 'Email verified successfully',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        isVerified: user.isVerified
      },
      token
    });

  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ 
        error: 'Invalid email or password' 
      });
    }

    // Check password
    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      return res.status(401).json({ 
        error: 'Invalid email or password' 
      });
    }

    // Check if email is verified
    if (!user.isVerified) {
      return res.status(401).json({ 
        error: 'Please verify your email before logging in' 
      });
    }

    // Update last login
    await user.update({ lastLogin: new Date() });

    // Generate token
    const token = generateToken(user.id);

    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        isVerified: user.isVerified,
        role: user.role,
        lastLogin: user.lastLogin
      },
      token
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const resendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if user exists
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ 
        error: 'User not found' 
      });
    }

    // Check if user is already verified
    if (user.isVerified) {
      return res.status(400).json({ 
        error: 'Email is already verified' 
      });
    }

    // Generate new OTP
    const otpRecord = await OTP.createEmailVerificationOTP(email);

    // Send OTP email
    await EmailService.sendOTPEmail(email, otpRecord.otp, 'email_verification');

    res.status(200).json({
      message: 'OTP sent successfully. Please check your email.'
    });

  } catch (error) {
    console.error('Resend OTP error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if user exists
    const user = await User.findOne({ where: { email } });
    if (!user) {
      // Don't reveal that user doesn't exist for security
      return res.status(200).json({
        message: 'If an account exists with this email, you will receive a password reset OTP.'
      });
    }

    // Check if user is verified
    if (!user.isVerified) {
      return res.status(400).json({ 
        error: 'Please verify your email first before resetting password' 
      });
    }

    // Generate password reset OTP
    const otpRecord = await OTP.createPasswordResetOTP(email);

    // Send OTP email
    await EmailService.sendOTPEmail(email, otpRecord.otp, 'password_reset');

    res.status(200).json({
      message: 'Password reset OTP sent to your email.'
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    // Find the OTP record
    const otpRecord = await OTP.findOne({
      where: {
        email,
        otp,
        type: 'password_reset',
        isUsed: false
      }
    });

    if (!otpRecord) {
      return res.status(400).json({ 
        error: 'Invalid or expired OTP' 
      });
    }

    // Check if OTP is expired
    if (new Date() > otpRecord.expiresAt) {
      return res.status(400).json({ 
        error: 'OTP has expired. Please request a new one.' 
      });
    }

    // Check attempt limit
    if (otpRecord.attempts >= 3) {
      return res.status(400).json({ 
        error: 'Too many attempts. Please request a new OTP.' 
      });
    }

    // Mark OTP as used
    await otpRecord.update({ isUsed: true });

    // Find and update user password
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ 
        error: 'User not found' 
      });
    }

    // Update password
    await user.update({ password: newPassword });

    res.status(200).json({
      message: 'Password reset successfully'
    });

  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getProfile = async (req, res) => {
  try {
    res.status(200).json({
      user: req.user
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  signup,
  verifyEmail,
  login,
  resendOTP,
  forgotPassword,
  resetPassword,
  getProfile
};
