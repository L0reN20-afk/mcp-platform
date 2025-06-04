# 🚀 MCP Platform

**Sistema completo enterprise-grade per distribuzione e controllo di server MCP con device fingerprinting avanzato, trial individuale e dashboard amministrativa.**

![MCP Platform](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Supabase](https://img.shields.io/badge/Database-Supabase-green)

## ✨ Funzionalità Principali

### 🎯 Sistema Trial Avanzato
- **48 ore per dispositivo fisico** - Non aggirabile con nuovi account
- **Device fingerprinting** multi-componente (CPU, Motherboard, HDD, MAC, Windows GUID)
- **Controllo ibrido** online/offline con backup nel Registry Windows
- **Kill switch** centralizzato con failsafe locale

### 🛡️ Sicurezza Enterprise
- **NET Reactor** protection per file EXE
- **Anti-tampering** e VM detection
- **Crittografia AES** per dati locali
- **API authentication** per admin dashboard

### 📊 Dashboard Amministrativa
- **Monitoring real-time** di dispositivi e trial attivi
- **Gestione dispositivi** (ban, extend trial, reset)
- **Analytics completi** su download, conversioni e utilizzo
- **Alert system** per comportamenti sospetti

### 🎨 Frontend Moderno
- **Next.js 14** con App Router
- **Animazioni 3D** avanzate con Three.js
- **UI responsive** ottimizzata per mobile
- **Newsletter integration** completa

## 🏗️ Architettura

```
Frontend (Next.js) → API Routes → Supabase → Admin Dashboard
                            ↓
Device Fingerprinting → Kill Switch → MCP Server
```

### Stack Tecnologico

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Supabase PostgreSQL
- **Security**: Device Fingerprinting, NET Reactor, AES Encryption
- **Deployment**: Vercel (frontend), Supabase (database)
- **Analytics**: Custom event tracking, Real-time monitoring

## 🚀 Quick Start

### 1. Prerequisiti
```bash
Node.js 18+, npm/yarn, Git
Account Supabase (gratuito)
Account GitHub (per file hosting)
```

### 2. Setup Locale
```bash
# Clone e install
git clone <repository>
cd modern-website
npm install @supabase/supabase-js crypto-js @types/crypto-js

# Configurazione
cp .env.example .env.local
# Compila le variabili Supabase
```

### 3. Database Setup
```sql
-- Esegui in Supabase Query Editor
-- Schema completo disponibile in SETUP.md
```

### 4. Launch
```bash
npm run dev
# → http://localhost:3000
```

📖 **Setup completo**: Vedi [SETUP.md](./SETUP.md) per istruzioni dettagliate

## 📡 API Endpoints

| Endpoint | Method | Descrizione |
|----------|--------|-------------|
| `/api/trial/download` | POST | Registra download trial |
| `/api/device/register` | POST | Registra nuovo device |
| `/api/device/check-trial` | POST | Verifica validità trial |
| `/api/admin/stats` | GET | Dashboard statistiche |
| `/api/admin/devices` | GET/POST | Gestione dispositivi |
| `/api/newsletter/subscribe` | POST | Newsletter signup |

## 🧪 Test del Sistema

### Frontend
```bash
npm run dev
# Testa: newsletter, download trial, admin dashboard
```

### API
```bash
curl -X POST http://localhost:3000/api/trial/download \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

### Admin Dashboard
```
URL: /admin
API Key: admin_mcp_platform_2024 (default)
```

## 📊 Monitoring

### Dashboard Features
- **Real-time stats**: Dispositivi attivi, trial scaduti, download oggi
- **Device management**: Lista completa con filtri e azioni
- **Geographic analytics**: Distribuzione utenti per paese
- **Alert system**: Comportamenti sospetti e anomalie

### Metriche Chiave
- Total devices registrati
- Active trials in corso  
- Download rate giornaliero
- Conversion trial → subscription
- Alert di sicurezza non risolti

## 🛡️ Sicurezza

### Device Fingerprinting
```csharp
// Multi-component fingerprint
CPU ID + Motherboard Serial + HDD Serial + MAC Address + Windows GUID
→ SHA256 Hash univoco per dispositivo
```

### Protezione Anti-Piracy
- **NET Reactor** obfuscation del codice
- **Kill switch** remoto + locale
- **VM detection** e anti-debugging
- **Registry encryption** per dati sensibili

### Admin Security
- API key authentication
- Rate limiting su endpoints
- Input sanitization completa
- HTTPS enforcement

## 🚀 Deploy Production

### Vercel Deployment
```bash
vercel --prod
# Configura environment variables in dashboard
```

### Environment Variables (Production)
```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_KEY=eyJ...
ADMIN_API_KEY=your_admin_key
GITHUB_TOKEN=ghp_...
```

### Post-Deploy Checklist
- [ ] Database schema applicato
- [ ] Environment variables configurate
- [ ] File EXE uploadato su GitHub Releases
- [ ] KillSwitchChecker aggiornato con URL produzione
- [ ] Admin dashboard accessibile
- [ ] API endpoints funzionanti

## 📈 Roadmap

### v2.0 Features
- [ ] **Payment Integration**: Stripe per subscriptions
- [ ] **Email Automation**: Trial expiration sequences
- [ ] **Mobile App**: Dashboard admin iOS/Android
- [ ] **Advanced Analytics**: Conversion funnels
- [ ] **Multi-Server**: Supporto per diversi tipi MCP

### Enterprise Features
- [ ] **SSO Integration**: OAuth providers
- [ ] **Custom Deployment**: On-premise options
- [ ] **SLA Management**: Uptime guarantees
- [ ] **White-label**: Custom branding

## 🐛 Troubleshooting

### Problemi Comuni

**"Cannot connect to Supabase"**
```bash
# Verifica environment variables
echo $NEXT_PUBLIC_SUPABASE_URL
```

**"Admin dashboard non carica"**
```typescript
// Verifica API key in network tab
// Check ADMIN_API_KEY in .env
```

**"Device fingerprint failed"**
```csharp
// Debug WMI queries nel KillSwitchChecker
// Verifica permessi Windows
```

## 📞 Support

- 📖 **Documentazione**: [SETUP.md](./SETUP.md)
- 🐛 **Bug Reports**: Issues GitHub
- 💬 **Discussion**: GitHub Discussions
- 📧 **Enterprise**: enterprise@mcpplatform.com

## 📄 License

© 2024 MCP Platform. All rights reserved.

---

**🎯 Ready for Production** | **🚀 Enterprise Grade** | **🛡️ Secure by Design**
