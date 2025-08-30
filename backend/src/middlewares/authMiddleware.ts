import jwt from 'jsonwebtoken';
import { Response, NextFunction } from 'express';
import { User } from '../models';
import { IJwtPayload, IAuthenticatedRequest } from '../types';

const authMiddleware = async (req: IAuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Get token from header
    const authHeader = req.header('Authorization');
    
    if (!authHeader) {
      res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
      return;
    }

    // Check if token starts with Bearer
    if (!authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        message: 'Access denied. Invalid token format.'
      });
      return;
    }

    // Extract token
    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
      return;
    }

    // Verify token
    const jwtSecret = process.env['JWT_SECRET'];
    if (!jwtSecret) {
      res.status(500).json({
        success: false,
        message: 'Server configuration error.'
      });
      return;
    }
    
    const decoded = jwt.verify(token, jwtSecret) as IJwtPayload;
    
    // Get user from database
    const user = await User.findByPk(decoded.userId);
    
    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Access denied. User not found.'
      });
      return;
    }

    if (!user.is_verified) {
      res.status(401).json({
        success: false,
        message: 'Access denied. Please verify your account first.'
      });
      return;
    }

    // Add user to request
    req.user = {
      userId: user.id,
      email: user.email,
      phone: user.phone,
      role: user.role
    };

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    
    const err = error as Error;
    
    if (err.name === 'JsonWebTokenError') {
      res.status(401).json({
        success: false,
        message: 'Access denied. Invalid token.'
      });
      return;
    }
    
    if (err.name === 'TokenExpiredError') {
      res.status(401).json({
        success: false,
        message: 'Access denied. Token expired.'
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error during authentication.'
    });
  }
};

export default authMiddleware;
