// API Route: /api/trial/download
// Gestisce la registrazione del download del trial e fornisce il link per il file EXE

import { NextRequest, NextResponse } from 'next/server'
import { DatabaseService, getClientIP, getCountryFromIP } from '@/lib/database/supabase'
import type { TrialDownloadRequest, TrialDownloadResponse } from '@/types/database'

export async function POST(request: NextRequest) {
  try {
    const body: TrialDownloadRequest = await request.json()
    const { email, user_agent, referrer } = body

    // Get client information
    const clientIP = getClientIP(request)
    const country = await getCountryFromIP(clientIP)
    
    // Log download event (anche senza device fingerprint per ora)
    const downloadId = `download_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    // Check for suspicious IP activity
    await DatabaseService.checkSuspiciousIP(clientIP)

    // For now, we store the download intent
    // Il device verrà registrato quando l'EXE viene lanciato per la prima volta
    
    // Log download event in events table for analytics
    if (email) {
      await DatabaseService.logDeviceEvent(
        'download_request', // temporary fingerprint
        'registration',
        {
          email,
          ip: clientIP,
          country,
          user_agent,
          referrer,
          download_id: downloadId
        }
      )
    }

    // Newsletter subscription if email provided
    if (email) {
      await DatabaseService.subscribeNewsletter(email)
    }

    // Return download URL (for now pointing to GitHub releases)
    const downloadUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/trial/file`
    
    const response: TrialDownloadResponse = {
      success: true,
      download_url: downloadUrl,
      trial_id: downloadId,
      message: 'Download preparato con successo. Il trial di 48 ore inizierà al primo avvio del software.'
    }

    return NextResponse.json(response)

  } catch (error) {
    console.error('Error in trial download:', error)
    
    const response: TrialDownloadResponse = {
      success: false,
      error: 'Errore interno del server. Riprova tra qualche momento.'
    }

    return NextResponse.json(response, { status: 500 })
  }
}

// GET method for simple download without email
export async function GET(request: NextRequest) {
  try {
    const clientIP = getClientIP(request)
    const country = await getCountryFromIP(clientIP)
    
    // Log anonymous download
    await DatabaseService.logDeviceEvent(
      'anonymous_download',
      'registration', 
      {
        ip: clientIP,
        country,
        timestamp: new Date().toISOString()
      }
    )

    // Check for suspicious activity
    await DatabaseService.checkSuspiciousIP(clientIP)

    const downloadUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/trial/file`
    
    const response: TrialDownloadResponse = {
      success: true,
      download_url: downloadUrl,
      message: 'Download gratuito disponibile. Trial 48h inizia al primo avvio.'
    }

    return NextResponse.json(response)

  } catch (error) {
    console.error('Error in anonymous download:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Errore interno del server'
    }, { status: 500 })
  }
}
