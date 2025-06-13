// API Route: /api/admin/devices
// Gestione devices dall'admin dashboard

import { NextRequest, NextResponse } from 'next/server'
import { DatabaseService, supabase } from '@/lib/database/supabase'
import type { DeviceInfo } from '@/types/database'

export async function GET(request: NextRequest) {
  try {
    // Verifica autenticazione admin
    const authHeader = request.headers.get('Authorization')
    const adminApiKey = process.env.ADMIN_API_KEY

    if (!authHeader || !authHeader.includes(adminApiKey!)) {
      return NextResponse.json({
        success: false,
        error: 'Non autorizzato'
      }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const status = searchParams.get('status') // active, expired, banned
    const search = searchParams.get('search') // ricerca per email o fingerprint

    const offset = (page - 1) * limit

    // Build query
    let query = supabase
      .from('device_trials')
      .select(`
        device_fingerprint,
        email,
        download_ip,
        country,
        first_download,
        trial_expires,
        status,
        created_at
      `)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    // Filtri
    if (status && ['active', 'expired', 'banned'].includes(status)) {
      query = query.eq('status', status)
    }

    if (search) {
      query = query.or(`email.ilike.%${search}%,device_fingerprint.ilike.%${search}%`)
    }

    const { data: devices, error, count } = await query

    if (error) {
      console.error('Error fetching devices:', error)
      return NextResponse.json({
        success: false,
        error: 'Errore nel recupero dei devices'
      }, { status: 500 })
    }

    // Arricchisce ogni device con info aggiuntive
    const enrichedDevices = await Promise.all(
      (devices || []).map(async (device) => {
        // Conta eventi per device
        const { count: eventCount } = await supabase
          .from('device_events')
          .select('*', { count: 'exact', head: true })
          .eq('device_fingerprint', device.device_fingerprint)

        // Ultimo evento
        const { data: lastEvent } = await supabase
          .from('device_events')
          .select('timestamp, event_type')
          .eq('device_fingerprint', device.device_fingerprint)
          .order('timestamp', { ascending: false })
          .limit(1)
          .single()

        const deviceInfo: DeviceInfo = {
          device_fingerprint: device.device_fingerprint,
          email: device.email,
          country: device.country,
          first_download: device.first_download,
          trial_expires: device.trial_expires,
          status: device.status,
          last_seen: lastEvent?.timestamp,
          total_launches: eventCount || 0,
          ip_address: device.download_ip
        }

        return deviceInfo
      })
    )

    return NextResponse.json({
      success: true,
      data: {
        devices: enrichedDevices,
        pagination: {
          page,
          limit,
          total: count || 0,
          pages: Math.ceil((count || 0) / limit)
        },
        filters: {
          status,
          search
        }
      }
    })

  } catch (error) {
    console.error('Error in admin devices:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Errore interno del server'
    }, { status: 500 })
  }
}

// POST method per azioni su devices (ban, extend trial, etc.)
export async function POST(request: NextRequest) {
  try {
    // Verifica autenticazione admin
    const authHeader = request.headers.get('Authorization')
    const adminApiKey = process.env.ADMIN_API_KEY

    if (!authHeader || !authHeader.includes(adminApiKey!)) {
      return NextResponse.json({
        success: false,
        error: 'Non autorizzato'
      }, { status: 401 })
    }

    const body = await request.json()
    const { action, device_fingerprint, data } = body

    if (!action || !device_fingerprint) {
      return NextResponse.json({
        success: false,
        error: 'Action e device_fingerprint richiesti'
      }, { status: 400 })
    }

    let result
    let message

    switch (action) {
      case 'ban':
        result = await DatabaseService.updateTrialStatus(device_fingerprint, 'banned')
        message = 'Device bannato con successo'
        
        // Crea alert per ban manuale
        await DatabaseService.createAlert(
          'suspicious_behavior',
          device_fingerprint,
          {
            reason: 'manual_ban_by_admin',
            timestamp: new Date().toISOString()
          },
          'high'
        )
        break

      case 'unban':
        result = await DatabaseService.updateTrialStatus(device_fingerprint, 'expired')
        message = 'Device sbannato (impostato come expired)'
        break

      case 'extend_trial':
        const hours = data?.hours || 24
        const newExpiry = new Date()
        newExpiry.setHours(newExpiry.getHours() + hours)
        
        const { error } = await supabase
          .from('device_trials')
          .update({ 
            trial_expires: newExpiry.toISOString(),
            status: 'active'
          })
          .eq('device_fingerprint', device_fingerprint)

        result = !error
        message = `Trial esteso di ${hours} ore`
        break

      case 'reset_trial':
        const resetExpiry = new Date()
        resetExpiry.setHours(resetExpiry.getHours() + 48)
        
        const { error: resetError } = await supabase
          .from('device_trials')
          .update({
            trial_expires: resetExpiry.toISOString(),
            status: 'active'
          })
          .eq('device_fingerprint', device_fingerprint)

        result = !resetError
        message = 'Trial resettato a 48 ore'
        break

      default:
        return NextResponse.json({
          success: false,
          error: 'Azione non riconosciuta'
        }, { status: 400 })
    }

    if (!result) {
      return NextResponse.json({
        success: false,
        error: 'Errore nell\'esecuzione dell\'azione'
      }, { status: 500 })
    }

    // Log azione admin
    await DatabaseService.logDeviceEvent(
      device_fingerprint,
      'server_ping',
      {
        admin_action: action,
        admin_data: data,
        timestamp: new Date().toISOString()
      }
    )

    return NextResponse.json({
      success: true,
      message
    })

  } catch (error) {
    console.error('Error in admin device action:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Errore nell\'azione admin'
    }, { status: 500 })
  }
}
