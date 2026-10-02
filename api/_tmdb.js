// api/_tmdb.js — shared TMDB fetch + Redis cache + Rate Limiter
import { Redis } from '@upstash/redis'

export const TMDB_BASE  = 'https://api.themoviedb.org/3'
export const ANIM_GENRE = 16   // Animation genre ID

// ── Redis singleton ────────────────────────────────────────────
let _redis = null
export function getRedis() {
  if (!_redis) {
    _redis = new Redis({
      url:   process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
  }
  return _redis
}

// ── Rate Limiter (sliding window via Redis INCR) ───────────────
/**
 * @param {string} ip        — client IP
 * @param {number} limit     — max requests per window
 * @param {number} windowSec — window size in seconds
 * @returns {{ allowed: boolean, remaining: number, resetIn: number }}
 */
export async function checkRateLimit(ip, limit = 30, windowSec = 10) {
  const safeIp = (ip || 'unknown').replace(/[^a-zA-Z0-9.:_-]/g, '_').slice(0, 64)
  const window = Math.floor(Date.now() / (windowSec * 1000))
  const key    = `rl:${safeIp}:${window}`

  try {
    const redis   = getRedis()
    const current = await redis.incr(key)
    if (current === 1) await redis.expire(key, windowSec + 1)

    const remaining = Math.max(0, limit - current)
    const resetIn   = windowSec - (Math.floor(Date.now() / 1000) % windowSec)
    return { allowed: current <= limit, remaining, resetIn, current }
  } catch {
    // Redis unavailable → fail open (don't block requests)
    return { allowed: true, remaining: limit, resetIn: windowSec }
  }
}

/**
 * Apply rate limit to a handler.
 * Returns true if request should be blocked (429 already sent).
 */
export async function applyRateLimit(req, res, limit = 30, windowSec = 10) {
  const ip = (
    req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
    req.headers['x-real-ip'] ||
    req.socket?.remoteAddress ||
    'unknown'
  )

  const { allowed, remaining, resetIn } = await checkRateLimit(ip, limit, windowSec)

  // Always set rate limit headers
  res.setHeader('X-RateLimit-Limit',     String(limit))
  res.setHeader('X-RateLimit-Remaining', String(remaining))
  res.setHeader('X-RateLimit-Reset',     String(Math.floor(Date.now() / 1000) + resetIn))

  if (!allowed) {
    res.setHeader('Retry-After', String(resetIn))
    res.status(429).json({
      error: 'Too many requests. Please slow down.',
      retryAfter: resetIn,
    })
    return true // blocked
  }

  return false // allowed
}

// ── TMDB Fetch with Redis cache ────────────────────────────────
/**
 * @param {string} endpoint — TMDB path e.g. '/movie/popular'
 * @param {Object} params   — extra query params (api_key added automatically)
 * @param {number} ttl      — Redis TTL in seconds
 */
export async function tmdbFetch(endpoint, params = {}, ttl = 3600) {
  const cacheKey = `tmdb:${endpoint}:${JSON.stringify(params)}`

  // Layer 2: Redis cache
  try {
    const cached = await getRedis().get(cacheKey)
    if (cached) return cached
  } catch { /* Redis miss — fall through */ }

  // Direct TMDB fetch
  const url = new URL(`${TMDB_BASE}${endpoint}`)
  url.searchParams.set('api_key',  process.env.TMDB_API_KEY)
  url.searchParams.set('language', 'en-US')
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null) url.searchParams.set(k, String(v))
  })

  const res = await fetch(url.toString())
  if (!res.ok) throw new Error(`TMDB ${res.status}: ${endpoint}`)
  const data = await res.json()

  // Store in Redis
  try {
    await getRedis().set(cacheKey, data, { ex: ttl })
  } catch { /* Redis write failed — still return data */ }

  return data
}

// ── Response helpers ───────────────────────────────────────────
export function json(res, data, status = 200) {
  res.setHeader('Content-Type',                'application/json')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods','GET,OPTIONS')
  res.status(status).json(data)
}

export function error(res, message, status = 500) {
  json(res, { error: message }, status)
}
