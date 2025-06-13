'use client'

import { useState, useEffect } from 'react'

export default function LoginPage() {
  const [deviceFingerprint, setDeviceFingerprint] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [user, setUser] = useState<any>(null)

  // Genera device fingerprint al caricamento della pagina
  useEffect(() => {
    generateDeviceFingerprint()
  }, [])

  const generateDeviceFingerprint = async () => {
    try {
      // Simula il device fingerprinting simile al C#
      const components = [
        `CPU:${navigator.hardwareConcurrency || 'unknown'}`,
        `PLATFORM:${navigator.platform}`,
        `AGENT:${navigator.userAgent.slice(0, 50)}`,
        `LANG:${navigator.language}`,
        `TIMEZONE:${Intl.DateTimeFormat().resolvedOptions().timeZone}`,
        `SCREEN:${screen.width}x${screen.height}`,
        `MEMORY:${(navigator as any).deviceMemory || 'unknown'}`
      ]
      
      // Hash semplice (in produzione usare crypto API)
      const combined = components.join('|')
      const encoder = new TextEncoder()
      const data = encoder.encode(combined)
      const hashBuffer = await crypto.subtle.digest('SHA-256', data)
      const hashArray = Array.from(new Uint8Array(hashBuffer))
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
      
      setDeviceFingerprint(hashHex.toUpperCase())
    } catch (error) {
      console.error('Error generating fingerprint:', error)
      setDeviceFingerprint('FALLBACK_' + Math.random().toString(36).substring(2, 15))
    }
  }

  const handleOAuthLogin = async (provider: 'google' | 'microsoft' | 'apple') => {
    setIsLoading(true)
    setMessage(`Avvio login con ${provider}...`)
    
    try {
      // Simula login OAuth (in produzione integrare con provider reali)
      // Per ora, simula un login successful
      setTimeout(async () => {
        const mockUser = {
          email: `user@${provider === 'google' ? 'gmail.com' : provider === 'microsoft' ? 'outlook.com' : 'icloud.com'}`,
          name: 'User Test',
          provider: provider
        }
        
        setUser(mockUser)
        await registerDevice(mockUser.email, provider)
      }, 2000)
      
    } catch (error) {
      console.error('OAuth error:', error)
      setMessage('Errore durante il login. Riprova.')
      setIsLoading(false)
    }
  }

  const registerDevice = async (email: string, provider: string) => {
    try {
      const response = await fetch('/api/device/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          device_fingerprint: deviceFingerprint,
          user_email: email,
          auth_provider: provider,
          system_info: {
            os: navigator.platform,
            user_agent: navigator.userAgent,
            timestamp: new Date().toISOString()
          }
        })
      })

      const data = await response.json()
      
      if (data.success) {
        setMessage(`✅ Trial attivato con successo per ${email}!`)
        // Salva info localmente per debug
        if (typeof window !== 'undefined') {
          localStorage.setItem('mcp_trial_info', JSON.stringify({
            email,
            provider,
            expires: data.trial_expires,
            remaining_hours: data.trial_remaining_hours
          }))
        }
      } else {
        setMessage(`❌ Errore: ${data.error}`)
      }
    } catch (error) {
      console.error('Registration error:', error)
      setMessage('❌ Errore di connessione al server')
    } finally {
      setIsLoading(false)
    }
  }

  if (user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">✅</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Trial Attivato!
            </h1>
            <p className="text-gray-600">
              Il trial di 48 ore è stato attivato per:
            </p>
            <p className="font-semibold text-blue-600 mt-2">
              {user.email}
            </p>
          </div>

          <div className="bg-blue-50 rounded-lg p-4 mb-6 text-left">
            <h3 className="font-semibold text-blue-800 mb-2">📋 Prossimi passi:</h3>
            <ol className="text-sm text-blue-700 space-y-1">
              <li>1. ✅ Login completato</li>
              <li>2. ⏰ Trial 48h attivato</li>
              <li>3. 🔄 <strong>Riavvia il software FileSystem MCP</strong></li>
              <li>4. 🚀 Il sistema funzionerà normalmente</li>
            </ol>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-6">
            <p className="text-sm text-yellow-800">
              <strong>💡 Importante:</strong> Chiudi e riavvia il software MCP per applicare le modifiche.
            </p>
          </div>

          <div className="text-xs text-gray-500">
            <p>Device ID: {deviceFingerprint.substring(0, 12)}...</p>
            <p>Provider: {user.provider}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            FileSystem MCP
          </h1>
          <p className="text-gray-600">
            Accedi per attivare il trial di 48 ore
          </p>
        </div>

        {deviceFingerprint && (
          <div className="mb-6 p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">Device ID:</p>
            <p className="text-sm font-mono text-gray-700">
              {deviceFingerprint.substring(0, 16)}...
            </p>
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={() => handleOAuthLogin('google')}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 bg-red-500 text-white py-3 px-4 rounded-lg font-semibold hover:bg-red-600 transition-colors disabled:opacity-50"
          >
            🔍 Accedi con Google
          </button>

          <button
            onClick={() => handleOAuthLogin('microsoft')}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 bg-blue-500 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-600 transition-colors disabled:opacity-50"
          >
            🔷 Accedi con Microsoft
          </button>

          <button
            onClick={() => handleOAuthLogin('apple')}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 bg-black text-white py-3 px-4 rounded-lg font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            🍎 Accedi con Apple
          </button>
        </div>

        {message && (
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">{message}</p>
          </div>
        )}

        {isLoading && (
          <div className="mt-4 flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
            <span className="ml-2 text-sm text-gray-600">Caricamento...</span>
          </div>
        )}

        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">
            🛡️ Sicuro • ⏰ Trial 48 ore • 🔒 Device univoco
          </p>
        </div>
      </div>
    </div>
  )
}
