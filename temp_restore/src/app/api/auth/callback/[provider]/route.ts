import { NextRequest, NextResponse } from 'next/server'

// Configurazioni OAuth 2.0 per ogni provider
const oauthConfigs = {
  google: {
    tokenUrl: 'https://oauth2.googleapis.com/token',
    userInfoUrl: 'https://www.googleapis.com/oauth2/v2/userinfo',
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  },
  microsoft: {
    tokenUrl: 'https://login.microsoftonline.com/common/oauth2/v2.0/token',
    userInfoUrl: 'https://graph.microsoft.com/v1.0/me',
    clientId: process.env.MICROSOFT_CLIENT_ID,
    clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
  },
  apple: {
    tokenUrl: 'https://appleid.apple.com/auth/token',
    userInfoUrl: 'https://appleid.apple.com/auth/keys', // Apple usa JWT
    clientId: process.env.APPLE_CLIENT_ID,
    clientSecret: process.env.APPLE_CLIENT_SECRET,
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { provider: string } }
) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    const state = searchParams.get('state')
    const error = searchParams.get('error')
    const provider = params.provider as keyof typeof oauthConfigs

    // Verifica provider supportato
    if (!oauthConfigs[provider]) {
      return new Response(`
        <script>
          window.opener.postMessage({
            type: 'oauth-error',
            error: 'Provider non supportato: ${provider}'
          }, '${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}');
          window.close();
        </script>
      `, {
        headers: { 'Content-Type': 'text/html' }
      })
    }

    // Gestisci errori OAuth
    if (error) {
      return new Response(`
        <script>
          window.opener.postMessage({
            type: 'oauth-error',
            error: 'Errore OAuth: ${error}'
          }, '${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}');
          window.close();
        </script>
      `, {
        headers: { 'Content-Type': 'text/html' }
      })
    }

    // Verifica presenza del codice
    if (!code) {
      return new Response(`
        <script>
          window.opener.postMessage({
            type: 'oauth-error',
            error: 'Codice OAuth mancante'
          }, '${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}');
          window.close();
        </script>
      `, {
        headers: { 'Content-Type': 'text/html' }
      })
    }

    const config = oauthConfigs[provider]

    // Scambia il codice per un access token
    const tokenResponse = await fetch(config.tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: config.clientId!,
        client_secret: config.clientSecret!,
        code: code,
        redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/auth/callback/${provider}`,
      }),
    })

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.text()
      console.error(`Token exchange failed for ${provider}:`, errorData)
      
      return new Response(`
        <script>
          window.opener.postMessage({
            type: 'oauth-error',
            error: 'Errore nello scambio del token'
          }, '${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}');
          window.close();
        </script>
      `, {
        headers: { 'Content-Type': 'text/html' }
      })
    }

    const tokenData = await tokenResponse.json()
    const accessToken = tokenData.access_token

    if (!accessToken) {
      return new Response(`
        <script>
          window.opener.postMessage({
            type: 'oauth-error',
            error: 'Access token non ricevuto'
          }, '${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}');
          window.close();
        </script>
      `, {
        headers: { 'Content-Type': 'text/html' }
      })
    }

    // Ottieni informazioni utente
    let userInfo: any = {}
    
    if (provider === 'apple') {
      // Apple usa JWT nel token - decodifica semplice
      try {
        const idToken = tokenData.id_token
        if (idToken) {
          const payloadBase64 = idToken.split('.')[1]
          const payload = JSON.parse(Buffer.from(payloadBase64, 'base64').toString())
          userInfo = {
            email: payload.email,
            name: payload.name || 'Apple User',
            verified_email: true
          }
        }
      } catch (e) {
        console.error('Apple JWT decode error:', e)
      }
    } else {
      // Google e Microsoft usano endpoint userinfo
      const userResponse = await fetch(config.userInfoUrl, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json',
        },
      })

      if (userResponse.ok) {
        const userData = await userResponse.json()
        
        // Normalizza i dati utente per diversi provider
        if (provider === 'google') {
          userInfo = {
            email: userData.email,
            name: userData.name,
            verified_email: userData.verified_email
          }
        } else if (provider === 'microsoft') {
          userInfo = {
            email: userData.mail || userData.userPrincipalName,
            name: userData.displayName,
            verified_email: true // Microsoft gestisce la verifica internamente
          }
        }
      }
    }

    // Verifica che abbiamo le informazioni essenziali
    if (!userInfo.email) {
      return new Response(`
        <script>
          window.opener.postMessage({
            type: 'oauth-error',
            error: 'Email non disponibile dal provider ${provider}'
          }, '${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}');
          window.close();
        </script>
      `, {
        headers: { 'Content-Type': 'text/html' }
      })
    }

    // Successo - invia dati al popup parent
    return new Response(`
      <script>
        window.opener.postMessage({
          type: 'oauth-success',
          provider: '${provider}',
          email: '${userInfo.email}',
          name: '${userInfo.name || ''}',
          access_token: '${accessToken}',
          verified_email: ${userInfo.verified_email || false}
        }, '${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}');
        window.close();
      </script>
    `, {
      headers: { 'Content-Type': 'text/html' }
    })

  } catch (error) {
    console.error(`OAuth callback error for ${params.provider}:`, error)
    
    return new Response(`
      <script>
        window.opener.postMessage({
          type: 'oauth-error',
          error: 'Errore interno durante l\\'autenticazione'
        }, '${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}');
        window.close();
      </script>
    `, {
      headers: { 'Content-Type': 'text/html' }
    })
  }
}
