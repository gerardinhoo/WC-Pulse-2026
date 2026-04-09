# WC Pulse 2026

A full-stack World Cup 2026 prediction app where users predict match scores, earn points, and compete on a leaderboard.

## Tech Stack

**Backend:** Node.js, Express 5, Prisma ORM, SQLite (better-sqlite3 adapter)
**Frontend:** React, TypeScript, Vite, Tailwind CSS (WIP)

## Project Structure

```
wc-pulse-2026/
├── server/
│   ├── src/
│   │   ├── index.js          # Express app entry point
│   │   ├── config.js         # Environment variables
│   │   ├── validators.js     # Zod validation schemas + middleware
│   │   └── services/
│   │       └── leaderboard.js # Points calculation logic
│   ├── routes/
│   │   ├── auth.js           # Register, login, profile
│   │   ├── predictions.js    # Create/update & list predictions
│   │   ├── leaderboard.js    # Ranked leaderboard
│   │   ├── matches.js        # Match listings with group filter
│   │   ├── teams.js          # Team listings
│   │   └── admin.js          # Admin-only match result updates
│   ├── middleware/
│   │   └── auth.js           # JWT verification middleware
│   ├── lib/
│   │   └── prisma.js         # Prisma client singleton
│   └── prisma/
│       ├── schema.prisma     # Database schema
│       └── seed.js           # Seed data (48 teams, 16 stadiums, 24 matches)
└── client/                   # React frontend (WIP)
```

## Getting Started

### Prerequisites

- Node.js >= 22 (see `server/.nvmrc`)
- npm

### Server Setup

```bash
cd server
nvm use
npm install
```

Create a `.env` file:

```env
PORT=5050
JWT_SECRET=your-secret-key-here
CORS_ORIGIN=http://localhost:5173
```

Run migrations and seed:

```bash
npx prisma migrate dev --schema prisma/schema.prisma
npx tsx prisma/seed.js
```

Start the dev server:

```bash
npm run dev
```

The API will be available at `http://localhost:5050/api`.

## API Endpoints

### Public

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/teams` | List all teams (optional `?group=A`) |
| GET | `/api/matches` | List matches (optional `?group=A&page=1&limit=20`) |
| GET | `/api/leaderboard` | Ranked leaderboard (`?page=1&limit=20`) |

### Auth

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Login, returns JWT |
| GET | `/api/auth/me` | Get current user profile (requires token) |

### Protected (requires JWT)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/predictions` | Create or update a prediction |
| GET | `/api/predictions/my` | List your predictions (`?page=1&limit=20`) |

### Admin (requires JWT + admin role)

| Method | Endpoint | Description |
|--------|----------|-------------|
| PATCH | `/api/admin/matches/:id/result` | Set match final score |

### Request/Response Examples

**Register:**
```json
POST /api/auth/register
{ "email": "user@example.com", "password": "password123", "displayName": "Player1" }
→ 201 { "message": "User created", "userId": 1 }
```

**Login:**
```json
POST /api/auth/login
{ "email": "user@example.com", "password": "password123" }
→ 200 { "token": "eyJhbG..." }
```

**Create Prediction:**
```json
POST /api/predictions  (Authorization: Bearer <token>)
{ "matchId": 1, "homeScore": 2, "awayScore": 1 }
```

**Paginated Response Format:**
```json
{
  "data": [...],
  "meta": { "page": 1, "limit": 20, "total": 24, "totalPages": 2 }
}
```

## Database Schema

**Models:** Team, Stadium, Match, User, Prediction

- **User** has `role` field (`"user"` or `"admin"`) and optional `displayName`
- **Prediction** has a unique constraint on `(userId, matchId)` — one prediction per user per match
- Predictions are rejected on matches that already have a result
- Indexes on `Match.date`, `Match.homeTeamId`, `Match.awayTeamId`, `Prediction.userId`

## Scoring

| Outcome | Points |
|---------|--------|
| Exact score match | 3 |
| Correct winner/draw | 1 |
| Wrong | 0 |

## Security

- JWT authentication with secrets from environment variables
- Passwords hashed with bcrypt (salt rounds: 10)
- Role-based access control for admin routes
- Input validation on all endpoints (Zod)
- Helmet for HTTP security headers
- Rate limiting on auth endpoints (20 req / 15 min)
- CORS restricted to configured origin
- Request body size limited to 10kb

## License

ISC
