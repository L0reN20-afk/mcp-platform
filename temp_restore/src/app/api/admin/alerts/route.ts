// API Route: /api/admin/alerts
// Gestione alert e notifiche di sicurezza per admin

import { NextRequest, NextResponse } from 'next/server'
import { DatabaseService, supabase } from '@/lib/database/supabase'

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
    const severity = searchParams.get('severity') // low, medium, high
    const resolved = searchParams.get('resolved') // true, false
    const alert_type = searchParams.get('alert_type')

    const offset = (page - 1) * limit

    // Build query
    let query = supabase
      .from('admin_alerts')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    // Filtri
    if (severity && ['low', 'medium', 'high'].includes(severity)) {
      query = query.eq('severity', severity)
    }

    if (resolved !== null) {
      query = query.eq('resolved', resolved === 'true')
    }

    if (alert_type) {
      query = query.eq('alert_type', alert_type)
    }

    const { data: alerts, error, count } = await query

    if (error) {
      console.error('Error fetching alerts:', error)
      return NextResponse.json({
        success: false,
        error: 'Errore nel recupero degli alert'
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      data: {
        alerts: alerts || [],
        pagination: {
          page,
          limit,
          total: count || 0,
          pages: Math.ceil((count || 0) / limit)
        },
        filters: {
          severity,
          resolved,
          alert_type
        }
      }
    })

  } catch (error) {
    console.error('Error in admin alerts:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Errore interno del server'
    }, { status: 500 })
  }
}

// POST method per creare nuovi alert o modificare esistenti
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
    const { action, alert_id, alert_data } = body

    if (!action) {
      return NextResponse.json({
        success: false,
        error: 'Action richiesta'
      }, { status: 400 })
    }

    let result
    let message

    switch (action) {
      case 'resolve':
        if (!alert_id) {
          return NextResponse.json({
            success: false,
            error: 'Alert ID richiesto per resolve'
          }, { status: 400 })
        }

        const { error: resolveError } = await supabase
          .from('admin_alerts')
          .update({ resolved: true })
          .eq('id', alert_id)

        result = !resolveError
        message = 'Alert risolto con successo'
        break

      case 'resolve_multiple':
        if (!alert_data?.alert_ids || !Array.isArray(alert_data.alert_ids)) {
          return NextResponse.json({
            success: false,
            error: 'Array di alert IDs richiesto'
          }, { status: 400 })
        }

        const { error: resolveMultipleError } = await supabase
          .from('admin_alerts')
          .update({ resolved: true })
          .in('id', alert_data.alert_ids)

        result = !resolveMultipleError
        message = `${alert_data.alert_ids.length} alert risolti`
        break

      case 'create':
        if (!alert_data?.alert_type || !alert_data?.severity) {
          return NextResponse.json({
            success: false,
            error: 'alert_type e severity richiesti per creazione'
          }, { status: 400 })
        }

        result = await DatabaseService.createAlert(
          alert_data.alert_type,
          alert_data.device_fingerprint,
          alert_data.details || {},
          alert_data.severity
        )
        message = 'Nuovo alert creato'
        break

      case 'delete':
        if (!alert_id) {
          return NextResponse.json({
            success: false,
            error: 'Alert ID richiesto per eliminazione'
          }, { status: 400 })
        }

        const { error: deleteError } = await supabase
          .from('admin_alerts')
          .delete()
          .eq('id', alert_id)

        result = !deleteError
        message = 'Alert eliminato'
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

    return NextResponse.json({
      success: true,
      message
    })

  } catch (error) {
    console.error('Error in admin alert action:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Errore nell\'azione alert'
    }, { status: 500 })
  }
}

// DELETE method per pulizia alert vecchi
export async function DELETE(request: NextRequest) {
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
    const days = parseInt(searchParams.get('days') || '30')
    const resolved_only = searchParams.get('resolved_only') === 'true'

    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - days)

    let deleteQuery = supabase
      .from('admin_alerts')
      .delete()
      .lt('created_at', cutoffDate.toISOString())

    if (resolved_only) {
      deleteQuery = deleteQuery.eq('resolved', true)
    }

    const { count, error } = await deleteQuery

    if (error) {
      console.error('Error deleting old alerts:', error)
      return NextResponse.json({
        success: false,
        error: 'Errore nella pulizia alert'
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: `${count || 0} alert eliminati (più vecchi di ${days} giorni)`,
      deleted_count: count || 0
    })

  } catch (error) {
    console.error('Error in alert cleanup:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Errore nella pulizia alert'
    }, { status: 500 })
  }
}
