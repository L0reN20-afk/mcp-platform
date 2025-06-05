# 🚀 Setup OAuth per MCP Platform

Questa guida ti mostra come configurare l'autenticazione OAuth 2.0 **VERA** per Google, Microsoft e Apple.

## 📋 Panoramica

Il sistema implementa:
- ✅ **OAuth 2.0 Standard** (non più fake!)
- ✅ **Modal in-page** (UX moderna)
- ✅ **Popup OAuth** (niente redirect)
- ✅ **Sicurezza CSRF** (state + nonce)
- ✅ **Trial 48h per device** 
- ✅ **Device fingerprinting**

## 🔧 Setup Providers OAuth

### 1. 🔍 **Google OAuth Setup**

1. Vai su [Google Cloud Console](https://console.developers.google.com/)
2. Crea un nuovo progetto o seleziona esistente
3. Vai su "APIs & Services" > "Credentials"
4. Clicca "Create Credentials" > "OAuth 2.0 Client IDs"
5. Configura:
   - **Application type**: Web application
   - **Name**: MCP Platform
   - **Authorized redirect URIs**: 
     - `http://localhost:3000/api/auth/callback/google` (dev)
     - `https://your-domain.com/api/auth/callback/google` (prod)
6. Salva `Client ID` e `Client Secret`

### 2. 🔷 **Microsoft OAuth Setup**

1. Vai su [Azure Portal](https://portal.azure.com/)
2. Registra una nuova app in "App registrations"
3. Vai su "Authentication" > "Add a platform" > "Web"
4. Configura:
   - **Redirect URIs**:
     - `http://localhost:3000/api/auth/callback/microsoft` (dev)
     - `https://your-domain.com/api/auth/callback/microsoft` (prod)
   - **ID tokens**: ✅ Abilitato
5. Vai su "Certificates & secrets" > "New client secret"
6. Salva `Application (client) ID` e `Client Secret`

### 3. 🍎 **Apple OAuth Setup**

1. Vai su [Apple Developer](https://developer.apple.com/)
2. Accedi con Apple ID Developer
3. Vai su "Certificates, Identifiers & Profiles"
4. Crea un nuovo "Service ID"
5. Configura:
   - **Primary App ID**: Il tuo app bundle
   - **Domains**: `your-domain.com`
   - **Return URLs**: `https://your-domain.com/api/auth/callback/apple`
6. Genera JWT client secret (più complesso)

**⚠️ Nota**: Apple richiede HTTPS anche in dev. Considera di implementarlo per ultimo.

## 🔑 Configurazione Environment Variables

Copia `.env.example` in `.env.local`:

```bash
cp .env.example .env.local
```

Aggiorna con i tuoi valori:

```env
# OAuth Google
GOOGLE_CLIENT_ID=123456789-abcdef.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-abcdef123456
NEXT_PUBLIC_GOOGLE_CLIENT_ID=123456789-abcdef.apps.googleusercontent.com

# OAuth Microsoft
MICROSOFT_CLIENT_ID=12345678-1234-1234-1234-123456789abc
MICROSOFT_CLIENT_SECRET=abc123def456
NEXT_PUBLIC_MICROSOFT_CLIENT_ID=12345678-1234-1234-1234-123456789abc

# OAuth Apple (opzionale)
APPLE_CLIENT_ID=com.yourdomain.mcp.service
APPLE_CLIENT_SECRET=eyJhbGc...long_jwt_here
NEXT_PUBLIC_APPLE_CLIENT_ID=com.yourdomain.mcp.service

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000  # Dev
# NEXT_PUBLIC_APP_URL=https://mcp-platform.vercel.app  # Prod
```

## 🚀 Test del Sistema

### 1. Avvia il server di sviluppo:
```bash
npm run dev
```

### 2. Apri http://localhost:3000

### 3. Clicca "Trial 48h" → Dovrebbe aprire il modal moderno!

### 4. Testa OAuth:
- ✅ **Google**: Dovrebbe aprire popup Google reale
- ✅ **Microsoft**: Dovrebbe aprire popup Microsoft reale  
- ⚠️ **Apple**: Richiede HTTPS (skippabile per ora)

## 🔄 Flusso Completo

1. **User clicca "Trial 48h"** → Modal si apre
2. **User sceglie provider** → Popup OAuth si apre
3. **User fa login** → Provider autentica
4. **Callback API** → Scambia code per token
5. **User info API** → Ottiene email/nome
6. **Popup invia dati** → Al modal parent
7. **Modal registra device** → Con email OAuth
8. **Trial attivato** → 48 ore per device
9. **Software C# verifica** → Trial valido!

## 🛠️ Debug

### Popup non si apre:
- Controlla popup blocker del browser
- Verifica console per errori JavaScript

### OAuth fallisce:
- Verifica redirect URIs nei provider
- Controlla client ID/secret in .env.local
- Verifica logs console

### Trial non attivato:
- Controlla API `/api/device/register` 
- Verifica database Supabase
- Controlla fingerprint generation

## 📱 Deployment

### Vercel:
1. Deploy su Vercel
2. Aggiungi environment variables
3. Aggiorna redirect URIs nei provider con il tuo dominio
4. Testa in produzione

### Nota Apple:
Apple richiede sempre HTTPS. Per test locali usa:
- ngrok per HTTPS tunnel
- O skippa Apple per ora

## 🎯 Risultato

✅ **UX Moderna**: Modal in-page invece di redirect  
✅ **OAuth Vero**: Connessione reale ai provider  
✅ **Sicurezza**: CSRF protection, device fingerprinting  
✅ **Performance**: Popup veloce, niente reload  
✅ **Mobile**: Design responsive  

**Prima (obsoleto):**
Button → Redirect → Pagina login → OAuth fake → Reload

**Dopo (moderno):**
Button → Modal → Popup OAuth vero → Success inline ✨

---

## 🐛 Troubleshooting Comune

**Q: "Popup bloccato"**  
A: Abilita popup per il sito, o usa Ctrl+Click

**Q: "Client ID non valido"**  
A: Verifica .env.local e rebuild (`npm run dev`)

**Q: "Redirect URI mismatch"**  
A: Assicurati che l'URI nel provider sia esatto (incluso http/https)

**Q: "Device non registrato"**  
A: Controlla network tab per errori API, verifica Supabase

Per supporto: controlla console browser e logs server! 🔍
