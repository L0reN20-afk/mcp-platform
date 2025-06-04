# 🚀 MCP Platform - Documentazione Completa

Sistema completo per distribuzione e controllo di server MCP con device fingerprinting, trial individuale e dashboard admin.

## 📋 Indice

1. [Panoramica del Sistema](#panoramica-del-sistema)
2. [Architettura](#architettura)
3. [Setup Locale](#setup-locale)
4. [Configurazione Database](#configurazione-database)
5. [Deploy Production](#deploy-production)
6. [API Endpoints](#api-endpoints)
7. [Test del Sistema](#test-del-sistema)
8. [Troubleshooting](#troubleshooting)

---

## 🎯 Panoramica del Sistema

### Cosa è Stato Implementato

**MCP Platform** è ora un sistema completo enterprise-grade che include:

- ✅ **Frontend React/Next.js** con integrazione API completa
- ✅ **Backend API Routes** per gestione trial e dispositivi  
- ✅ **Database Supabase** con schema completo
- ✅ **Device Fingerprinting** multi-componente 
- ✅ **Sistema Trial 48h** individuale per dispositivo
- ✅ **Kill Switch avanzato** con controllo online/offline
- ✅ **Admin Dashboard** real-time per monitoring
- ✅ **Newsletter system** integrato
- ✅ **Analytics e tracking** eventi
- ✅ **Protezione anti-piracy** avanzata

### Funzionalità Chiave

1. **Trial 48h per Device**: Ogni dispositivo fisico può scaricare un trial di 48 ore (non aggirabile con nuovi account)
2. **Kill Switch Ibrido**: Controllo remoto + backup offline nel Registry Windows
3. **Admin Dashboard**: Monitoring real-time di dispositivi, trial, download e alert
4. **API Complete**: Sistema robusto per gestione utenti, dispositivi e trial
5. **Protezione Enterprise**: NET Reactor + device fingerprinting + controllo centralizzato

---

## 🏗️ Architettura

### Stack Tecnologico

```
🌐 Frontend: Next.js 14 + React + TypeScript + Tailwind CSS
💾 Database: PostgreSQL (Supabase)
🔧 Backend: Next.js API Routes  
🔒 Security: Device Fingerprinting + NET Reactor
📊 Analytics: Custom event tracking
📧 Email: Supabase integration
🎨 UI: Framer Motion + Lucide React + Recharts
```

### Flusso Sistema Completo

```
1. Utente visita sito → Frontend (Vercel)
2. Clicca "Scarica Trial" → API /trial/download
3. Database registra download → Supabase
4. File EXE servito → GitHub Releases  
5. Utente lancia EXE → KillSwitchChecker avanzato
6. Device fingerprinting → API /device/register
7. Trial 48h attivato → Database + Registry locale
8. Monitoring admin → Dashboard real-time
```

---

## 🛠️ Setup Locale

### 1. Pre-requisiti

```bash
# Software necessario:
- Node.js 18+ 
- npm o yarn
- Git
- Account Supabase (gratuito)
- Account GitHub (per file hosting)
```

### 2. Installazione Dipendenze

```bash
# Naviga nella cartella del progetto
cd "modern-website"

# Installa tutte le dipendenze
npm install @supabase/supabase-js@^2.39.0 crypto-js@^4.2.0 @types/crypto-js@^4.2.1

# Installa dipendenze esistenti se non fatto
npm install
```

### 3. Configurazione Environment Variables

Copia `.env.example` in `.env.local`:

```bash
# MCP Platform Environment Variables

# Supabase Configuration (OBBLIGATORIO)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your_service_key_here

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
TRIAL_DURATION_HOURS=48

# GitHub Configuration (per hosting file EXE)
GITHUB_TOKEN=your_github_token_here
GITHUB_REPO_OWNER=L0reN20-afk
GITHUB_REPO_NAME=mcp-releases

# Security Keys
JWT_SECRET=mcp_platform_jwt_secret_2024
ADMIN_API_KEY=admin_mcp_platform_2024

# External Services (opzionale)
IP_GEOLOCATION_API_KEY=your_ip_api_key_here
```

### 4. Avvio Sviluppo

```bash
npm run dev
```

Il sito sarà disponibile su `http://localhost:3000`

---

## 🗄️ Configurazione Database

### 1. Setup Supabase

1. **Crea Account**: [supabase.com](https://supabase.com)
2. **Nuovo Progetto**: Crea progetto "mcp-platform"
3. **Copia Credenziali**: URL e Service Key

### 2. Schema Database

Esegui questo SQL nel Query Editor di Supabase:

```sql
-- Tabella trial dispositivi
CREATE TABLE device_trials (
    id BIGSERIAL PRIMARY KEY,
    device_fingerprint TEXT UNIQUE NOT NULL,
    email TEXT,
    download_ip INET,
    country TEXT,
    first_download TIMESTAMPTZ DEFAULT NOW(),
    trial_expires TIMESTAMPTZ NOT NULL,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'expired', 'banned')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabella eventi dispositivi
CREATE TABLE device_events (
    id BIGSERIAL PRIMARY KEY,
    device_fingerprint TEXT NOT NULL,
    event_type TEXT NOT NULL CHECK (event_type IN ('launch', 'offline_check', 'server_ping', 'registration', 'trial_check')),
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    details JSONB DEFAULT '{}'
);

-- Tabella newsletter
CREATE TABLE newsletter_subscribers (
    id BIGSERIAL PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    subscribed_at TIMESTAMPTZ DEFAULT NOW(),
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'unsubscribed'))
);

-- Tabella alert admin  
CREATE TABLE admin_alerts (
    id BIGSERIAL PRIMARY KEY,
    alert_type TEXT NOT NULL,
    device_fingerprint TEXT,
    details JSONB DEFAULT '{}',
    severity TEXT DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high')),
    resolved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indici per performance
CREATE INDEX idx_device_trials_fingerprint ON device_trials(device_fingerprint);
CREATE INDEX idx_device_trials_status ON device_trials(status);
CREATE INDEX idx_device_trials_expires ON device_trials(trial_expires);
CREATE INDEX idx_device_events_fingerprint ON device_events(device_fingerprint);
CREATE INDEX idx_device_events_timestamp ON device_events(timestamp);
CREATE INDEX idx_newsletter_email ON newsletter_subscribers(email);
CREATE INDEX idx_admin_alerts_resolved ON admin_alerts(resolved);
```

### 3. Configurazione Security

In Supabase → Authentication → Policies:

```sql
-- Disabilita RLS per API service key
ALTER TABLE device_trials DISABLE ROW LEVEL SECURITY;
ALTER TABLE device_events DISABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers DISABLE ROW LEVEL SECURITY;
ALTER TABLE admin_alerts DISABLE ROW LEVEL SECURITY;
```

---

## 📁 GitHub Releases Setup

### 1. Crea Repository per File

1. **Nuovo repo**: `mcp-releases` (può essere privato)
2. **Upload file EXE**: `MCPServer-Trial.exe`
3. **Crea Release**: Tag v1.0.0 con file attached

### 2. GitHub Token

1. GitHub → Settings → Developer settings → Personal access tokens
2. **Scope necessari**: `repo`, `public_repo`
3. **Copia token** nel `.env.local`

---

## 🚀 Deploy Production

### 1. Deploy Frontend (Vercel)

```bash
# Installa Vercel CLI
npm i -g vercel

# Deploy
vercel

# Configura environment variables in Vercel dashboard:
# - NEXT_PUBLIC_SUPABASE_URL
# - SUPABASE_SERVICE_KEY  
# - ADMIN_API_KEY
# - GITHUB_TOKEN
# - Tutte le altre variabili
```

### 2. Aggiorna URL nel KillSwitchChecker

In `FileSystemMCPServer2/Core/KillSwitchChecker.cs`:

```csharp
// Cambia questo URL con quello di produzione
private static readonly string API_BASE_URL = "https://your-app.vercel.app/api";
```

### 3. Rebuild Server MCP

1. **Build Release** del progetto .NET
2. **Applica NET Reactor** per protezione
3. **Upload su GitHub Releases**

---

## 📡 API Endpoints

### Trial Management

```typescript
POST /api/trial/download
// Registra download trial
Body: { email?: string, user_agent?: string }
Response: { success: boolean, download_url?: string, trial_id?: string }

GET /api/trial/file  
// Serve file EXE (redirect a GitHub)
Response: Redirect o file binario
```

### Device Management

```typescript
POST /api/device/register
// Registra nuovo device al primo avvio EXE
Body: { device_fingerprint: string, email?: string, system_info?: object }
Response: { success: boolean, trial_expires?: string, trial_remaining_hours?: number }

POST /api/device/check-trial
// Verifica validità trial per device
Body: { device_fingerprint: string }
Response: { success: boolean, trial_valid: boolean, trial_remaining_hours?: number }

POST /api/device/ping
// Heartbeat da software in esecuzione  
Body: { device_fingerprint: string, uptime_seconds?: number, active_servers?: string[] }
Response: { success: boolean, trial_valid: boolean, commands?: object }
```

### Admin Endpoints

```typescript
GET /api/admin/stats
// Dashboard statistiche (requires auth)
Headers: { Authorization: "Bearer ADMIN_API_KEY" }
Response: { total_devices: number, active_trials: number, ... }

GET /api/admin/devices?page=1&limit=20&status=active
// Lista devices con filtri (requires auth)
Response: { devices: DeviceInfo[], pagination: object }

POST /api/admin/devices  
// Azioni su devices (ban, extend trial, etc.)
Body: { action: string, device_fingerprint: string, data?: object }
```

### Newsletter

```typescript
POST /api/newsletter/subscribe
// Iscrizione newsletter
Body: { email: string }
Response: { success: boolean, message?: string }
```

---

## 🧪 Test del Sistema

### 1. Test Frontend

```bash
# Avvia in locale
npm run dev

# Testa funzionalità:
✅ Newsletter signup nel footer
✅ Download trial da CTA, Demo, Packages, Pricing  
✅ Admin dashboard (con API key corretta)
✅ Tracking eventi in console browser
```

### 2. Test API Endpoints

```bash
# Test download trial
curl -X POST http://localhost:3000/api/trial/download \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'

# Test device registration  
curl -X POST http://localhost:3000/api/device/register \
  -H "Content-Type: application/json" \
  -d '{"device_fingerprint":"test123456789"}'

# Test admin stats
curl -H "Authorization: Bearer admin_mcp_platform_2024" \
  http://localhost:3000/api/admin/stats
```

### 3. Test Server MCP

1. **Compila** `FileSystemMCPServer2` in Release
2. **Esegui** l'EXE compilato
3. **Verifica** nei log:
   - Device fingerprinting funziona
   - Chiamata API registration/check-trial 
   - Trial 48h attivato correttamente
   - Backup locale nel Registry

### 4. Test Admin Dashboard

1. **Vai** su `/admin`
2. **Login** con API key: `admin_mcp_platform_2024`
3. **Verifica**:
   - Stats real-time funzionano
   - Lista devices mostra dati corretti
   - Azioni (ban/extend) funzionano
   - Auto-refresh attivo

---

## 🐛 Troubleshooting

### Problemi Comuni

#### 1. "Cannot connect to Supabase"
```bash
# Verifica environment variables
echo $NEXT_PUBLIC_SUPABASE_URL
echo $SUPABASE_SERVICE_KEY

# Verifica database accessibile da Supabase dashboard
```

#### 2. "Device fingerprint generation failed"
```csharp
// Nel KillSwitchChecker.cs, aggiungi più debug:
await Console.Error.WriteLineAsync($"[DEBUG] CPU: {cpuId}");
await Console.Error.WriteLineAsync($"[DEBUG] MB: {motherboardSerial}");
// Verifica che WMI queries funzionino su quel sistema
```

#### 3. "Admin dashboard shows no data"
```typescript
// Verifica API key in network tab browser
// Controlla che ADMIN_API_KEY sia impostata correttamente
// Verifica permessi Supabase Service Key
```

#### 4. "Download trial non funziona"
```bash
# Verifica GitHub token e repo esistenza
# Controlla file EXE caricato correttamente  
# Test endpoint /api/trial/file manualmente
```

### Debug Generale

```bash
# Logs Vercel
vercel logs

# Debug database
# Usa Supabase Query Editor per ispezionare dati

# Network tab browser  
# Verifica chiamate API e response codes

# Console browser
# Controlla errori JavaScript e tracking eventi
```

---

## 📊 Monitoraggio Produzione

### Metriche Chiave

```typescript
// Dashboard Admin mostra:
- Total devices registrati
- Active trials in corso
- Download giornalieri  
- Alert non risolti
- Top paesi utenti
- Attività recente

// Alert automatici per:
- Devices sospetti (stesso IP, fingerprint multipli)
- Tentativi di bypass trial
- Errori frequenti di sistema
```

### Backup e Sicurezza

```sql
-- Backup automatico Supabase (daily)
-- Retention policy eventi (30 giorni)  
-- Alert resolution automatica (7 giorni per low/medium)
```

---

## 🎯 Sviluppi Futuri

### Features Pianificate

1. **Payment Integration**: Stripe per upgrade post-trial
2. **Email Automation**: Welcome series + trial expiration
3. **Advanced Analytics**: Conversion funnels, retention
4. **Mobile Dashboard**: App admin per monitoring
5. **Multiple Server Types**: Supporto per altri server MCP
6. **Enterprise Features**: SSO, custom deployment, SLA

### Scaling Considerations

- **Database**: Migration a dedicated PostgreSQL per >10k users
- **File Delivery**: CDN dedicato per file EXE globali
- **Monitoring**: DataDog/NewRelic per observability produzione
- **Load Balancing**: Multiple Vercel regions per performance

---

## 📞 Supporto

Per problemi tecnici:
1. **Controlla** questa documentazione
2. **Verifica** logs Vercel e Supabase  
3. **Test** API endpoints singolarmente
4. **Debug** step-by-step il flusso utente

Il sistema è ora completamente funzionale e pronto per produzione! 🚀
