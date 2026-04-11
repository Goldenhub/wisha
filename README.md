# Wisha - Celebration Wishes App

A beautiful, mobile-first celebration wishes application where users create time-bound celebration pages and visitors can leave wishes with images, emojis, and confetti reactions.

![Wisha Preview]

## Features

### For Celebration Creators
- **Create Celebrations**: Set up celebrations with title, type, and date
- **3-Day Wish Window**: Wishes automatically close 3 days after the event date
- **Real-time Updates**: See new wishes appear instantly via Server-Sent Events
- **Confetti Notifications**: Visual confetti bursts when visitors celebrate
- **Share Easily**: One-tap sharing with native Web Share API

### For Visitors
- **Leave Wishes**: Send heartfelt messages with photos and emojis
- **Celebrate**: Trigger confetti celebrations
- **Privacy**: Visitors only see their own wishes
- **One Celebration Per Creator**: You can only celebrate a creator once (not per event)

## Tech Stack

### Backend
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL with Knex.js query builder
- **Authentication**: Session-based with HTTP-only cookies
- **File Storage**: Cloudinary for image uploads
- **Real-time**: Server-Sent Events (SSE)

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v4
- **State Management**: Zustand
- **Data Fetching**: TanStack Query
- **Sharing**: Web Share API

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- PostgreSQL database
- Cloudinary account (for image uploads)

### Environment Setup

#### Backend

Create `backend/.env.local` for local development:

```env
PORT=3001
SESSION_SECRET=your-development-secret-key
FRONTEND_URL=http://localhost:5173
DB_HOST=localhost
DATABASE=wisha
USER=postgres
PASSWORD=your-password
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

#### Frontend

Create `frontend/.env.local` for local development:

```env
VITE_API_URL=http://localhost:3001
```

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/wisha.git
cd wisha

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Database Setup

```bash
cd backend
npm run migrate
```

### Running Development Servers

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

Visit http://localhost:5173

## Project Structure

```
wisha/
├── backend/
│   ├── src/
│   │   ├── routes/          # API route handlers
│   │   │   ├── auth.ts      # Authentication endpoints
│   │   │   ├── celebrations.ts  # Celebration CRUD & SSE
│   │   │   └── wishes.ts   # Wish creation with Cloudinary
│   │   ├── middleware/
│   │   │   └── auth.ts     # Session auth middleware
│   │   ├── db.ts           # Knex database connection
│   │   └── server.ts       # Express server setup
│   ├── migrations/          # Database schema migrations
│   └── tests/              # Jest unit tests
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── client.ts   # API client with visitorId tracking
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Route pages
│   │   │   ├── CelebrationPage.tsx  # Main celebration view
│   │   │   ├── Dashboard.tsx        # User's celebrations
│   │   │   └── CreateCelebration.tsx
│   │   ├── stores/         # Zustand state stores
│   │   └── types/          # TypeScript definitions
│   └── e2e/                # Playwright E2E tests
│
├── AGENTS.md               # AI agent instructions
└── README.md
```

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/logout` | Logout |
| GET | `/api/auth/me` | Get current user |

### Celebrations
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/celebrations` | Create celebration (auth required) |
| GET | `/api/celebrations/:slug` | Get by slug (public) |
| GET | `/api/celebrations/:id/wishes` | Get wishes |
| GET | `/api/celebrations/:id/wishes/stream` | SSE stream for wishes |
| POST | `/api/celebrations/:id/confetti` | Celebrate (one per creator) |
| GET | `/api/celebrations/user/my-celebrations` | Get user's celebrations |

### Wishes
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/wishes` | Create wish with optional image |

## Deployment

### Backend on Render

1. Create new Web Service on Render
2. Connect your GitHub repository
3. Set Root Directory: `backend`
4. Configure environment variables:
   ```
   NODE_ENV=production
   PORT=3001
   SESSION_SECRET=<generate-secure-random-string>
   FRONTEND_URL=https://your-frontend.vercel.app
   DB_HOST=<your-postgres-host>
   DATABASE=postgres
   USER=postgres
   PASSWORD=<your-password>
   CLOUDINARY_CLOUD_NAME=<your-cloud-name>
   CLOUDINARY_API_KEY=<your-api-key>
   CLOUDINARY_API_SECRET=<your-api-secret>
   ```
5. Build Command: `npm install && npm run build`
6. Start Command: `node dist/server.js`

### Frontend on Vercel

1. Import project on Vercel
2. Set Root Directory: `frontend`
3. Configure environment variable:
   ```
   VITE_API_URL=https://your-backend.onrender.com
   ```
4. Build Command: `npm run build`
5. Output Directory: `dist`

## How It Works

### Visitor Tracking
Visitors are tracked via a unique `visitorId` stored in localStorage. This allows:
- Visitors to see only their own wishes on a celebration page
- The system to ensure one confetti celebration per visitor per creator

### Confetti System
- Visitors can trigger confetti once per celebration creator (not per event)
- The celebration creator sees confetti bursts on the wish belonging to the visitor who celebrated
- Confetti is tracked in the database and broadcast via SSE to all connected viewers

### Real-time Updates
Server-Sent Events (SSE) provide real-time wish updates:
- New wishes appear instantly
- Confetti celebrations are broadcast to all viewers
- No polling required

## Testing

```bash
# Backend tests
cd backend
npm test

# Frontend E2E tests (requires running backend)
cd frontend
npm run test:e2e
```

## License

MIT License - feel free to use this project for your own celebrations!

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests
5. Submit a pull request

---

Built with ❤️ for celebrating life's special moments
