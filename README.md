# 🎬 Drameeo — Animated Movies Platform

A full-stack animated movie discovery platform with YouTube trailer embeds, a content-based recommendation engine, and a 3-layer Redis caching strategy.

**Built with:** React 18 · Vite · Tailwind CSS · Framer Motion · Zustand · TanStack Query · Vercel Serverless · Upstash Redis · TMDB API

---

## 🚀 Getting Started

### 1. Clone & install
```bash
git clone https://github.com/YOUR_USERNAME/drameeo.git
cd drameeo
npm install
```

### 2. Set up environment variables
```bash
cp .env.example .env
```
Fill in `.env`:
- **TMDB_API_KEY** → [themoviedb.org/settings/api](https://www.themoviedb.org/settings/api)
- **UPSTASH_REDIS_REST_URL** + **UPSTASH_REDIS_REST_TOKEN** → [console.upstash.com](https://console.upstash.com)

### 3. Run locally (with Vercel CLI for API routes)
```bash
npm install -g vercel
vercel dev
```

Or frontend-only (API routes won't work without Vercel CLI):
```bash
npm run dev
```

---

## 📦 Deploy to Vercel

```bash
vercel deploy
```

Add your environment variables in the Vercel dashboard → Project Settings → Environment Variables.

---

## 🏗️ Architecture

```
Browser (React + TanStack Query)
    ↓ fetch /api/*
Vercel Serverless Functions
    ↓ check Redis
Upstash Redis (1h TTL)
    ↓ cache miss
TMDB API
```

### 3-Layer Caching
| Layer | Where | TTL |
|---|---|---|
| React Query | In-memory | 5 min |
| Upstash Redis | Server-side | 1h |
| localStorage | Client fallback | 24h |

---

## 🧠 Recommendation Engine

Content-based filtering — no ML required.

```
0 watched  → trending (cold start)
1-2 watched → top genre filter
3+ watched  → content-based scoring (genre overlap + popularity)
```

---

## 📁 Project Structure

```
drameeo/
├── api/              ← Vercel Serverless Functions
├── src/
│   ├── components/   ← UI + layout components
│   ├── pages/        ← Route pages
│   ├── hooks/        ← React Query hooks
│   ├── store/        ← Zustand global state
│   └── utils/        ← TMDB client, cache, recommender
└── public/           ← Static assets
```
