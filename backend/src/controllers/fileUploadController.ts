import { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { IAuthenticatedRequest, IApiResponse } from '../types';

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
    cb(null, 'uploads/service-images/');
  },
  filename: (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
    const uniqueName = `${uuidv4()}-${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Check file type
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'));
  }
};

export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: fileFilter
});

class FileUploadController {
  // Upload single image
  static async uploadImage(req: IAuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authentication required'
        } as IApiResponse);
        return;
      }

      if (!req.file) {
        res.status(400).json({
          success: false,
          message: 'No file uploaded'
        } as IApiResponse);
        return;
      }

      const imageUrl = `/uploads/service-images/${req.file.filename}`;

      res.status(200).json({
        success: true,
        message: 'Image uploaded successfully',
        data: {
          imageUrl,
          filename: req.file.filename,
          originalName: req.file.originalname,
          size: req.file.size
        }
      } as IApiResponse);
    } catch (error: any) {
      console.error('Error uploading image:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to upload image',
        error: error.message
      } as IApiResponse);
    }
  }

  // Upload multiple images
  static async uploadMultipleImages(req: IAuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authentication required'
        } as IApiResponse);
        return;
      }

      if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
        res.status(400).json({
          success: false,
          message: 'No files uploaded'
        } as IApiResponse);
        return;
      }

      const uploadedFiles = req.files.map((file: Express.Multer.File) => ({
        imageUrl: `/uploads/service-images/${file.filename}`,
        filename: file.filename,
        originalName: file.originalname,
        size: file.size
      }));

      res.status(200).json({
        success: true,
        message: 'Images uploaded successfully',
        data: {
          images: uploadedFiles,
          count: uploadedFiles.length
        }
      } as IApiResponse);
    } catch (error: any) {
      console.error('Error uploading images:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to upload images',
        error: error.message
      } as IApiResponse);
    }
  }
}

export default FileUploadController;
