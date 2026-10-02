// api/_tmdb.js — shared TMDB fetch helper for all API routes
import { Redis } from '@upstash/redis'

export const TMDB_BASE = 'https://api.themoviedb.org/3'
// Animation genre ID = 16
export const ANIM_GENRE = 16

/** Upstash Redis client (lazy singleton) */
let _redis = null
function getRedis() {
  if (!_redis) {
    _redis = new Redis({
      url:   process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
  }
  return _redis
}

/**
 * Fetch from TMDB with Redis caching.
 * @param {string} endpoint    — e.g. '/movie/popular'
 * @param {Object} params      — query params (excluding api_key)
 * @param {number} ttl         — Redis TTL in seconds (default: 1 hour)
 */
export async function tmdbFetch(endpoint, params = {}, ttl = 3600) {
  const cacheKey = `tmdb:${endpoint}:${JSON.stringify(params)}`

  // ── Layer 2: Redis cache ──────────────────────────────────────
  try {
    const redis  = getRedis()
    const cached = await redis.get(cacheKey)
    if (cached) return cached
  } catch {
    // Redis unavailable — fall through to TMDB
  }

  // ── Direct TMDB fetch ─────────────────────────────────────────
  const url = new URL(`${TMDB_BASE}${endpoint}`)
  url.searchParams.set('api_key', process.env.TMDB_API_KEY)
  url.searchParams.set('language', 'en-US')
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null) url.searchParams.set(k, String(v))
  })

  const res = await fetch(url.toString())
  if (!res.ok) throw new Error(`TMDB ${res.status}: ${endpoint}`)
  const data = await res.json()

  // ── Store in Redis ────────────────────────────────────────────
  try {
    const redis = getRedis()
    await redis.set(cacheKey, data, { ex: ttl })
  } catch {
    // Redis write failed — still return data
  }

  return data
}

/** Standard JSON response */
export function json(res, data, status = 200) {
  res.setHeader('Content-Type', 'application/json')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.status(status).json(data)
}

/** Standard error response */
export function error(res, message, status = 500) {
  json(res, { error: message }, status)
}
