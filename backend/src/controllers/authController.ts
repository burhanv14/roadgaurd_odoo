import jwt, { SignOptions } from 'jsonwebtoken';
import { Request, Response } from 'express';
import { Op } from 'sequelize';
import { User, Otp } from '../models';
import { ICreateUser, ILoginUser, IAuthenticatedRequest, IJwtPayload, UserRole } from '../types';
import { sendOtpEmail } from '../services/emailService';

// Generate JWT Token
const generateToken = (user: User): string => {
  const payload: IJwtPayload = {
    userId: user.id,
    email: user.email,
    phone: user.phone,
    role: user.role
  };

  const secret = process.env['JWT_SECRET'];
  if (!secret) {
    throw new Error('JWT_SECRET is not defined');
  }
  
  return jwt.sign(payload, secret, { expiresIn: '7d' });
};

// Send OTP via email
const sendOtp = async (phone: string, email: string, otpCode: string, userName: string): Promise<void> => {
  const expiryMinutes = parseInt(process.env['OTP_EXPIRY_MINUTES'] || '5', 10);
  
  // Send email OTP
  const emailSent = await sendOtpEmail(email, userName, otpCode, expiryMinutes);
  
  if (emailSent) {
    console.log(`📧 OTP email sent successfully to ${email}`);
  } else {
    console.error(`❌ Failed to send OTP email to ${email}`);
  }
  
  // For now, still log to console for phone (you can integrate SMS service later)
  console.log('\n📱 OTP NOTIFICATION:');
  console.log('====================');
  console.log(`📧 Email: ${email}`);
  console.log(`📱 Phone: ${phone}`);
  console.log(`🔐 OTP Code: ${otpCode}`);
  console.log(`⏰ Valid for: ${expiryMinutes} minutes`);
  console.log('====================\n');
};

// POST /auth/signup
const signup = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, phone, password, role }: ICreateUser = req.body;

    // Validate required fields
    if (!name || !email || !phone || !password) {
      res.status(400).json({
        success: false,
        message: 'Name, email, phone, and password are required.'
      });
      return;
    }

    // Validate role
    const validRoles = Object.values(UserRole);
    if (role && !validRoles.includes(role)) {
      res.status(400).json({
        success: false,
        message: 'Invalid role specified.'
      });
      return;
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [
          { email },
          { phone }
        ]
      }
    });

    if (existingUser) {
      res.status(409).json({
        success: false,
        message: 'User with this email or phone already exists.'
      });
      return;
    }

    // Create user with is_verified = false
    const user = await User.create({
      name,
      email,
      phone,
      password,
      role: role || UserRole.USER,
      is_verified: false
    });

    // Generate OTP
    const otpCode = Otp.generateOtpCode();
    const expiresAt = Otp.getExpiryTime(parseInt(process.env['OTP_EXPIRY_MINUTES'] || '5', 10));

    // Store OTP in database
    await Otp.create({
      user_id: user.id,
      otp_code: otpCode,
      purpose: 'VERIFICATION',
      expires_at: expiresAt,
      is_used: false
    });

    // Send OTP via email
    await sendOtp(phone, email, otpCode, name);

    res.status(201).json({
      success: true,
      message: 'User registered successfully. Please verify your account with the OTP sent to your email and phone.',
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          is_verified: user.is_verified
        }
      }
    });

  } catch (error) {
    console.error('Signup error:', error);
    
    const err = error as any;
    
    if (err.name === 'SequelizeValidationError') {
      res.status(400).json({
        success: false,
        message: 'Validation error.',
        errors: err.errors.map((e: any) => ({
          field: e.path,
          message: e.message
        }))
      });
      return;
    }

    if (err.name === 'SequelizeUniqueConstraintError') {
      res.status(409).json({
        success: false,
        message: 'Email or phone already exists.'
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error during signup.'
    });
  }
};

