# UW Abroad backend

Node + Express + TypeScript backend with a Postgres connection.

Quick start

1. Copy `.env.example` to `.env` and set `DATABASE_URL`.
2. Install dependencies:

```bash
npm install
```

3. Run in development (auto-restarts on change):

```bash
npm run dev
```

Endpoints

- `GET /health` — basic health check
- `GET /db-time` — queries Postgres with `SELECT NOW()` and returns the DB time

Running with Docker (recommended for local DB)

1. Start Postgres via docker-compose (this will create DB and run `db/init.sql`):

```bash
cd backend
docker compose up -d
```

2. Use the following DATABASE_URL in `.env`:

```
DATABASE_URL=postgres://uwabroad:uwabroadpass@localhost:5433/uwabroad
DB_SSL=false
```

3. Then run the server (in another terminal):

```bash
npm run dev
```

API endpoints (MVP)

- `POST /profiles` — create a profile (JSON body)
- `GET /profiles` — list profiles with optional query filters: university, city, term, language, min_budget, max_budget, limit, offset
- `GET /profiles/:id` — get profile and its posts
- `PATCH /profiles/:id` — partial update a profile
- `POST /profiles/:id/posts` — create a post for a profile
- `GET /posts` — list posts, optional filters by university/city/term

Notes

- If your Postgres requires SSL (e.g., some managed hosts), set `DB_SSL=true` in `.env`.
