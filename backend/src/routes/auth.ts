import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import db from '../db';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();

router.post('/register', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const existingUser = await db('users').where({ email }).first();
    if (existingUser) {
      if (existingUser.deletedAt) {
        await db('users').where({ id: existingUser.id }).update({ deletedAt: null, password: await bcrypt.hash(password, 10) });
        const user = await db('users').where({ id: existingUser.id }).first();
        (req.session as unknown as Record<string, unknown>).userId = user.id;
        return res.status(201).json({ user: { id: user.id, email: user.email, createdAt: user.createdAt }, restored: true });
      }
      return res.status(400).json({ error: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const [user] = await db('users').insert({
      email,
      password: hashedPassword
    }).returning(['id', 'email', 'createdAt']);

    (req.session as unknown as Record<string, unknown>).userId = user.id;

    res.status(201).json({ user });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await db('users').where({ email }).first();
    if (!user) {
      console.log(`[AUTH] User not found: ${email}`);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    let restored = false;
    
    if (user.deletedAt) {
      await db('users').where({ id: user.id }).update({ deletedAt: null });
      restored = true;
      console.log(`[AUTH] Account restored for user ${user.id}`);
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      console.log(`[AUTH] Invalid password for: ${email}`);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    (req.session as unknown as Record<string, unknown>).userId = user.id;
    
    console.log(`[AUTH] Login success for ${email}, userId: ${user.id}, sessionID: ${req.sessionID}`);
    console.log(`[AUTH] Cookie settings:`, req.session.cookie);

    res.json({ user: { id: user.id, email: user.email, createdAt: user.createdAt }, restored });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/logout', (req: Request, res: Response) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Logout failed' });
    }
    res.clearCookie('connect.sid');
    res.json({ success: true });
  });
});

router.get('/me', (req: Request, res: Response) => {
  const session = req.session as unknown as Record<string, unknown>;
  console.log(`[AUTH] /me called, sessionID: ${req.sessionID}, session:`, JSON.stringify(session));
  
  if (!session || !session.userId) {
    console.log(`[AUTH] /me - No session or userId`);
    return res.status(401).json({ error: 'Not authenticated' });
  }

  db('users').where({ id: session.userId }).first()
    .then((user) => {
      if (!user) {
        return res.status(401).json({ error: 'User not found' });
      }
      res.json({ user: { id: user.id, email: user.email, createdAt: user.createdAt } });
    })
    .catch((error) => {
      console.error('Get user error:', error);
      res.status(500).json({ error: 'Internal server error' });
    });
});

router.delete('/delete-account', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const deletedAt = new Date();
    
    await db('users').where({ id: userId }).update({ deletedAt });
    
    req.session.destroy((err) => {
      if (err) {
        console.error('Session destroy error:', err);
      }
      res.clearCookie('connect.sid');
      res.json({ success: true, deletedAt: deletedAt.toISOString() });
    });
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({ error: 'Failed to delete account' });
  }
});

export default router;