// POST /auth/verify-otp
const verifyOtp = async (req: Request, res: Response): Promise<void> => {
  try {
    const { identifier, otpCode }: { identifier: string; otpCode: string } = req.body;

    // Validate required fields
    if (!identifier || !otpCode) {
      res.status(400).json({
        success: false,
        message: 'Email/phone and OTP code are required.'
      });
      return;
    }

    // Find user by email or phone
    const user = await User.findOne({
      where: {
        [Op.or]: [
          { email: identifier },
          { phone: identifier }
        ]
      }
    });

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found.'
      });
      return;
    }

    // Find valid OTP
    const otp = await Otp.findOne({
      where: {
        user_id: user.id,
        otp_code: otpCode,
        is_used: false
      }
    });

    if (!otp) {
      res.status(400).json({
        success: false,
        message: 'Invalid OTP code.'
      });
      return;
    }

    // Check if OTP is expired
    if (otp.isExpired()) {
      // Delete expired OTP
      await otp.destroy();
      res.status(400).json({
        success: false,
        message: 'OTP has expired. Please request a new one.'
      });
      return;
    }

    // Mark user as verified
    await user.update({ is_verified: true });

    // Mark OTP as used
    await otp.update({ is_used: true });

    // Generate JWT token
    const token = generateToken(user);

    res.status(200).json({
      success: true,
      message: 'Account verified successfully.',
      data: {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          is_verified: true
        }
      }
    });

  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during OTP verification.'
    });
  }
};

// POST /auth/login
const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { identifier, password }: ILoginUser = req.body;

    // Validate required fields
    if (!identifier || !password) {
      res.status(400).json({
        success: false,
        message: 'Email/phone and password are required.'
      });
      return;
    }

    // Find user by email or phone
    const user = await User.findOne({
      where: {
        [Op.or]: [
          { email: identifier },
          { phone: identifier }
        ]
      }
    });

    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Invalid credentials.'
      });
      return;
    }

    // Verify password
    const isPasswordValid = await user.checkPassword(password);
    if (!isPasswordValid) {
      res.status(401).json({
        success: false,
        message: 'Invalid credentials.'
      });
      return;
    }

    // Check if user is verified
    if (!user.is_verified) {
      res.status(401).json({
        success: false,
        message: 'Please verify your account first.'
      });
      return;
    }

    // Generate JWT token
    const token = generateToken(user);

    res.status(200).json({
      success: true,
      message: 'Login successful.',
      data: {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          is_verified: user.is_verified
        }
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during login.'
    });
  }
};

// GET /auth/me (protected route)
const getMe = async (req: IAuthenticatedRequest, res: Response): Promise<void> => {
  try {
    // User info is already attached to req.user by authMiddleware
    res.status(200).json({
      success: true,
      message: 'User profile retrieved successfully.',
      data: {
        user: req.user
      }
    });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while fetching user profile.'
    });
  }
};

// POST /auth/resend-otp
const resendOtp = async (req: Request, res: Response): Promise<void> => {
  try {
    const { identifier }: { identifier: string } = req.body;

    // Validate required fields
    if (!identifier) {
      res.status(400).json({
        success: false,
        message: 'Email/phone is required.'
      });
      return;
    }

    // Find user by email or phone
    const user = await User.findOne({
      where: {
        [Op.or]: [
          { email: identifier },
          { phone: identifier }
        ]
      }
    });

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found.'
      });
      return;
    }

    // Check if user is already verified
    if (user.is_verified) {
      res.status(400).json({
        success: false,
        message: 'User is already verified.'
      });
      return;
    }

    // Delete any existing unused OTPs for this user
    await Otp.destroy({
      where: {
        user_id: user.id,
        is_used: false
      }
    });

    // Generate new OTP
    const otpCode = Otp.generateOtpCode();
    const expiresAt = Otp.getExpiryTime(parseInt(process.env['OTP_EXPIRY_MINUTES'] || '5', 10));

    // Store new OTP in database
    await Otp.create({
      user_id: user.id,
      otp_code: otpCode,
      purpose: 'VERIFICATION',
      expires_at: expiresAt,
      is_used: false
    });

    // Send new OTP via email
    await sendOtp(user.phone, user.email, otpCode, user.name);

    res.status(200).json({
      success: true,
      message: 'New OTP sent successfully to your email and phone.'
    });

  } catch (error) {
    console.error('Resend OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while resending OTP.'
    });
  }
};

export {
  signup,
  verifyOtp,
  login,
  getMe,
  resendOtp
};
