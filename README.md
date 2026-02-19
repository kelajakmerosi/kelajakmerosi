# Kelajak Merosi

Full-stack educational platform — **React + Vite** (client) and **Node.js / Express / MongoDB** (server).

## Project Structure

```
kelajakmerosi/
├── client/          # React + Vite + TypeScript frontend
│   ├── src/
│   │   ├── app/         # App entry, router, providers
│   │   ├── components/  # UI, feature, and layout components
│   │   ├── hooks/       # Custom React hooks
│   │   ├── pages/       # Route-level page components
│   │   ├── services/    # API service layer
│   │   ├── styles/      # Global CSS + design tokens
│   │   └── types/       # TypeScript type definitions
│   └── vite.config.ts
│
└── server/          # Node.js / Express REST API
    └── src/
        ├── config/        # DB connection
        ├── controllers/   # Route handlers
        ├── middleware/     # Auth + error middleware
        ├── models/        # Mongoose models
        └── routes/        # Express routers
```

## Getting Started

### Prerequisites
- Node.js ≥ 18
- MongoDB Atlas URI (or local instance)

### Install all dependencies
```bash
npm run install:all
```

### Configure environment
```bash
cp server/.env.example server/.env
# Edit server/.env — set MONGO_URI, JWT_SECRET, etc.
```

### Run in development (client + server concurrently)
```bash
npm install           # install concurrently at root
npm run dev
```

Or run independently:
```bash
npm run dev:client    # Vite on http://localhost:5173
npm run dev:server    # Express on http://localhost:5000
```

### Build for production
```bash
npm run build:client
```

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Get current user |
| GET | `/api/subjects` | List all subjects |
| GET | `/api/users/profile` | Get user profile |
| GET | `/api/users/progress` | Get user progress |
