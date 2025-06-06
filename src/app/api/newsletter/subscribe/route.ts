// API Route: /api/newsletter/subscribe
// Gestisce l'iscrizione alla newsletter dal footer del sito

import { NextRequest, NextResponse } from 'next/server'
import { DatabaseService, getClientIP, getCountryFromIP, supabase } from '@/lib/database/supabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body

    // Validazione email
    if (!email || !email.includes('@')) {
      return NextResponse.json({
        success: false,
        error: 'Email non valida'
      }, { status: 400 })
    }

    const clientIP = getClientIP(request)
    const country = await getCountryFromIP(clientIP)

    // Tentativo di iscrizione
    const subscribed = await DatabaseService.subscribeNewsletter(email)

    if (!subscribed) {
      return NextResponse.json({
        success: false,
        error: 'Errore nell\'iscrizione. Riprova tra qualche momento.'
      }, { status: 500 })
    }

    // Log evento iscrizione
    await DatabaseService.logDeviceEvent(
      `newsletter_${email}`,
      'registration',
      {
        email,
        ip: clientIP,
        country,
        source: 'footer_form',
        timestamp: new Date().toISOString()
      }
    )

    return NextResponse.json({
      success: true,
      message: 'Iscrizione completata con successo! Controlla la tua email per la conferma.'
    })

  } catch (error) {
    console.error('Error in newsletter subscription:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Errore interno del server'
    }, { status: 500 })
  }
}

// GET method per verificare se un email è già iscritto
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')

    if (!email) {
      return NextResponse.json({
        success: false,
        error: 'Email richiesta'
      }, { status: 400 })
    }

    // Verifica esistenza iscrizione
    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .select('status')
      .eq('email', email)
      .single()

    if (error) {
      return NextResponse.json({
        success: true,
        subscribed: false
      })
    }

    return NextResponse.json({
      success: true,
      subscribed: data.status === 'active'
    })

  } catch (error) {
    console.error('Error checking newsletter subscription:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Errore nella verifica iscrizione'
    }, { status: 500 })
  }
}

// DELETE method per unsubscribe
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')

    if (!email) {
      return NextResponse.json({
        success: false,
        error: 'Email richiesta per la cancellazione'
      }, { status: 400 })
    }

    // Update status a unsubscribed invece di cancellare
    const { error } = await supabase
      .from('newsletter_subscribers')
      .update({ status: 'unsubscribed' })
      .eq('email', email)

    if (error) {
      console.error('Error unsubscribing:', error)
      return NextResponse.json({
        success: false,
        error: 'Errore nella cancellazione'
      }, { status: 500 })
    }

    // Log unsubscribe
    await DatabaseService.logDeviceEvent(
      `newsletter_${email}`,
      'server_ping',
      {
        email,
        action: 'unsubscribed',
        timestamp: new Date().toISOString()
      }
    )

    return NextResponse.json({
      success: true,
      message: 'Cancellazione completata con successo'
    })

  } catch (error) {
    console.error('Error in newsletter unsubscribe:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Errore interno del server'
    }, { status: 500 })
  }
}
