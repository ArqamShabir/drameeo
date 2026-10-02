// ──────────────────────────────────────────────────────────────
// localStorage cache with TTL — Layer 3 fallback cache.
// Used when Vercel functions are slow or Redis is cold.
// ──────────────────────────────────────────────────────────────

const PREFIX = 'drameeo_'

/**
 * Write a value to localStorage with an expiry timestamp.
 * @param {string} key
 * @param {any}    value  — must be JSON-serialisable
 * @param {number} ttlMs  — milliseconds until expiry  (default: 24h)
 */
export function setCached(key, value, ttlMs = 24 * 60 * 60 * 1000) {
  try {
    const item = { value, expiresAt: Date.now() + ttlMs }
    localStorage.setItem(PREFIX + key, JSON.stringify(item))
  } catch {
    // Storage quota exceeded — silently ignore
  }
}

/**
 * Read a value from localStorage.
 * Returns null if missing or expired.
 */
export function getCached(key) {
  try {
    const raw = localStorage.getItem(PREFIX + key)
    if (!raw) return null
    const { value, expiresAt } = JSON.parse(raw)
    if (Date.now() > expiresAt) {
      localStorage.removeItem(PREFIX + key)
      return null
    }
    return value
  } catch {
    return null
  }
}

/** Remove a specific key */
export function removeCached(key) {
  localStorage.removeItem(PREFIX + key)
}

/** Clear all drameeo cache entries */
export function clearCache() {
  Object.keys(localStorage)
    .filter(k => k.startsWith(PREFIX))
    .forEach(k => localStorage.removeItem(k))
}
