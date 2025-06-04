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
        created_at: existingTrial.created_at
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

// POST method per registrare un nuovo device e attivare trial 48h
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { device_fingerprint, system_info } = body

    // Validazione device fingerprint
    if (!device_fingerprint || device_fingerprint.length < 10) {
      return NextResponse.json({
        success: false,
        error: 'Device fingerprint non valido'
      }, { status: 400 })
    }

    // Verifica se device già registrato
    const existingTrial = await DatabaseService.getDeviceTrial(device_fingerprint)
    if (existingTrial) {
      return NextResponse.json({
        success: true,
        trial_expires: existingTrial.trial_expires,
        trial_remaining_hours: await calculateRemainingHours(existingTrial.trial_expires),
        message: 'Device già registrato'
      })
    }

    // Ottieni informazioni client
    const clientIP = getClientIP(request)
    const country = await getCountryFromIP(clientIP)

    // Crea nuovo trial
    const newTrial = await DatabaseService.createDeviceTrial(
      device_fingerprint,
      undefined, // email opzionale
      clientIP,
      country
    )

    if (!newTrial) {
      return NextResponse.json({
        success: false,
        error: 'Errore nella creazione del trial'
      }, { status: 500 })
    }

    // Log registrazione
    await DatabaseService.logDeviceEvent(
      device_fingerprint,
      'registration',
      {
        ip: clientIP,
        country,
        system_info,
        timestamp: new Date().toISOString()
      }
    )

    // Calcola ore rimanenti
    const remainingHours = await calculateRemainingHours(newTrial.trial_expires)

    return NextResponse.json({
      success: true,
      trial_expires: newTrial.trial_expires,
      trial_remaining_hours: remainingHours,
      message: 'Trial attivato con successo'
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

// Helper function per calcolare ore rimanenti
async function calculateRemainingHours(trialExpires: string): Promise<number> {
  const now = new Date()
  const expires = new Date(trialExpires)
  const remainingMs = expires.getTime() - now.getTime()
  const remainingHours = Math.max(0, remainingMs / (1000 * 60 * 60))
  
  return Math.round(remainingHours * 100) / 100
}
