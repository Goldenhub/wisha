"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const supertest_1 = __importDefault(require("supertest"));
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const mockDb = {
    users: [],
    celebrations: [],
    wishes: [],
    counter: { user: 0, celebration: 0, wish: 0 },
};
const resetDb = () => {
    mockDb.users = [];
    mockDb.celebrations = [];
    mockDb.wishes = [];
    mockDb.counter = { user: 0, celebration: 0, wish: 0 };
};
const createMockDb = () => {
    const chainable = {
        where: function (conditions) {
            return {
                first: () => Promise.resolve(mockDb.users.find((r) => Object.entries(conditions).every(([k, v]) => r[k] === v))),
                del: () => Promise.resolve(1),
                increment: (field, value) => {
                    const item = mockDb.users.find((r) => Object.entries(conditions).every(([k, v]) => r[k] === v));
                    if (item)
                        item[field] = (item[field] || 0) + value;
                    return Promise.resolve(1);
                },
            };
        },
        insert: (data) => {
            const id = mockDb.users.length + 1;
            const item = { ...data, id, createdAt: new Date().toISOString() };
            mockDb.users.push(item);
            return { returning: () => Promise.resolve([item]) };
        },
    };
    return ((table) => {
        const tableName = table;
        const result = {
            where: (conditions) => ({
                first: () => Promise.resolve(mockDb[tableName].find((r) => Object.entries(conditions).every(([k, v]) => r[k] === v))),
                del: () => Promise.resolve(1),
                increment: (field, value) => {
                    const item = mockDb[tableName].find((r) => Object.entries(conditions).every(([k, v]) => r[k] === v));
                    if (item)
                        item[field] = (item[field] || 0) + value;
                    return Promise.resolve(1);
                },
            }),
            insert: (data) => {
                const id = mockDb[tableName].length + 1;
                const item = { ...data, id, createdAt: new Date().toISOString() };
                mockDb[tableName].push(item);
                return { returning: () => Promise.resolve([item]) };
            },
            orderBy: () => mockDb[tableName],
        };
        return result;
    });
};
globals_1.jest.mock('../src/db', () => ({
    __esModule: true,
    default: createMockDb(),
}));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, express_session_1.default)({
    secret: 'test-secret',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
}));
const auth_1 = __importDefault(require("../src/routes/auth"));
const celebrations_1 = __importDefault(require("../src/routes/celebrations"));
const wishes_1 = __importDefault(require("../src/routes/wishes"));
app.use('/api/auth', auth_1.default);
app.use('/api/celebrations', celebrations_1.default);
app.use('/api/wishes', wishes_1.default);
(0, globals_1.describe)('Auth Routes', () => {
    (0, globals_1.beforeEach)(() => {
        resetDb();
    });
    (0, globals_1.describe)('POST /api/auth/register', () => {
        (0, globals_1.it)('should register a new user', async () => {
            const res = await (0, supertest_1.default)(app)
                .post('/api/auth/register')
                .send({ email: 'test@example.com', password: 'password123' });
            (0, globals_1.expect)(res.status).toBe(201);
            (0, globals_1.expect)(res.body.user).toBeDefined();
            (0, globals_1.expect)(res.body.user.email).toBe('test@example.com');
        });
        (0, globals_1.it)('should return 400 if email is missing', async () => {
            const res = await (0, supertest_1.default)(app)
                .post('/api/auth/register')
                .send({ password: 'password123' });
            (0, globals_1.expect)(res.status).toBe(400);
            (0, globals_1.expect)(res.body.error).toBe('Email and password are required');
        });
        (0, globals_1.it)('should return 400 if email already exists', async () => {
            await (0, supertest_1.default)(app)
                .post('/api/auth/register')
                .send({ email: 'test@example.com', password: 'password123' });
            const res = await (0, supertest_1.default)(app)
                .post('/api/auth/register')
                .send({ email: 'test@example.com', password: 'password123' });
            (0, globals_1.expect)(res.status).toBe(400);
            (0, globals_1.expect)(res.body.error).toBe('Email already exists');
        });
    });
    (0, globals_1.describe)('POST /api/auth/login', () => {
        (0, globals_1.beforeEach)(async () => {
            await (0, supertest_1.default)(app)
                .post('/api/auth/register')
                .send({ email: 'test@example.com', password: 'password123' });
        });
        (0, globals_1.it)('should login with valid credentials', async () => {
            const res = await (0, supertest_1.default)(app)
                .post('/api/auth/login')
                .send({ email: 'test@example.com', password: 'password123' });
            (0, globals_1.expect)(res.status).toBe(200);
            (0, globals_1.expect)(res.body.user).toBeDefined();
            (0, globals_1.expect)(res.body.user.email).toBe('test@example.com');
        });
        (0, globals_1.it)('should return 401 with invalid password', async () => {
            const res = await (0, supertest_1.default)(app)
                .post('/api/auth/login')
                .send({ email: 'test@example.com', password: 'wrongpassword' });
            (0, globals_1.expect)(res.status).toBe(401);
            (0, globals_1.expect)(res.body.error).toBe('Invalid credentials');
        });
        (0, globals_1.it)('should return 401 with non-existent email', async () => {
            const res = await (0, supertest_1.default)(app)
                .post('/api/auth/login')
                .send({ email: 'nonexistent@example.com', password: 'password123' });
            (0, globals_1.expect)(res.status).toBe(401);
            (0, globals_1.expect)(res.body.error).toBe('Invalid credentials');
        });
    });
    (0, globals_1.describe)('GET /api/auth/me', () => {
        (0, globals_1.it)('should return 401 if not authenticated', async () => {
            const res = await (0, supertest_1.default)(app).get('/api/auth/me');
            (0, globals_1.expect)(res.status).toBe(401);
            (0, globals_1.expect)(res.body.error).toBe('Not authenticated');
        });
    });
    (0, globals_1.describe)('POST /api/auth/logout', () => {
        (0, globals_1.it)('should logout successfully', async () => {
            const res = await (0, supertest_1.default)(app)
                .post('/api/auth/logout');
            (0, globals_1.expect)(res.status).toBe(200);
            (0, globals_1.expect)(res.body.success).toBe(true);
        });
    });
});
(0, globals_1.describe)('Celebrations Routes', () => {
    let agent;
    (0, globals_1.beforeEach)(() => {
        resetDb();
        agent = supertest_1.default.agent(app);
    });
    (0, globals_1.describe)('POST /api/celebrations', () => {
        (0, globals_1.it)('should create a celebration when authenticated', async () => {
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
            (0, globals_1.expect)(res.status).toBe(201);
            (0, globals_1.expect)(res.body.title).toBe('Test Birthday');
            (0, globals_1.expect)(res.body.slug).toBeDefined();
        });
        (0, globals_1.it)('should return 401 if not authenticated', async () => {
            const res = await (0, supertest_1.default)(app)
                .post('/api/celebrations')
                .send({
                title: 'Test Birthday',
                type: 'birthday',
                eventDate: '2024-12-25T10:00:00Z',
                expiresAt: '2024-12-26T10:00:00Z',
            });
            (0, globals_1.expect)(res.status).toBe(401);
        });
    });
    (0, globals_1.describe)('GET /api/celebrations/:slug', () => {
        (0, globals_1.it)('should get celebration by slug', async () => {
            mockDb.celebrations.push({
                id: 1,
                slug: 'test-celebration',
                title: 'Test Celebration',
                type: 'birthday',
                eventDate: '2024-12-25T10:00:00Z',
                expiresAt: '2024-12-26T10:00:00Z',
                confettiCount: 0,
            });
            const res = await (0, supertest_1.default)(app)
                .get('/api/celebrations/test-celebration');
            (0, globals_1.expect)(res.status).toBe(200);
            (0, globals_1.expect)(res.body.title).toBe('Test Celebration');
        });
        (0, globals_1.it)('should return 404 if celebration not found', async () => {
            const res = await (0, supertest_1.default)(app)
                .get('/api/celebrations/nonexistent');
            (0, globals_1.expect)(res.status).toBe(404);
        });
    });
});
(0, globals_1.describe)('Wishes Routes', () => {
    (0, globals_1.beforeEach)(() => {
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
    (0, globals_1.describe)('POST /api/wishes', () => {
        (0, globals_1.it)('should create a wish', async () => {
            const res = await (0, supertest_1.default)(app)
                .post('/api/wishes')
                .send({
                celebrationId: 1,
                name: 'John',
                message: 'Happy Birthday!',
            });
            (0, globals_1.expect)(res.status).toBe(201);
            (0, globals_1.expect)(res.body.name).toBe('John');
            (0, globals_1.expect)(res.body.message).toBe('Happy Birthday!');
        });
        (0, globals_1.it)('should create a wish without name', async () => {
            const res = await (0, supertest_1.default)(app)
                .post('/api/wishes')
                .send({
                celebrationId: 1,
                message: 'Happy Birthday!',
            });
            (0, globals_1.expect)(res.status).toBe(201);
            (0, globals_1.expect)(res.body.name).toBeNull();
        });
        (0, globals_1.it)('should return 400 if message is missing', async () => {
            const res = await (0, supertest_1.default)(app)
                .post('/api/wishes')
                .send({
                celebrationId: 1,
                name: 'John',
            });
            (0, globals_1.expect)(res.status).toBe(400);
        });
    });
});
(0, globals_1.describe)('Confetti API', () => {
    (0, globals_1.beforeEach)(() => {
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
    (0, globals_1.describe)('POST /api/celebrations/:id/confetti', () => {
        (0, globals_1.it)('should increment confetti count', async () => {
            const res = await (0, supertest_1.default)(app)
                .post('/api/celebrations/1/confetti');
            (0, globals_1.expect)(res.status).toBe(200);
        });
    });
    (0, globals_1.describe)('GET /api/celebrations/:id/confetti', () => {
        (0, globals_1.it)('should get confetti count', async () => {
            const res = await (0, supertest_1.default)(app)
                .get('/api/celebrations/1/confetti');
            (0, globals_1.expect)(res.status).toBe(200);
            (0, globals_1.expect)(res.body.confettiCount).toBeDefined();
        });
    });
});
//# sourceMappingURL=api.test.js.map