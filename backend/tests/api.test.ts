import { describe, it, expect, beforeEach, jest, beforeAll, afterAll } from '@jest/globals';
import request from 'supertest';
import express from 'express';
import session from 'express-session';

interface MockDb {
  users: any[];
  celebrations: any[];
  wishes: any[];
  confetti_activations: any[];
  counter: { user: number; celebration: number; wish: number };
}

const mockDb: MockDb = {
  users: [],
  celebrations: [],
  wishes: [],
  confetti_activations: [],
  counter: { user: 0, celebration: 0, wish: 0 },
};

const resetDb = () => {
  mockDb.users = [];
  mockDb.celebrations = [];
  mockDb.wishes = [];
  mockDb.confetti_activations = [];
  mockDb.counter = { user: 0, celebration: 0, wish: 0 };
};

const createMockDb = () => {
  const chainable = {
    where: function(conditions: Record<string, any>) {
      return {
        first: () => Promise.resolve(mockDb.users.find((r: any) =>
          Object.entries(conditions).every(([k, v]) => r[k] === v)
        )),
        del: () => Promise.resolve(1),
        increment: (field: string, value: number) => {
          const item = mockDb.users.find((r: any) =>
            Object.entries(conditions).every(([k, v]) => r[k] === v)
          );
          if (item) item[field] = (item[field] || 0) + value;
          return Promise.resolve(1);
        },
      };
    },
    insert: (data: any) => {
      const id = mockDb.users.length + 1;
      const item = { ...data, id, createdAt: new Date().toISOString() };
      mockDb.users.push(item);
      return { returning: () => Promise.resolve([item]) };
    },
  };
  
  return ((table: string) => {
    const tableName = table as keyof MockDb;
    const result = {
      where: (conditions: Record<string, any>) => ({
        first: () => Promise.resolve((mockDb[tableName] as any[]).find((r: any) =>
          Object.entries(conditions).every(([k, v]) => r[k] === v)
        )),
        del: () => Promise.resolve(1),
        increment: (field: string, value: number) => {
          const item = (mockDb[tableName] as any[]).find((r: any) =>
            Object.entries(conditions).every(([k, v]) => r[k] === v)
          );
          if (item) item[field] = (item[field] || 0) + value;
          return Promise.resolve(1);
        },
      }),
      insert: (data: any) => {
        const id = (mockDb[tableName] as any[]).length + 1;
        const item = { ...data, id, createdAt: new Date().toISOString() };
        (mockDb[tableName] as any[]).push(item);
        return { returning: () => Promise.resolve([item]) };
      },
      orderBy: () => mockDb[tableName],
    };
    return result;
  }) as any;
};

jest.mock('../src/db', () => ({
  __esModule: true,
  default: createMockDb(),
}));

const app = express();
app.use(express.json());
app.use(session({
  secret: 'test-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false },
}));

import authRoutes from '../src/routes/auth';
import celebrationRoutes from '../src/routes/celebrations';
import wishRoutes from '../src/routes/wishes';

app.use('/api/auth', authRoutes);
app.use('/api/celebrations', celebrationRoutes);
app.use('/api/wishes', wishRoutes);

describe('Auth Routes', () => {
  beforeEach(() => {
    resetDb();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ email: 'test@example.com', password: 'password123' });

      expect(res.status).toBe(201);
      expect(res.body.user).toBeDefined();
      expect(res.body.user.email).toBe('test@example.com');
    });

    it('should return 400 if email is missing', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ password: 'password123' });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Email and password are required');
    });

    it('should return 400 if email already exists', async () => {
      await request(app)
        .post('/api/auth/register')
        .send({ email: 'test@example.com', password: 'password123' });

      const res = await request(app)
        .post('/api/auth/register')
        .send({ email: 'test@example.com', password: 'password123' });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Email already exists');
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      await request(app)
        .post('/api/auth/register')
        .send({ email: 'test@example.com', password: 'password123' });
    });

    it('should login with valid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'test@example.com', password: 'password123' });

      expect(res.status).toBe(200);
      expect(res.body.user).toBeDefined();
      expect(res.body.user.email).toBe('test@example.com');
    });

    it('should return 401 with invalid password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'test@example.com', password: 'wrongpassword' });

      expect(res.status).toBe(401);
      expect(res.body.error).toBe('Invalid credentials');
    });

    it('should return 401 with non-existent email', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'nonexistent@example.com', password: 'password123' });

      expect(res.status).toBe(401);
      expect(res.body.error).toBe('Invalid credentials');
    });
  });

  describe('GET /api/auth/me', () => {
    it('should return 401 if not authenticated', async () => {
      const res = await request(app).get('/api/auth/me');
      expect(res.status).toBe(401);
      expect(res.body.error).toBe('Not authenticated');
    });
  });

  describe('POST /api/auth/logout', () => {
    it('should logout successfully', async () => {
      const res = await request(app)
        .post('/api/auth/logout');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });
});

