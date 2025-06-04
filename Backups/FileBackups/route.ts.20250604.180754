// API Route: /api/device/check-trial
// ENDPOINT CRITICO: Verifica se il trial è ancora valido per un device specifico
// Chiamato dal KillSwitchChecker.cs ad ogni avvio dell'EXE

import { NextRequest, NextResponse } from 'next/server'
import { DatabaseService, getClientIP } from '@/lib/database/supabase'
import type { TrialCheckRequest, TrialCheckResponse } from '@/types/database'

export async function POST(request: NextRequest) {
  try {
    const body: TrialCheckRequest = await request.json()
    const { device_fingerprint } = body

    // Validazione device fingerprint
    if (!device_fingerprint || device_fingerprint.length < 10) {
      return NextResponse.json({
        success: false,
        trial_valid: false,
        error: 'Device fingerprint non valido'
      }, { status: 400 })
    }

    const clientIP = getClientIP(request)

    // Verifica trial esistente
    const { valid, trial, remainingHours } = await DatabaseService.isTrialValid(device_fingerprint)

    if (!trial) {
      // Device non registrato
      const response: TrialCheckResponse = {
        success: false,
        trial_valid: false,
        error: 'Device non registrato. Registra il device prima.'
      }

      return NextResponse.json(response, { status: 404 })
    }

    // Log check event
    await DatabaseService.logDeviceEvent(
      device_fingerprint,
      'trial_check',
      {
        ip: clientIP,
        trial_status: trial.status,
        remaining_hours: remainingHours,
        result: valid ? 'valid' : 'expired',
        timestamp: new Date().toISOString()
      }
    )

    // Se trial scaduto, aggiorna status nel database
    if (!valid && trial.status === 'active') {
      await DatabaseService.updateTrialStatus(device_fingerprint, 'expired')
      
      // Crea alert per trial scaduto
      await DatabaseService.createAlert(
        'trial_expired',
        device_fingerprint,
        {
          expired_at: new Date().toISOString(),
          original_expiry: trial.trial_expires
        },
        'low'
      )
    }

    // Controlla comportamenti sospetti
    if (trial.status === 'banned') {
      await DatabaseService.createAlert(
        'suspicious_behavior',
        device_fingerprint,
        {
          reason: 'banned_device_attempted_access',
          ip: clientIP,
          timestamp: new Date().toISOString()
        },
        'high'
      )
    }

    const response: TrialCheckResponse = {
      success: true,
      trial_valid: valid && trial.status === 'active',
      trial_expires: trial.trial_expires,
      trial_remaining_hours: remainingHours,
      status: trial.status,
      message: trial.status === 'banned' 
        ? 'Device bannato. Contatta il supporto.'
        : valid 
          ? `Trial valido. Rimangono ${remainingHours?.toFixed(1)} ore.`
          : 'Trial scaduto. Effettua l\'upgrade per continuare.'
    }

    return NextResponse.json(response)

  } catch (error) {
    console.error('Error in trial check:', error)
    
    // Crea alert per errori di verifica
    await DatabaseService.createAlert(
      'suspicious_behavior',
      undefined,
      {
        error: error.message,
        endpoint: 'device/check-trial',
        timestamp: new Date().toISOString()
      },
      'medium'
    )

    const response: TrialCheckResponse = {
      success: false,
      trial_valid: false,
      error: 'Errore interno del server. Riprova tra qualche momento.'
    }

    return NextResponse.json(response, { status: 500 })
  }
}

// GET method per check rapido con query parameters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const deviceFingerprint = searchParams.get('device_fingerprint')

    if (!deviceFingerprint) {
      return NextResponse.json({
        success: false,
        trial_valid: false,
        error: 'Device fingerprint richiesto'
      }, { status: 400 })
    }

    const { valid, trial, remainingHours } = await DatabaseService.isTrialValid(deviceFingerprint)

    // Log quick check
    await DatabaseService.logDeviceEvent(
      deviceFingerprint,
      'trial_check',
      {
        method: 'GET',
        quick_check: true,
        result: valid ? 'valid' : 'expired'
      }
    )

    return NextResponse.json({
      success: true,
      trial_valid: valid && (trial?.status === 'active'),
      trial_expires: trial?.trial_expires,
      trial_remaining_hours: remainingHours,
      status: trial?.status || 'not_found'
    })

  } catch (error) {
    console.error('Error in quick trial check:', error)
    
    return NextResponse.json({
      success: false,
      trial_valid: false,
      error: 'Errore nella verifica rapida'
    }, { status: 500 })
  }
}
