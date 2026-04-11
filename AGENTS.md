# Weesha - Celebration Wishes App

## Project Structure

```
weesha/
├── frontend/          # React + Vite + TypeScript
│   ├── src/
│   │   ├── api/       # API client functions
│   │   ├── components/ # Reusable UI components
│   │   ├── pages/     # Route pages
│   │   ├── stores/    # Zustand state stores
│   │   └── types/     # TypeScript type definitions
│   └── .env           # API URL config (VITE_API_URL)
│
└── backend/           # Node.js + Express + TypeScript
    ├── src/
    │   ├── routes/    # API route handlers
    │   ├── middleware/ # Auth middleware
    │   └── db.ts       # Knex database connection
    ├── migrations/     # Knex database migrations
    └── .env           # SESSION_SECRET, PORT, FRONTEND_URL
```

## Commands

### Backend

```bash
cd backend
npm run dev        # Start dev server (ts-node)
npm run build      # Compile TypeScript
npm run migrate    # Run migrations
npm run migrate:rollback  # Rollback last migration
npm test          # Run unit/integration tests
```

### Frontend

```bash
cd frontend
npm run dev        # Start Vite dev server
npm run build      # Production build
npm run test:e2e  # Run Playwright E2E tests
```

## Database

- SQLite3 for MVP persistence
- Knex.js as query builder
- Tables: `users`, `celebrations`, `wishes`, `sessions`
- Sessions table created by connect-session-knex
- Migrations run with `npm run migrate`

## Authentication

- Session-based authentication with HTTP-only cookies
- Sessions stored in SQLite via connect-session-knex
- CORS configured for frontend URL with credentials
- Frontend uses `credentials: 'include'` for all API calls

## API Endpoints

### Auth

- `POST /api/auth/register` - Create account (email, password), sets session cookie
- `POST /api/auth/login` - Login, sets session cookie
- `POST /api/auth/logout` - Logout, destroys session
- `GET /api/auth/me` - Get current user (requires session)

### Celebrations (auth required for create)

- `POST /api/celebrations` - Create celebration (auth required)
- `GET /api/celebrations/:slug` - Get by slug (public)
- `GET /api/celebrations/:id/wishes` - Get wishes (public)
- `POST /api/celebrations/:id/confetti` - Add confetti (public)
- `GET /api/celebrations/:id/confetti` - Get confetti count (public)
- `GET /api/celebrations/user/my-celebrations` - Get user's celebrations (auth required)

### Wishes

- `POST /api/wishes` - Create wish (public, checks expiry)

### Upload

- `POST /api/upload` - Upload image file

## Key Features

- **Live Mode**: Before `expiresAt` - allows wishes and confetti
- **Memory Mode**: After `expiresAt` - read-only replay experience
- **Confetti**: Canvas-confetti library for celebration animations
- **Story-style UI**: Tap navigation through wishes with auto-play
- **Polling**: Wishes refetch every 5 seconds for real-time feel
