import fs from 'fs';
import path from 'path';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { config } from '../config/index.js';

// Ensure local uploads directory exists
if (!fs.existsSync(config.uploadLocalPath)) {
  fs.mkdirSync(config.uploadLocalPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, config.uploadLocalPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = `${uuidv4()}${ext}`;
    cb(null, uniqueName);
  },
});

export const uploadMiddleware = multer({
  storage,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100 MB max
  },
  fileFilter: (req, file, cb) => {
    // Basic safety check for allowed media types
    const allowed = [
      'image/jpeg', 'image/png', 'image/webp', 'image/gif',
      'video/mp4', 'video/webm', 'video/quicktime',
      'audio/mpeg', 'audio/mp4', 'audio/ogg', 'audio/wav', 'audio/webm',
      'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/plain', 'application/zip'
    ];
    if (allowed.includes(file.mimetype) || file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/') || file.mimetype.startsWith('audio/')) {
      cb(null, true);
    } else {
      cb(new Error('Unsupported or unsafe file format'));
    }
  },
});

export class StorageService {
  static getFileUrl(filename: string): string {
    return `/uploads/${filename}`;
  }

  static async deleteFile(filename: string): Promise<boolean> {
    try {
      const filePath = path.join(config.uploadLocalPath, filename);
      if (fs.existsSync(filePath)) {
        await fs.promises.unlink(filePath);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }
}
