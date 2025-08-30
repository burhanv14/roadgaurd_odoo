import { Request } from 'express';

// User role enum
export enum UserRole {
  ADMIN = 'ADMIN',
  MECHANIC_OWNER = 'MECHANIC_OWNER',
  MECHANIC_EMPLOYEE = 'MECHANIC_EMPLOYEE',
  USER = 'USER'
}

// User interface
export interface IUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  role: UserRole;
  is_verified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// User creation payload
export interface ICreateUser {
  name: string;
  email: string;
  phone: string;
  password: string;
  role?: UserRole;
}

// User login payload
export interface ILoginUser {
  identifier: string;
  password: string;
}

// OTP interface
export interface IOtp {
  id: string;
  user_id: string;
  otp_code: string;
  purpose: 'VERIFICATION' | 'PASSWORD_RESET';
  expires_at: Date;
  is_used: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// JWT Payload
export interface IJwtPayload {
  userId: string;
  email: string;
  phone: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}

// API Response interface
export interface IApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  stack?: string;
}

// Extended Request interface with user
export interface IAuthenticatedRequest extends Request {
  user?: IJwtPayload;
}

// Database connection config
export interface IDatabaseConfig {
  username: string;
  password: string;
  database: string;
  host: string;
  port: number;
  dialect: 'postgres';
  logging: boolean;
}

// Environment variables
export interface IEnvConfig {
  NODE_ENV: string;
  PORT: string;
  DB_HOST: string;
  DB_PORT: string;
  DB_NAME: string;
  DB_USER: string;
  DB_PASSWORD: string;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
  FRONTEND_URL: string;
}
