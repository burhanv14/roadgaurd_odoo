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
  user_id: string | null; // Nullable for pre-registration verification
  email: string; // Add email field for pre-registration verification
  otp_code: string;
  purpose: 'VERIFICATION' | 'PASSWORD_RESET' | 'EMAIL_VERIFICATION';
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

// Workshop interface
export interface IWorkshop {
  id: string;
  name: string;
  description: string;
  address: string;
  latitude: number;
  longitude: number;
  image_url: string | null;
  status: 'OPEN' | 'CLOSED';
  rating: number;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
}

// Workshop creation payload
export interface ICreateWorkshop {
  name: string;
  description: string;
  address: string;
  latitude: number;
  longitude: number;
  image_url?: string;
  status?: 'OPEN' | 'CLOSED';
}

// Workshop update payload
export interface IUpdateWorkshop {
  name?: string;
  description?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  image_url?: string;
  status?: 'OPEN' | 'CLOSED';
}

// Workshop query filters
export interface IWorkshopFilters {
  status?: 'OPEN' | 'CLOSED';
  latitude?: number;
  longitude?: number;
  radius?: number;
  search?: string;
  sort?: 'nearest' | 'mostRated' | 'newest' | 'oldest';
  page?: number;
  limit?: number;
}

// Service interface
export interface IService {
  id: string;
  workshop_id: string;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

// Service creation payload
export interface ICreateService {
  name: string;
  description: string;
}

// Review interface
export interface IReview {
  id: string;
  workshop_id: string;
  user_id: string;
  rating: number;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
}

// Review creation payload
export interface ICreateReview {
  rating: number;
  comment: string;
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
