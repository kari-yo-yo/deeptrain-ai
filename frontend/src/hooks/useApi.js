import { useState, useCallback } from 'react'
import { API_BASE_URL } from '../utils/constants'
import { STATIC_TUTORIALS, STATIC_TERMS, MOCK_LOSS_DATA, MOCK_HISTOGRAM } from '../data/staticData'

const buildUrl = (endpoint) => {
  const base = API_BASE_URL.replace(/\/$/, '')
  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`
  return `${base}${path}`
}

// Static fallback for when no backend is available
const isStaticMode = !API_BASE_URL

const getStaticResponse = (endpoint) => {
  if (endpoint === '/api/tutorials') return STATIC_TUTORIALS
  if (endpoint === '/api/glossary') return STATIC_TERMS
  if (endpoint === '/api/agent/logs') return []
  if (endpoint === '/api/codes') return []
  if (endpoint === '/api/viz/histogram') return MOCK_HISTOGRAM
  if (endpoint.match(/^\/api\/viz\/metrics\//)) return { data: MOCK_LOSS_DATA }
  return null
}

export const useApi = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const request = useCallback(async (endpoint, options = {}) => {
    // Static fallback for GET requests
    if (isStaticMode && (!options.method || options.method === 'GET')) {
      const staticData = getStaticResponse(endpoint)
      if (staticData !== null) {
        setLoading(false)
        setError(null)
        return staticData
      }
      // No static data available
      setLoading(false)
      return []
    }

    setLoading(true)
    setError(null)
    try {
      const url = buildUrl(endpoint)
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      })
      
      if (!response.ok) {
        const errData = await response.json().catch(() => ({}))
        throw new Error(errData.detail || `HTTP ${response.status}: ${response.statusText}`)
      }
      
      const data = await response.json()
      return data
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const get = useCallback((endpoint) => request(endpoint, { method: 'GET' }), [request])
  const post = useCallback((endpoint, body) => request(endpoint, { method: 'POST', body: JSON.stringify(body) }), [request])
  const del = useCallback((endpoint) => request(endpoint, { method: 'DELETE' }), [request])

  return { loading, error, request, get, post, del, isStaticMode }
}

export default useApi
