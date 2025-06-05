// src/app/api/device/register/route.ts - Aggiorna la POST function

import { isEmailAllowed, isTrialLimitReached } from '@/lib/whitelist'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      device_fingerprint, 
      system_info, 
      user_email,
      auth_provider,
      auth_token
    } = body

    // ✅ CONTROLLO WHITELIST EMAIL
    if (user_email) {
      const emailCheck = isEmailAllowed(user_email)
      if (!emailCheck.allowed) {
        return NextResponse.json({
          success: false,
          error: `Accesso negato: ${emailCheck.reason}`,
          error_type: 'EMAIL_NOT_ALLOWED'
        }, { status: 403 })
      }
    }

    // ✅ CONTROLLO LIMITE TRIAL GLOBALE
    if (await isTrialLimitReached()) {
      return NextResponse.json({
        success: false,
        error: 'Trial beta esaurito. Contatta il supporto per l\'accesso.',
        error_type: 'TRIAL_LIMIT_REACHED'
      }, { status: 429 })
    }

    // Resto della logica esistente...
    // [codice normale continua]
    
  } catch (error) {
    // gestione errori
  }
}
