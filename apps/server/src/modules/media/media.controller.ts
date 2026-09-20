import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../middleware/auth.middleware.js';
import { StorageService } from '../../services/storage.service.js';

export class MediaController {
  static async upload(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, error: 'No file uploaded' });
      }

      const fileUrl = StorageService.getFileUrl(req.file.filename);
      const isImage = req.file.mimetype.startsWith('image/');
      const isAudio = req.file.mimetype.startsWith('audio/');
      const isVideo = req.file.mimetype.startsWith('video/');

      // Synthesize realistic waveform data if audio
      const waveform = isAudio ? Array.from({ length: 40 }, () => Math.floor(Math.random() * 80 + 20)) : null;

      res.json({
        success: true,
        media: {
          fileUrl,
          thumbnailUrl: isImage ? fileUrl : undefined,
          fileName: req.file.originalname,
          fileSize: req.file.size,
          mimeType: req.file.mimetype,
          waveform,
          type: isImage ? 'IMAGE' : isVideo ? 'VIDEO' : isAudio ? 'AUDIO' : 'DOCUMENT',
        },
      });
    } catch (err) {
      next(err);
    }
  }
}
