'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Clock, Check, Shield, Loader2 } from 'lucide-react'

interface TrialModalProps {
  isOpen: boolean
  onClose: () => void
}

interface TrialResult {
  success: boolean
  email?: string
  provider?: string
  trialExpires?: string
  remainingHours?: number
  error?: string
}

export default function TrialModal({ isOpen, onClose }: TrialModalProps) {
  const [deviceFingerprint, setDeviceFingerprint] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null)
  const [trialResult, setTrialResult] = useState<TrialResult | null>(null)

  useEffect(() => {
    if (isOpen) {
      generateDeviceFingerprint()
      
      // 🔧 FIX: Calcola larghezza scrollbar per evitare layout shift
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
      document.documentElement.style.setProperty('--scrollbar-width', `${scrollbarWidth}px`)
      
      // 🎯 FIX: Usa classe CSS invece di style diretto per gestione consistente
      document.body.classList.add('modal-open')
    } else {
      // 🎯 FIX: Ripristino pulito via classe
      document.body.classList.remove('modal-open')
      document.documentElement.style.removeProperty('--scrollbar-width')
    }

    return () => {
      // 🔒 SAFETY: Cleanup sempre garantito
      document.body.classList.remove('modal-open')
      document.documentElement.style.removeProperty('--scrollbar-width')
    }
  }, [isOpen])

  const generateDeviceFingerprint = async () => {
    try {
      const components = [
        `CPU:${navigator.hardwareConcurrency || 'unknown'}`,
        `PLATFORM:${navigator.platform}`,
        `AGENT:${navigator.userAgent.slice(0, 50)}`,
        `LANG:${navigator.language}`,
        `TIMEZONE:${Intl.DateTimeFormat().resolvedOptions().timeZone}`,
        `SCREEN:${screen.width}x${screen.height}`,
        `MEMORY:${(navigator as any).deviceMemory || 'unknown'}`
      ]
      
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

  const handleOAuthLogin = async (provider: 'google' | 'microsoft') => {
    setIsLoading(true)
    setLoadingProvider(provider)
    
    try {
      // Configurazioni OAuth 2.0 REALI
      const oauthConfigs = {
        google: {
          clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '',
          authUrl: 'https://accounts.google.com/oauth/authorize',
          scope: 'openid email profile'
        },
        microsoft: {
          clientId: process.env.NEXT_PUBLIC_MICROSOFT_CLIENT_ID || '',
          authUrl: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
          scope: 'openid email profile'
        }
      }

      const config = oauthConfigs[provider]
      
      // Genera state e nonce per sicurezza
      const state = generateRandomString(32)
      const nonce = generateRandomString(32)
      
      // Salva state per verifica
      sessionStorage.setItem('oauth_state', state)
      sessionStorage.setItem('oauth_nonce', nonce)
      sessionStorage.setItem('oauth_provider', provider)
      sessionStorage.setItem('device_fingerprint', deviceFingerprint)

      // Parametri OAuth 2.0
      const params = new URLSearchParams({
        client_id: config.clientId,
        response_type: 'code',
        scope: config.scope,
        redirect_uri: `${window.location.origin}/api/auth/callback/${provider}`,
        state: state,
        nonce: nonce
      })

      // Apri popup OAuth (migliore UX di redirect)
      const popup = window.open(
        `${config.authUrl}?${params}`,
        'oauth-popup',
        'width=500,height=600,scrollbars=yes,resizable=yes,centerscreen=yes'
      )

      if (!popup) {
        throw new Error('Popup bloccato. Abilita i popup per questo sito.')
      }

      // Monitora il popup
      const checkClosed = setInterval(() => {
        if (popup.closed) {
          clearInterval(checkClosed)
          setIsLoading(false)
          setLoadingProvider(null)
        }
      }, 1000)

      // Ascolta messaggio di successo dal popup
      const messageHandler = (event: MessageEvent) => {
        if (event.origin !== window.location.origin) return
        
        if (event.data.type === 'oauth-success') {
          clearInterval(checkClosed)
          popup.close()
          handleAuthSuccess(event.data)
          window.removeEventListener('message', messageHandler)
        } else if (event.data.type === 'oauth-error') {
          clearInterval(checkClosed)
          popup.close()
          handleAuthError(event.data.error)
          window.removeEventListener('message', messageHandler)
        }
      }

      window.addEventListener('message', messageHandler)

    } catch (error) {
      console.error('OAuth error:', error)
      setTrialResult({
        success: false,
        error: error instanceof Error ? error.message : 'Errore durante la autenticazione'
      })
      setIsLoading(false)
      setLoadingProvider(null)
    }
  }

  const handleAuthSuccess = async (data: any) => {
    try {
      // Registra il device con i dati OAuth
      const response = await fetch('/api/device/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          device_fingerprint: deviceFingerprint,
          user_email: data.email,
          auth_provider: data.provider,
          access_token: data.access_token,
          system_info: {
            os: navigator.platform,
            user_agent: navigator.userAgent,
            timestamp: new Date().toISOString()
          }
        })
      })

      const result = await response.json()

      if (result.success) {
        setTrialResult({
          success: true,
          email: data.email,
          provider: data.provider,
          trialExpires: result.trial_expires,
          remainingHours: result.trial_remaining_hours
        })

        // Salva dati localmente
        localStorage.setItem('mcp_trial_active', 'true')
        localStorage.setItem('mcp_trial_start', new Date().toISOString())
        localStorage.setItem('mcp_user_email', data.email)
        localStorage.setItem('mcp_auth_provider', data.provider)
      } else {
        setTrialResult({
          success: false,
          error: result.error || 'Errore durante la registrazione'
        })
      }
    } catch (error) {
      console.error('Registration error:', error)
      setTrialResult({
        success: false,
        error: 'Errore di connessione al server'
      })
    } finally {
      setIsLoading(false)
      setLoadingProvider(null)
    }
  }

  const handleAuthError = (error: string) => {
    setTrialResult({
      success: false,
      error: error
    })
    setIsLoading(false)
    setLoadingProvider(null)
  }

  const generateRandomString = (length: number) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let result = ''
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  }

  const handleClose = () => {
    if (!isLoading) {
      onClose()
      // Reset state dopo un delay per la animazione
      setTimeout(() => {
        setTrialResult(null)
        setLoadingProvider(null)
      }, 300)
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-50 flex items-center justify-center"
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-lg"
        />

        {/* Modal */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 500 }}
          className="relative bg-black/60 backdrop-blur-lg border-2 border-white/10 rounded-3xl shadow-2xl max-w-md w-full mx-4 max-h-[90vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          {!isLoading && (
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-2 text-gray-300 hover:text-white transition-colors rounded-full hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>
          )}

          <div className="p-6 overflow-y-auto min-h-0">
            {/* Header */}
            <div className="text-center mb-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="w-16 h-16 bg-gradient-to-r from-[#e43838] to-[#205e5e] rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <Clock className="w-8 h-8 text-white" />
              </motion.div>
              <h2 className="text-2xl font-bold text-white mb-2">
                🚀 Trial Gratuito 48 Ore
              </h2>
              <p className="text-gray-300 text-sm">
                Accesso completo alla piattaforma MCP senza limiti
              </p>
            </div>

            {/* Trial Info Box */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-r from-[#e43838]/20 to-[#205e5e]/20 border border-[#4ecdc4]/30 rounded-xl p-4 mb-6 text-center backdrop-blur-lg"
            >
              <div className="text-3xl font-bold text-white mb-1">48 ORE</div>
              <div className="text-white font-medium text-sm">
                Completamente gratuito • Nessun pagamento richiesto
              </div>
            </motion.div>

            {/* Success State */}
            {trialResult?.success && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-[#4ecdc4]/20 to-[#ff6b6b]/20 border border-[#4ecdc4] rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-lg">
                  <Check className="w-8 h-8 text-[#4ecdc4]" />
                </div>
                <h3 className="text-xl font-bold text-[#4ecdc4] mb-2">
                  🎉 Trial Attivato!
                </h3>
                <p className="text-gray-300 mb-4">
                  Bentornato <strong className="text-white">{trialResult.email}</strong>!<br />
                  Il tuo trial di 48 ore è ora attivo.
                </p>
                <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-lg p-4 mb-4 text-left text-sm">
                  <h4 className="font-semibold text-[#ff6b6b] mb-2">📋 Prossimi passi:</h4>
                  <ul className="text-gray-300 space-y-1">
                    <li>✅ Login completato ({trialResult.provider})</li>
                    <li>⏰ Trial 48h attivato</li>
                    <li>🔄 <strong className="text-white">Riavvia il software MCP</strong></li>
                    <li>🚀 Il sistema funzionerà normalmente</li>
                  </ul>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleClose}
                  className="w-full bg-gradient-to-r from-[#e43838] to-[#205e5e] text-white py-3 px-4 rounded-xl font-semibold"
                >
                  Inizia ad usare MCP
                </motion.button>
              </motion.div>
            )}

            {/* Error State */}
            {trialResult?.success === false && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-red-500/20 border border-red-400 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-lg">
                  <X className="w-8 h-8 text-red-400" />
                </div>
                <h3 className="text-xl font-bold text-red-400 mb-2">
                  ❌ Errore
                </h3>
                <p className="text-gray-300 mb-4">
                  {trialResult.error}
                </p>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setTrialResult(null)}
                  className="w-full bg-gradient-to-r from-[#ff6b6b] to-[#4ecdc4] text-white py-3 px-4 rounded-xl font-semibold"
                >
                  Riprova
                </motion.button>
              </motion.div>
            )}

            {/* Normal State - OAuth Buttons */}
            {!trialResult && (
              <>
                <div className="space-y-3 mb-6">
                  {/* Google */}
                  <motion.button
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleOAuthLogin('google')}
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-3 bg-white/5 backdrop-blur-lg border-2 border-red-400/40 text-white py-3 px-4 rounded-xl font-semibold hover:border-red-400 hover:bg-white/10 transition-all duration-300 disabled:opacity-50"
                  >
                    {loadingProvider === 'google' ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="#EA4335" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                    )}
                    Continua con Google
                  </motion.button>

                  {/* Microsoft */}
                  <motion.button
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleOAuthLogin('microsoft')}
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-3 bg-white/5 backdrop-blur-lg border-2 border-blue-400/40 text-white py-3 px-4 rounded-xl font-semibold hover:border-blue-400 hover:bg-white/10 transition-all duration-300 disabled:opacity-50"
                  >
                    {loadingProvider === 'microsoft' ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="#F35325" d="M2 2h9v9H2z"/>
                        <path fill="#81BC06" d="M13 2h9v9h-9z"/>
                        <path fill="#05A6F0" d="M2 13h9v9H2z"/>
                        <path fill="#FFBA08" d="M13 13h9v9h-9z"/>
                      </svg>
                    )}
                    Continua con Microsoft
                  </motion.button>
                </div>

                {/* Features Grid */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="border-t border-white/10 pt-6"
                >
                  <h3 className="font-semibold text-white text-center mb-4">
                    ✨ Cosa include il trial:
                  </h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2 text-gray-300">
                      <Check className="w-4 h-4 text-[#4ecdc4]" />
                      Accesso completo 48h
                    </div>
                    <div className="flex items-center gap-2 text-gray-300">
                      <Check className="w-4 h-4 text-[#4ecdc4]" />
                      Tutti gli strumenti MCP
                    </div>
                    <div className="flex items-center gap-2 text-gray-300">
                      <Check className="w-4 h-4 text-[#4ecdc4]" />
                      Supporto prioritario
                    </div>
                    <div className="flex items-center gap-2 text-gray-300">
                      <Check className="w-4 h-4 text-[#4ecdc4]" />
                      Nessun limite di uso
                    </div>
                  </div>
                </motion.div>

                {/* Security Note */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="mt-6 p-3 bg-white/5 backdrop-blur-lg border border-white/10 rounded-lg"
                >
                  <div className="flex items-center gap-2 text-gray-300 text-sm">
                    <Shield className="w-4 h-4 text-[#4ecdc4]" />
                    <span>La tua privacy è protetta. Usiamo OAuth 2.0 standard.</span>
                  </div>
                </motion.div>
              </>
            )}

            {/* Device ID (Debug) */}
            {deviceFingerprint && (
              <div className="mt-4 text-center">
                <p className="text-xs text-gray-500">
                  Device ID: {deviceFingerprint.substring(0, 12)}...
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}