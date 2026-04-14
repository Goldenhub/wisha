import { Request, Response, NextFunction } from 'express';
import db from '../db';

export interface AuthRequest extends Request {
  userId?: number;
}

export const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
  let session = req.session as unknown as Record<string, unknown>;
  
  if (!session || !session.userId) {
    const sessionToken = req.headers['x-session-token'] as string;
    if (sessionToken) {
      const storedSession = await db('sessions').where('sid', sessionToken).first();
      if (storedSession) {
        const sess = typeof storedSession.sess === 'string' ? JSON.parse(storedSession.sess) : storedSession.sess;
        if (sess?.userId) {
          session = sess;
          (req.session as unknown as Record<string, unknown>).userId = sess.userId;
        }
      }
    }
  }
  
  if (!session || !session.userId) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  req.userId = session.userId as number;
  next();
};
