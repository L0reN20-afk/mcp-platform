// Utility hooks per API calls MCP Platform
// Custom hooks React per integrare il frontend con le API backend

import React, { useState, useCallback } from 'react'
import type { 
  TrialDownloadResponse, 
  DeviceRegisterResponse, 
  TrialCheckResponse,
  AdminStatsResponse 
} from '@/types/database'

// Hook per download trial
export const useTrialDownload = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const downloadTrial = useCallback(async (email?: string): Promise<TrialDownloadResponse | null> => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/trial/download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          user_agent: navigator.userAgent,
          referrer: document.referrer || 'direct'
        })
      })

      const data: TrialDownloadResponse = await response.json()

      if (!data.success) {
        setError(data.error || 'Errore nel download')
        return null
      }

      return data
    } catch (err) {
      setError('Errore di connessione. Riprova tra qualche momento.')
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  return { downloadTrial, loading, error }
}

// Hook per newsletter subscription
export const useNewsletterSubscription = () => {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const subscribe = useCallback(async (email: string) => {
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email })
      })

      const data = await response.json()

      if (!data.success) {
        setError(data.error || 'Errore nell\'iscrizione')
        return false
      }

      setSuccess(true)
      return true
    } catch (err) {
      setError('Errore di connessione')
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const reset = useCallback(() => {
    setSuccess(false)
    setError(null)
  }, [])

  return { subscribe, loading, success, error, reset }
}

// Hook per admin stats (protetto)
export const useAdminStats = (apiKey: string) => {
  const [stats, setStats] = useState<AdminStatsResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = useCallback(async () => {
    if (!apiKey) {
      setError('API Key richiesta')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/admin/stats', {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
        }
      })

      const data = await response.json()

      if (!data.success) {
        setError(data.error || 'Errore nel caricamento statistiche')
        return
      }

      setStats(data.data)
    } catch (err) {
      setError('Errore di connessione admin')
    } finally {
      setLoading(false)
    }
  }, [apiKey])

  const refreshStats = useCallback(async () => {
    if (!apiKey) return

    try {
      const response = await fetch('/api/admin/stats', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
        }
      })

      const data = await response.json()
      if (data.success) {
        setStats(data.data)
      }
    } catch (err) {
      console.error('Error refreshing stats:', err)
    }
  }, [apiKey])

  return { stats, loading, error, fetchStats, refreshStats }
}

// Hook per gestione devices admin
export const useAdminDevices = (apiKey: string) => {
  const [devices, setDevices] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0
  })

  const fetchDevices = useCallback(async (page = 1, filters = {}) => {
    if (!apiKey) return

    setLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20',
        ...filters
      })

      const response = await fetch(`/api/admin/devices?${params}`, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
        }
      })

      const data = await response.json()

      if (!data.success) {
        setError(data.error || 'Errore nel caricamento devices')
        return
      }

      setDevices(data.data.devices)
      setPagination(data.data.pagination)
    } catch (err) {
      setError('Errore di connessione')
    } finally {
      setLoading(false)
    }
  }, [apiKey])

  const performDeviceAction = useCallback(async (
    action: 'ban' | 'unban' | 'extend_trial' | 'reset_trial',
    deviceFingerprint: string,
    data?: any
  ) => {
    if (!apiKey) return false

    try {
      const response = await fetch('/api/admin/devices', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action,
          device_fingerprint: deviceFingerprint,
          data
        })
      })

      const result = await response.json()
      return result.success
    } catch (err) {
      console.error('Error performing device action:', err)
      return false
    }
  }, [apiKey])

  return { 
    devices, 
    loading, 
    error, 
    pagination, 
    fetchDevices, 
    performDeviceAction 
  }
}

// Utility function per tracking eventi (analytics)
export const trackEvent = async (eventName: string, properties: Record<string, any> = {}) => {
  try {
    // Per ora log console, in futuro integrare con analytics service
    console.log(`[Analytics] ${eventName}:`, properties)
    
    // Possibile integrazione futura con Google Analytics, Mixpanel, etc.
    // gtag('event', eventName, properties)
  } catch (err) {
    console.error('Error tracking event:', err)
  }
}

