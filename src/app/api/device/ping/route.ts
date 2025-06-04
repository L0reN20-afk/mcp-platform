// API Route: /api/device/ping
// Heartbeat endpoint per monitorare l'utilizzo attivo del software
// Chiamato periodicamente dal software MCP in esecuzione

import { NextRequest, NextResponse } from 'next/server'
import { DatabaseService, getClientIP } from '@/lib/database/supabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      device_fingerprint, 
      uptime_seconds, 
      active_servers,
      memory_usage_mb,
      cpu_usage_percent 
    } = body

    if (!device_fingerprint) {
      return NextResponse.json({
        success: false,
        error: 'Device fingerprint richiesto'
      }, { status: 400 })
    }

    const clientIP = getClientIP(request)

    // Verifica che il device sia registrato e il trial valido
    const { valid, trial, remainingHours } = await DatabaseService.isTrialValid(device_fingerprint)

    if (!trial) {
      return NextResponse.json({
        success: false,
        trial_valid: false,
        error: 'Device non registrato'
      }, { status: 404 })
    }

    // Log ping event con informazioni di utilizzo
    await DatabaseService.logDeviceEvent(
      device_fingerprint,
      'server_ping',
      {
        ip: clientIP,
        uptime_seconds,
        active_servers,
        memory_usage_mb,
        cpu_usage_percent,
        trial_status: trial.status,
        remaining_hours: remainingHours,
        timestamp: new Date().toISOString()
      }
    )

    // Se trial scaduto durante l'uso, notifica
    if (!valid && trial.status === 'active') {
      await DatabaseService.updateTrialStatus(device_fingerprint, 'expired')
    }

    // Response con info trial e comandi server se necessario
    const response = {
      success: true,
      trial_valid: valid && trial.status === 'active',
      trial_remaining_hours: remainingHours,
      server_status: 'running',
      // Possibili comandi futuri per controllo remoto
      commands: {
        kill_switch: false,
        update_available: false,
        maintenance_mode: false
      },
      message: valid 
        ? `Heartbeat OK. Trial valido per altre ${remainingHours?.toFixed(1)} ore.`
        : 'Trial scaduto. Software verrà terminato.'
    }

    return NextResponse.json(response)

  } catch (error) {
    console.error('Error in device ping:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Errore nel ping del device'
    }, { status: 500 })
  }
}

// GET method per status check veloce
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

    // Quick status check senza logging dettagliato
    const { valid, remainingHours } = await DatabaseService.isTrialValid(deviceFingerprint)

    return NextResponse.json({
      success: true,
      trial_valid: valid,
      trial_remaining_hours: remainingHours,
      server_time: new Date().toISOString()
    })

  } catch (error) {
    console.error('Error in ping status check:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Errore nel check status'
    }, { status: 500 })
  }
}
