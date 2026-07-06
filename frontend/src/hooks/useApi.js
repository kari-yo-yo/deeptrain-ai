import { useState, useCallback } from 'react'
import { API_BASE_URL } from '../utils/constants'

const buildUrl = (endpoint) => {
  const base = API_BASE_URL.replace(/\/$/, '')
  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`
  return `${base}${path}`
}

export const useApi = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const request = useCallback(async (endpoint, options = {}) => {
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

  return { loading, error, request, get, post, del }
}

export default useApi
