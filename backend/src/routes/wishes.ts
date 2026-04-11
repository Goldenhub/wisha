import { Router, Response } from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import db from '../db';
import { broadcastWish } from './celebrations';

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(file.originalname.toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Only image files are allowed'));
  }
});

router.post('/', upload.single('image'), async (req, res: Response) => {
  try {
    const { celebrationId, name, message, visitorId } = req.body;

    if (!celebrationId || !message) {
      return res.status(400).json({ error: 'CelebrationId and message are required' });
    }

    const celebration = await db('celebrations').where({ id: parseInt(celebrationId) }).first();
    if (!celebration) {
      return res.status(404).json({ error: 'Celebration not found' });
    }

    const now = new Date();
    const expiresAt = new Date(celebration.expiresAt);
    
    if (now > expiresAt) {
      return res.status(400).json({ error: 'Celebration has expired' });
    }

    let imageUrl: string | null = null;

    if (req.file) {
      const b64 = req.file.buffer.toString('base64');
      const dataUri = `data:${req.file.mimetype};base64,${b64}`;
      
      const result = await cloudinary.uploader.upload(dataUri, {
        folder: 'wisha',
      });
      imageUrl = result.secure_url;
    }

    const [wish] = await db('wishes').insert({
      celebrationId: parseInt(celebrationId),
      name: name || null,
      message,
      imageUrl,
      visitorId: visitorId || null
    }).returning('*');

    broadcastWish(parseInt(celebrationId), wish);

    res.status(201).json(wish);
  } catch (error) {
    console.error('Create wish error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
