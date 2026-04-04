# ZyCode

A real-time competitive coding platform where users compete in timed contests, solve coding problems, and get instant feedback on submissions.

## Overview

ZyCode is a monorepo built with [Turborepo](https://turbo.build/) and [Bun](https://bun.sh/). It consists of four applications and shared packages:

```
blitz/
├── apps/
│   ├── web/       # Next.js frontend
│   ├── backend/   # Express REST API
│   ├── wss/       # WebSocket server
│   └── worker/    # Submission queue worker
└── packages/
    ├── db/        # Prisma client (PostgreSQL)
    ├── ui/        # Shared UI components (shadcn/ui)
    ├── zod/       # Shared Zod schemas
    ├── eslint-config/
    └── typescript-config/
```

## Architecture

```
Browser (Next.js)
    │
    ├──[HTTP]──▶ backend (Express :3001)
    │               └── auth, contest, submission routes
    │
    ├──[WS]────▶ wss (WebSocket :8080)
    │               └── real-time contest events
    │
    └── submission flow:
            backend → Redis queue → worker → Judge0 → wss → browser
```

- **Submissions** are pushed to a Redis list by the backend and polled by the worker.
- The **worker** runs each submission against test cases via [Judge0](https://judge0.com/) and publishes results back through the WebSocket server.
- The **WebSocket server** broadcasts events (correct answer, contest ended, winner) to all participants in a contest room.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16, React 19, Tailwind CSS v4, shadcn/ui, Framer Motion |
| Backend | Express 5, JWT auth |
| WebSocket | `ws` library |
| Worker | Redis (queue), Judge0 (code execution) |
| Database | PostgreSQL via Prisma ORM |
| Monorepo | Turborepo + Bun workspaces |
| Languages | TypeScript throughout |

## Prerequisites

- [Bun](https://bun.sh/) >= 1.3.5
- Node.js >= 18
- PostgreSQL database
- Redis instance
- Judge0 instance (self-hosted or cloud)

## Getting Started

**1. Clone and install dependencies**

```bash
git clone https://github.com/vignesh2731/Zycode.git
cd Zycode
bun install
```

**2. Configure environment variables**

Create `.env` files in the relevant apps:

`apps/backend/.env`
```env
DATABASE_URL=postgresql://user:password@localhost:5432/zycode
JWT_SECRET=your_jwt_secret
REDIS_URL=redis://localhost:6379
```

`apps/worker/.env`
```env
DATABASE_URL=postgresql://user:password@localhost:5432/zycode
JUDGE0_URL=http://localhost:2358
```

`packages/db/.env`
```env
DATABASE_URL=postgresql://user:password@localhost:5432/zycode
```

**3. Set up the database**

```bash
cd packages/db
bunx prisma migrate dev
```

**4. Run the development servers**

From the repo root:

```bash
bun run dev
```

This starts all apps in parallel via Turborepo:

| App | URL |
|---|---|
| Web | http://localhost:3000 |
| Backend | http://localhost:3001 |
| WebSocket | ws://localhost:8080 |
| Worker | (background process) |

## Supported Languages

Code submissions can be made in:

- C++
- Java
- Python

## Features

- User authentication (signup / login with JWT)
- Create and join coding contests
- Real-time updates: correct answers and contest end events are broadcast instantly to all participants
- Automatic winner determination based on number of problems solved
- Monaco editor for code input
