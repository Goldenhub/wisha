import { Request, Response, NextFunction } from 'express';

export interface AuthRequest extends Request {
  userId?: number;
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  console.log(`[AUTH MW] sessionID: ${req.sessionID}, cookie: ${req.headers.cookie?.substring(0, 50)}`);
  const session = req.session as unknown as Record<string, unknown>;
  console.log(`[AUTH MW] session contents:`, JSON.stringify(session));
  
  if (!session || !session.userId) {
    console.log(`[AUTH MW] No session or userId found`);
    return res.status(401).json({ error: 'Not authenticated' });
  }

  req.userId = session.userId as number;
  console.log(`[AUTH MW] Authenticated userId: ${req.userId}`);
  next();
};
