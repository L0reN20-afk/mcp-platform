// API Route: /api/trial/file
// Serve il file EXE del trial dal GitHub Releases o storage configurato

import { NextRequest, NextResponse } from 'next/server'
import { DatabaseService, getClientIP } from '@/lib/database/supabase'

export async function GET(request: NextRequest) {
  try {
    const clientIP = getClientIP(request)

    // Log file download access
    await DatabaseService.logDeviceEvent(
      'file_access',
      'server_ping',
      {
        ip: clientIP,
        timestamp: new Date().toISOString(),
        user_agent: request.headers.get('user-agent')
      }
    )

    // GitHub Releases URL (da configurare)
    const githubOwner = process.env.GITHUB_REPO_OWNER || 'L0reN20-afk'
    const githubRepo = process.env.GITHUB_REPO_NAME || 'mcp-releases'
    
    // Per ora redirect al GitHub releases
    // In futuro potresti servire il file direttamente per più controllo
    const githubDownloadUrl = `https://github.com/${githubOwner}/${githubRepo}/releases/latest/download/MCPServer-Trial.exe`
    
    // Alternative: Serve file directly if stored locally/cloud
    // const fileBuffer = await readFileFromStorage('MCPServer-Trial.exe')
    // return new NextResponse(fileBuffer, {
    //   headers: {
    //     'Content-Type': 'application/octet-stream',
    //     'Content-Disposition': 'attachment; filename="MCPServer-Trial.exe"'
    //   }
    // })

    // For now, redirect to GitHub releases
    return NextResponse.redirect(githubDownloadUrl)

  } catch (error) {
    console.error('Error serving trial file:', error)
    
    return NextResponse.json({
      success: false,
      error: 'File non disponibile. Contatta il supporto.'
    }, { status: 500 })
  }
}

// POST method per download con autenticazione (se necessario)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { trial_id, device_info } = body

    const clientIP = getClientIP(request)

    // Verifica trial_id se fornito
    if (trial_id) {
      // Log authenticated download
      await DatabaseService.logDeviceEvent(
        trial_id,
        'server_ping',
        {
          ip: clientIP,
          device_info,
          authenticated: true,
          timestamp: new Date().toISOString()
        }
      )
    }

    // Return file URL or serve directly
    const githubOwner = process.env.GITHUB_REPO_OWNER || 'L0reN20-afk'
    const githubRepo = process.env.GITHUB_REPO_NAME || 'mcp-releases'
    const downloadUrl = `https://github.com/${githubOwner}/${githubRepo}/releases/latest/download/MCPServer-Trial.exe`

    return NextResponse.json({
      success: true,
      download_url: downloadUrl,
      message: 'File autorizzato per il download'
    })

  } catch (error) {
    console.error('Error in authenticated file download:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Errore nel download autenticato'
    }, { status: 500 })
  }
}
