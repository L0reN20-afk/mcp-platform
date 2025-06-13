import { NextRequest, NextResponse } from 'next/server'
import { DatabaseService, getClientIP, getCountryFromIP } from '@/lib/database/supabase'

// GET method per verificare se un device è già registrato (senza registrare)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const deviceFingerprint = searchParams.get('device_fingerprint')
    
    // DEBUG: Se richiesto senza parametri, restituisci status delle env vars
    if (!deviceFingerprint) {
      return NextResponse.json({
        success: true,
        debug: true,
        env_status: {
          supabase_url_exists: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
          supabase_key_exists: !!process.env.SUPABASE_SERVICE_KEY,
          supabase_url_length: process.env.NEXT_PUBLIC_SUPABASE_URL?.length || 0,
          supabase_key_length: process.env.SUPABASE_SERVICE_KEY?.length || 0
        }
      })
    }

    const existingTrial = await DatabaseService.getDeviceTrial(deviceFingerprint)
    
    return NextResponse.json({
      success: true,
      device_exists: !!existingTrial,
      trial_info: existingTrial ? {
        status: existingTrial.status,
        trial_expires: existingTrial.trial_expires,
        created_at: existingTrial.created_at,
        user_email: existingTrial.email
      } : null
    })

  } catch (error) {
    console.error('Error checking device:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Errore nella verifica del device',
      debug_error: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
}

// POST method per registrare device con autenticazione OAuth semplice
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      device_fingerprint, 
      system_info, 
      user_email,           // ← OAuth email (Google/Microsoft/Apple)
      auth_provider,        // ← "google" | "microsoft" | "apple" 
      auth_token           // ← Token OAuth verificato (opzionale per ora)
    } = body

    // Validazione device fingerprint
    if (!device_fingerprint || device_fingerprint.length < 10) {
      return NextResponse.json({
        success: false,
        error: 'Device fingerprint non valido'
      }, { status: 400 })
    }

    // Validazione email OAuth (se fornita)
    if (user_email && !isValidEmail(user_email)) {
      return NextResponse.json({
        success: false,
        error: 'Email non valida'
      }, { status: 400 })
    }

    // Verifica se device già registrato
    const existingTrial = await DatabaseService.getDeviceTrial(device_fingerprint)
    if (existingTrial) {
      // Se device esiste ma ora ha autenticazione, aggiorna email
      if (user_email && existingTrial.email !== user_email) {
        await DatabaseService.updateDeviceEmail(device_fingerprint, user_email, auth_provider)
        
        await DatabaseService.logDeviceEvent(
          device_fingerprint,
          'email_updated',
          {
            old_email: existingTrial.email,
            new_email: user_email,
            auth_provider,
            timestamp: new Date().toISOString()
          }
        )
      }

      return NextResponse.json({
        success: true,
        trial_expires: existingTrial.trial_expires,
        trial_remaining_hours: await calculateRemainingHours(existingTrial.trial_expires),
        user_email: user_email || existingTrial.email,
        auth_provider: auth_provider || 'unknown',
        message: 'Device già registrato'
      })
    }

    // Ottieni informazioni client
    const clientIP = getClientIP(request)
    const country = await getCountryFromIP(clientIP)

    // Crea nuovo trial
    const newTrial = await DatabaseService.createDeviceTrial(
      device_fingerprint,
      user_email,  // ← Email OAuth
      clientIP,
      country
    )

    if (!newTrial) {
      return NextResponse.json({
        success: false,
        error: 'Errore nella creazione del trial'
      }, { status: 500 })
    }

    // Log registrazione con info OAuth
    await DatabaseService.logDeviceEvent(
      device_fingerprint,
      'registration',
      {
        ip: clientIP,
        country,
        system_info,
        user_email,
        auth_provider: auth_provider || 'unknown',
        timestamp: new Date().toISOString()
      }
    )

    // Se abbiamo autenticazione OAuth, salva provider
    if (auth_provider) {
      await DatabaseService.logDeviceEvent(
        device_fingerprint,
        'oauth_login',
        {
          provider: auth_provider,
          email: user_email,
          timestamp: new Date().toISOString()
        }
      )
    }

    // Calcola ore rimanenti
    const remainingHours = await calculateRemainingHours(newTrial.trial_expires)

    return NextResponse.json({
      success: true,
      trial_expires: newTrial.trial_expires,
      trial_remaining_hours: remainingHours,
      user_email: user_email,
      auth_provider: auth_provider || 'unknown',
      message: user_email 
        ? `Trial attivato per ${user_email} tramite ${auth_provider}`
        : 'Trial attivato con successo'
    })

  } catch (error) {
    console.error('Error registering device:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Errore interno del server',
      debug_error: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
}

// Helper function per validare email
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Helper function per calcolare ore rimanenti
async function calculateRemainingHours(trialExpires: string): Promise<number> {
  const now = new Date()
  const expires = new Date(trialExpires)
  const remainingMs = expires.getTime() - now.getTime()
  const remainingHours = Math.max(0, remainingMs / (1000 * 60 * 60))
  
  return Math.round(remainingHours * 100) / 100
}
