import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import db from '../db';

const router = Router();

router.post('/register', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const existingUser = await db('users').where({ email }).first();
    if (existingUser) {
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
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    (req.session as unknown as Record<string, unknown>).userId = user.id;
    console.log('Login success, session ID:', req.sessionID);
    console.log('Session after login:', req.session);

    res.json({ user: { id: user.id, email: user.email, createdAt: user.createdAt } });
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
  console.log('/me called, sessionID:', req.sessionID);
  console.log('Session data:', session);
  if (!session || !session.userId) {
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

export default router;
