import { Router, Response } from 'express';
import crypto from 'crypto';
import db from '../db';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();

const sseClients = new Map<number, Set<Response>>();

export function broadcastWish(celebrationId: number, wish: unknown) {
  const clients = sseClients.get(celebrationId);
  if (clients) {
    const data = `data: ${JSON.stringify(wish)}\n\n`;
    clients.forEach((res) => {
      res.write(data);
    });
  }
}

export function broadcastConfetti(celebrationId: number, visitorId: string, confettiCount: number) {
  const clients = sseClients.get(celebrationId);
  if (clients) {
    const event = { type: 'confetti', visitorId, confettiCount };
    const data = `data: ${JSON.stringify(event)}\n\n`;
    clients.forEach((res) => {
      res.write(data);
    });
  }
}

const generateSlug = () => {
  return crypto.randomBytes(6).toString('base64url');
};

router.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { title, type, eventDate, expiresAt, coverImage } = req.body;

    if (!title || !type || !eventDate || !expiresAt) {
      return res.status(400).json({ error: 'Title, type, eventDate, and expiresAt are required' });
    }

    let slug = generateSlug();
    while (await db('celebrations').where({ slug }).first()) {
      slug = generateSlug();
    }

    const [celebration] = await db('celebrations').insert({
      slug,
      title,
      type,
      eventDate,
      expiresAt,
      coverImage: coverImage || null,
      confettiCount: 0,
      userId: req.userId
    }).returning('*');

    res.status(201).json(celebration);
  } catch (error) {
    console.error('Create celebration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:id/wishes', async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    const { visitorId } = req.query;
    const userId = (req.session as { userId?: number })?.userId;

    const celebration = await db('celebrations').where({ id: parseInt(id) }).first();
    const isOwner = userId && celebration && celebration.userId === userId;

    let query = db('wishes')
      .where('celebrationId', parseInt(id))
      .orderBy('createdAt', 'asc');

    if (!isOwner && visitorId) {
      query = query.where('visitorId', visitorId as string);
    }

    const wishes = await query;
    res.json(wishes);
  } catch (error) {
    console.error('Get wishes error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:id/wishes/stream', async (req: AuthRequest, res: Response) => {
  const id = parseInt(req.params.id as string);
  
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('Access-Control-Allow-Origin', process.env.FRONTEND_URL || 'http://localhost:5173');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.flushHeaders();

  if (!sseClients.has(id)) {
    sseClients.set(id, new Set());
  }
  sseClients.get(id)!.add(res);

  res.on('close', () => {
    const clients = sseClients.get(id);
    if (clients) {
      clients.delete(res);
      if (clients.size === 0) {
        sseClients.delete(id);
      }
    }
  });
});

router.get('/:id/confetti', async (req, res) => {
  try {
    const { id } = req.params;
    const celebration = await db('celebrations').where({ id: parseInt(id) }).first();

    if (!celebration) {
      return res.status(404).json({ error: 'Celebration not found' });
    }

    res.json({ confettiCount: celebration.confettiCount });
  } catch (error) {
    console.error('Get confetti error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:id/confetti/activations', async (req, res) => {
  try {
    const { id } = req.params;
    const celebration = await db('celebrations').where({ id: parseInt(id) }).first();
    
    if (!celebration) {
      return res.status(404).json({ error: 'Celebration not found' });
    }

    const activations = await db('confetti_activations')
      .where({ userId: celebration.userId })
      .select('visitorId');

    res.json({ activations: activations.map((a: { visitorId: string }) => a.visitorId) });
  } catch (error) {
    console.error('Get confetti activations error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/:id/confetti', async (req, res) => {
  try {
    const { id } = req.params;
    const { visitorId } = req.body;

    if (!visitorId) {
      return res.status(400).json({ error: 'visitorId is required' });
    }

    const celebration = await db('celebrations').where({ id: parseInt(id) }).first();

    if (!celebration) {
      return res.status(404).json({ error: 'Celebration not found' });
    }

    const now = new Date();
    const expiresAt = new Date(celebration.expiresAt);
    
    if (now > expiresAt) {
      return res.status(400).json({ error: 'Celebration has expired' });
    }

    const existing = await db('confetti_activations')
      .where({ userId: celebration.userId, visitorId })
      .first();

    if (existing) {
      return res.status(400).json({ error: 'You have already celebrated this creator!' });
    }

    await db('confetti_activations').insert({
      userId: celebration.userId,
      visitorId,
    });

    await db('celebrations')
      .where({ id: parseInt(id) })
      .increment('confettiCount', 1);

    const updated = await db('celebrations').where({ id: parseInt(id) }).first();
    
    broadcastConfetti(parseInt(id), visitorId, updated?.confettiCount || 0);

    res.json({ confettiCount: updated?.confettiCount });
  } catch (error) {
    console.error('Add confetti error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:slug', async (req: AuthRequest, res: Response) => {
  try {
    const { slug } = req.params;
    const celebration = await db('celebrations').where({ slug }).first();

    if (!celebration) {
      return res.status(404).json({ error: 'Celebration not found' });
    }

    const userId = (req.session as { userId?: number })?.userId;
    const isOwner = userId && celebration.userId === userId;

    res.json({ ...celebration, isOwner: !!isOwner });
  } catch (error) {
    console.error('Get celebration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/user/my-celebrations', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const celebrations = await db('celebrations')
      .where({ userId })
      .orderBy('createdAt', 'desc');

    res.json(celebrations);
  } catch (error) {
    console.error('Get user celebrations error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
