import api from './api'

// Simple in-memory cache: { [query]: { results, timestamp } }
const cache = new Map()
const CACHE_TTL = 30 * 1000 // 30 seconds

export const searchUsers = async (query) => {
  const trimmed = query.trim()
  if (trimmed.length < 2) return []

  const cached = cache.get(trimmed)
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.results
  }

  const response = await api.get('/users/search', { params: { q: trimmed } })
  const results = response.data.users || []

  cache.set(trimmed, { results, timestamp: Date.now() })

  return results
}
