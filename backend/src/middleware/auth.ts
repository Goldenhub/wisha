import { Request, Response, NextFunction } from 'express';

export interface AuthRequest extends Request {
  userId?: number;
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  const session = req.session as unknown as Record<string, unknown>;
  if (!session || !session.userId) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  req.userId = session.userId as number;
  next();
};
