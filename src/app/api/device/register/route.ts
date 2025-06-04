// API Route: /api/device/register
// ENDPOINT CRUCIALE: Registra un nuovo device al primo avvio dell'EXE
// Viene chiamato dal KillSwitchChecker.cs con device fingerprint

import { NextRequest, NextResponse } from 'next/server'
import { DatabaseService, getClientIP, getCountryFromIP } from '@/lib/database/supabase'
import type { DeviceRegisterRequest, DeviceRegisterResponse } from '@/types/database'

export async function POST(request: NextRequest) {
  try {
    const body: DeviceRegisterRequest = await request.json()
    const { device_fingerprint, email, user_agent, system_info } = body

    // Validazione device fingerprint
    if (!device_fingerprint || device_fingerprint.length < 10) {
      return NextResponse.json({
        success: false,
        error: 'Device fingerprint non valido'
      }, { status: 400 })
    }

    const clientIP = getClientIP(request)
    const country = await getCountryFromIP(clientIP)

    // Controlla se il device è già registrato
    const existingTrial = await DatabaseService.getDeviceTrial(device_fingerprint)
    
    if (existingTrial) {
      // Device già registrato - verifica status trial
      const { valid, remainingHours } = await DatabaseService.isTrialValid(device_fingerprint)
      
      // Log evento di ritorno
      await DatabaseService.logDeviceEvent(
        device_fingerprint,
        'launch',
        {
          ip: clientIP,
          returning_user: true,
          trial_status: existingTrial.status,
          remaining_hours: remainingHours,
          system_info
        }
      )

      const response: DeviceRegisterResponse = {
        success: true,
        trial_expires: existingTrial.trial_expires,
        trial_remaining_hours: remainingHours,
        is_new_device: false,
        message: valid 
          ? `Trial valido. Rimangono ${remainingHours?.toFixed(1)} ore.`
          : 'Trial scaduto. Effettua l\'upgrade per continuare ad utilizzare il software.'
      }

      return NextResponse.json(response)
    }

    // Nuovo device - crea trial
    const newTrial = await DatabaseService.createDeviceTrial(
      device_fingerprint,
      email,
      clientIP,
      country
    )

    if (!newTrial) {
      return NextResponse.json({
        success: false,
        error: 'Errore nella creazione del trial'
      }, { status: 500 })
    }

    // Log registrazione nuovo device
    await DatabaseService.logDeviceEvent(
      device_fingerprint,
      'registration',
      {
        ip: clientIP,
        country,
        new_device: true,
        trial_created: true,
        system_info,
        email: email || 'anonymous'
      }
    )

    // Calcola ore rimanenti (dovrebbe essere 48)
    const now = new Date()
    const expires = new Date(newTrial.trial_expires)
    const remainingHours = (expires.getTime() - now.getTime()) / (1000 * 60 * 60)

    // Check suspicious activity (più device dallo stesso IP)
    await DatabaseService.checkSuspiciousIP(clientIP)

    const response: DeviceRegisterResponse = {
      success: true,
      trial_expires: newTrial.trial_expires,
      trial_remaining_hours: Math.round(remainingHours * 100) / 100,
      is_new_device: true,
      message: `Trial attivato con successo! Hai 48 ore di accesso completo al software.`
    }

    return NextResponse.json(response)

  } catch (error) {
    console.error('Error in device registration:', error)
    
    // Crea alert per errori di registrazione
    await DatabaseService.createAlert(
      'suspicious_behavior',
      undefined,
      {
        error: error instanceof Error ? error.message : String(error),
        endpoint: 'device/register',
        timestamp: new Date().toISOString()
      },
      'medium'
    )

    const response: DeviceRegisterResponse = {
      success: false,
      error: 'Errore interno del server. Riprova tra qualche momento.'
    }

    return NextResponse.json(response, { status: 500 })
  }
}

// GET method per verificare se un device è già registrato (senza registrare)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const deviceFingerprint = searchParams.get('device_fingerprint')

    if (!deviceFingerprint) {
      return NextResponse.json({
        success: false,
        error: 'Device fingerprint richiesto'
      }, { status: 400 })
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
      error: 'Errore nella verifica del device'
    }, { status: 500 })
  }
}