describe('Celebrations Routes', () => {
  let agent: ReturnType<typeof request.agent>;

  beforeEach(() => {
    resetDb();
    agent = request.agent(app);
  });

  describe('POST /api/celebrations', () => {
    it('should create a celebration when authenticated', async () => {
      await agent
        .post('/api/auth/register')
        .send({ email: 'test@example.com', password: 'password123' });

      const res = await agent
        .post('/api/celebrations')
        .send({
          title: 'Test Birthday',
          type: 'birthday',
          eventDate: '2024-12-25T10:00:00Z',
          expiresAt: '2024-12-26T10:00:00Z',
        });

      expect(res.status).toBe(201);
      expect(res.body.title).toBe('Test Birthday');
      expect(res.body.slug).toBeDefined();
    });

    it('should return 401 if not authenticated', async () => {
      const res = await request(app)
        .post('/api/celebrations')
        .send({
          title: 'Test Birthday',
          type: 'birthday',
          eventDate: '2024-12-25T10:00:00Z',
          expiresAt: '2024-12-26T10:00:00Z',
        });

      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/celebrations/:slug', () => {
    it('should get celebration by slug', async () => {
      mockDb.celebrations.push({
        id: 1,
        slug: 'test-celebration',
        title: 'Test Celebration',
        type: 'birthday',
        eventDate: '2024-12-25T10:00:00Z',
        expiresAt: '2024-12-26T10:00:00Z',
        confettiCount: 0,
      });

      const res = await request(app)
        .get('/api/celebrations/test-celebration');

      expect(res.status).toBe(200);
      expect(res.body.title).toBe('Test Celebration');
    });

    it('should return 404 if celebration not found', async () => {
      const res = await request(app)
        .get('/api/celebrations/nonexistent');

      expect(res.status).toBe(404);
    });
  });
});

describe('Wishes Routes', () => {
  beforeEach(() => {
    resetDb();
    mockDb.celebrations.push({
      id: 1,
      slug: 'test-celebration',
      title: 'Test Celebration',
      type: 'birthday',
      eventDate: '2024-12-25T10:00:00Z',
      expiresAt: '2099-12-26T10:00:00Z',
      confettiCount: 0,
    });
  });

  describe('POST /api/wishes', () => {
    it('should create a wish', async () => {
      const res = await request(app)
        .post('/api/wishes')
        .send({
          celebrationId: 1,
          name: 'John',
          message: 'Happy Birthday!',
        });

      expect(res.status).toBe(201);
      expect(res.body.name).toBe('John');
      expect(res.body.message).toBe('Happy Birthday!');
    });

    it('should create a wish without name', async () => {
      const res = await request(app)
        .post('/api/wishes')
        .send({
          celebrationId: 1,
          message: 'Happy Birthday!',
        });

      expect(res.status).toBe(201);
      expect(res.body.name).toBeNull();
    });

    it('should return 400 if message is missing', async () => {
      const res = await request(app)
        .post('/api/wishes')
        .send({
          celebrationId: 1,
          name: 'John',
        });

      expect(res.status).toBe(400);
    });
  });
});

describe('Confetti API', () => {
  beforeEach(() => {
    resetDb();
    mockDb.celebrations.push({
      id: 1,
      slug: 'test-celebration',
      title: 'Test Celebration',
      type: 'birthday',
      eventDate: '2024-12-25T10:00:00Z',
      expiresAt: '2099-12-26T10:00:00Z',
      confettiCount: 0,
    });
  });

  describe('POST /api/celebrations/:id/confetti', () => {
    it('should increment confetti count and return error on duplicate', async () => {
      const res1 = await request(app)
        .post('/api/celebrations/1/confetti')
        .send({ visitorId: 'test_visitor_456' });

      expect(res1.status).toBe(200);

      const res2 = await request(app)
        .post('/api/celebrations/1/confetti')
        .send({ visitorId: 'test_visitor_456' });

      expect(res2.status).toBe(400);
      expect(res2.body.error).toBe('You have already celebrated this creator!');
    });
  });

  describe('GET /api/celebrations/:id/confetti', () => {
    it('should get confetti count', async () => {
      const res = await request(app)
        .get('/api/celebrations/1/confetti');

      expect(res.status).toBe(200);
      expect(res.body.confettiCount).toBeDefined();
    });
  });
});
