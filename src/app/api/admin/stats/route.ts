// API Route: /api/admin/stats
// Dashboard admin - statistiche in tempo reale

import { NextRequest, NextResponse } from 'next/server'
import { DatabaseService, supabase } from '@/lib/database/supabase'
import type { AdminStatsResponse } from '@/types/database'

export async function GET(request: NextRequest) {
  try {
    // Verifica autenticazione admin (basic per ora)
    const authHeader = request.headers.get('Authorization')
    const adminApiKey = process.env.ADMIN_API_KEY

    if (!authHeader || !authHeader.includes(adminApiKey!)) {
      return NextResponse.json({
        success: false,
        error: 'Non autorizzato. API key admin richiesta.'
      }, { status: 401 })
    }

    // Recupera statistiche dal database
    const stats = await DatabaseService.getAdminStats()
    
    // Recupera statistiche OAuth
    const oauthStats = await DatabaseService.getOAuthStats()

    // Recupera attività recente (ultimi 10 eventi)
    const { data: recentActivity } = await supabase
      .from('device_events')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(10)

    // Conta alert non risolti
    const { count: unresolvedAlerts } = await supabase
      .from('admin_alerts')
      .select('*', { count: 'exact', head: true })
      .eq('resolved', false)

    const response: AdminStatsResponse = {
      total_devices: stats.totalDevices,
      active_trials: stats.activeTrials,
      expired_trials: stats.expiredTrials,
      banned_devices: stats.bannedDevices,
      newsletter_subscribers: stats.newsletterSubscribers,
      downloads_today: stats.downloadsToday,
      downloads_this_week: 0, // TODO: implementare
      downloads_this_month: 0, // TODO: implementare
      // Nuove statistiche OAuth
      total_oauth_users: oauthStats.totalOAuthUsers,
      google_users: oauthStats.googleUsers,
      microsoft_users: oauthStats.microsoftUsers,
      apple_users: oauthStats.appleUsers,
      top_countries: stats.topCountries,
      top_oauth_providers: oauthStats.topProviders,
      recent_activity: recentActivity || [],
      alerts_unresolved: unresolvedAlerts || 0
    }

    return NextResponse.json({
      success: true,
      data: response,
      last_updated: new Date().toISOString()
    })

  } catch (error) {
    console.error('Error fetching admin stats:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Errore nel recupero delle statistiche'
    }, { status: 500 })
  }
}

// POST method per refresh forzato delle statistiche
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

    // Force refresh delle statistiche e cleanup dati vecchi
    
    // 1. Aggiorna trial scaduti
    const expiredTrials = await supabase
      .from('device_trials')
      .update({ status: 'expired' })
      .eq('status', 'active')
      .lt('trial_expires', new Date().toISOString())

    // 2. Cleanup eventi vecchi (> 30 giorni)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    
    const cleanupEvents = await supabase
      .from('device_events')
      .delete()
      .lt('timestamp', thirtyDaysAgo.toISOString())

    // 3. Risolvi alert vecchi automaticamente
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    
    const resolveOldAlerts = await supabase
      .from('admin_alerts')
      .update({ resolved: true })
      .eq('resolved', false)
      .lt('created_at', sevenDaysAgo.toISOString())
      .in('severity', ['low', 'medium'])

    // Ritorna statistiche aggiornate
    const stats = await DatabaseService.getAdminStats()

    return NextResponse.json({
      success: true,
      message: 'Statistiche aggiornate e cleanup completato',
      cleanup_results: {
        expired_trials_updated: expiredTrials.count || 0,
        old_events_cleaned: cleanupEvents.count || 0,
        old_alerts_resolved: resolveOldAlerts.count || 0
      },
      data: stats
    })

  } catch (error) {
    console.error('Error in admin stats refresh:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Errore nel refresh delle statistiche'
    }, { status: 500 })
  }
}
