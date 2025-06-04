# 🔧 KillSwitchChecker - Istruzioni Complete

Guida dettagliata per configurare, compilare e distribuire il server MCP con il nuovo sistema di kill switch avanzato.

## 📋 Panoramica Modifiche

Il **KillSwitchChecker.cs** è stato completamente aggiornato con:

- ✅ **Device fingerprinting** multi-componente
- ✅ **Sistema trial 48h** individuale per dispositivo
- ✅ **Controllo ibrido** online/offline 
- ✅ **Backup criptato** nel Registry Windows
- ✅ **Integrazione API** completa con backend
- ✅ **Logging avanzato** per debugging
- ✅ **VM detection** e anti-tampering

## 📁 File Modificati

### KillSwitchChecker.cs
**Location**: `C:\Users\loren\MCP\FileSystemMCPServer2\Core\KillSwitchChecker.cs`

**Dimensione**: ~400 righe di codice avanzato
**Backup creato**: `BEFORE_MCP_PLATFORM_IMPLEMENTATION`

### Dipendenze Aggiunte
```csharp
using System.Management;           // WMI queries
using System.Security.Cryptography; // AES encryption
using System.Text;
using Microsoft.Win32;            // Registry access  
using System.Text.Json;           // JSON serialization
using System.Net.NetworkInformation; // MAC address
```

## 🔧 Configurazione Pre-Build

### 1. Aggiorna URL API
Nel file `KillSwitchChecker.cs`, riga ~19:

```csharp
// DEVELOPMENT
private static readonly string API_BASE_URL = "http://localhost:3000/api";

// PRODUCTION (aggiorna dopo deploy)
private static readonly string API_BASE_URL = "https://your-app.vercel.app/api";
```

### 2. Test in Sviluppo
Prima di compilare in Release:

```bash
# Assicurati che il backend sia in esecuzione
cd modern-website
npm run dev
# → API disponibili su http://localhost:3000/api
```

### 3. Verifica Dipendenze NuGet
Nel progetto FileSystemMCPServer2:

```xml
<!-- FileSystemMCPServer.csproj -->
<PackageReference Include="System.Management" Version="7.0.0" />
<PackageReference Include="System.Text.Json" Version="7.0.0" />
```

Se mancano, installa:
```bash
dotnet add package System.Management
dotnet add package System.Text.Json
```

## 🏗️ Processo di Build

### 1. Build Release
```bash
# Via Visual Studio 2022
Build → Configuration Manager → Release
Build → Build Solution

# Via CLI
cd C:\Users\loren\MCP\FileSystemMCPServer2
dotnet build -c Release
```

### 2. Locate Output
```
Path: FileSystemMCPServer2\bin\Release\net8.0\
File: FileSystemMCPServer.exe
Dependencies: *.dll, *.json, etc.
```

### 3. Test Locale
```bash
# Test diretto dell'EXE compilato
.\FileSystemMCPServer.exe

# Output atteso:
# [Kill Switch Enhanced] === AVVIO CONTROLLO COMPLETO ===
# [Kill Switch] ✅ Kill switch globale: OK
# [Device ID] 🔑 Device fingerprint: a1b2c3d4e5f6...
# [Trial API] 🌐 Connessione al server...
# [Registration] ✅ Nuovo trial attivato - scade: 2024-06-06T10:30:00Z
```

## 🛡️ Protezione NET Reactor

### 1. Configurazione NET Reactor
```
Input File: FileSystemMCPServer.exe
Protection Level: Maximum
Obfuscation: Strong
Anti-Debug: Enabled
Anti-Tamper: Enabled
Virtualization: Critical methods only
```

### 2. Protezione Speciale
Proteggi questi metodi critici:
- `GenerateDeviceFingerprint()`
- `CheckDeviceTrialStatus()`
- `EncryptString()` / `DecryptString()`
- `SaveTrialDataLocally()`

### 3. Output
```
Original: FileSystemMCPServer.exe (2.1 MB)
Protected: FileSystemMCPServer_protected.exe (2.8 MB)
```

## 📤 Distribuzione

### 1. GitHub Releases Setup
```bash
# Crea repository per file distribuzione
Repository: mcp-releases
Privacy: Private (raccomandato)
```

### 2. Upload File Protetto
```bash
# Via GitHub Web Interface
Releases → Create new release
Tag: v1.0.0
Title: MCP Platform Trial v1.0.0
Upload: FileSystemMCPServer_protected.exe → Rename to MCPServer-Trial.exe
```

### 3. URL File
```
https://github.com/L0reN20-afk/mcp-releases/releases/latest/download/MCPServer-Trial.exe
```

### 4. Aggiorna API Backend
Nel file `/api/trial/file/route.ts`:
```typescript
const githubDownloadUrl = `https://github.com/${githubOwner}/${githubRepo}/releases/latest/download/MCPServer-Trial.exe`
```

## 🧪 Test Completo del Sistema

### 1. Test Device Fingerprinting
```bash
# Avvia EXE e verifica logs
[Device ID] 🔑 Device fingerprint: SHA256_HASH...
[Fingerprint] CPU ID: BFEBFBFF000906E9...
[Fingerprint] Motherboard: MS-7C37...
[Fingerprint] Machine GUID: 12345678-1234-1234-1234-123456789012...
```

### 2. Test Registrazione Trial
```bash
# Primo avvio - nuovo device
[Trial API] 📝 Nuovo device - registrazione...
[Registration] ✅ Nuovo trial attivato - scade: 2024-06-06T10:30:00Z
[Offline Backup] 💾 Dati trial salvati localmente
```

### 3. Test Avvii Successivi
```bash
# Secondo avvio - device esistente
[Trial API] 🔍 Device esistente - verifica trial...
[Trial Check] ✅ Trial valido - Rimangono 47.2 ore
```

### 4. Test Controllo Offline
```bash
# Con internet disconnesso
[Trial API] ❌ Errore connessione: No network
[Trial API] 🔄 Fallback controllo offline...
[Offline Check] ✅ Trial locale valido - Rimangono 46.8 ore
```

### 5. Test Scadenza Trial
```bash
# Dopo 48 ore
[Trial Check] ❌ TRIAL SCADUTO - Trial scaduto. Effettua l'upgrade per continuare.
# EXE termina automaticamente
```

## 🔍 Debugging e Troubleshooting

### 1. Log Analysis
Tutti i log vanno su `Console.Error`:

```bash
# Avvia con redirect per salvare logs
.\FileSystemMCPServer.exe 2> debug.log

# Analizza logs
type debug.log | findstr "Kill Switch"
type debug.log | findstr "ERROR"
```

### 2. Problemi Comuni

#### "Device fingerprint generation failed"
```csharp
// Debug WMI access
try {
    var cpuId = GetWMIValue("SELECT ProcessorId FROM Win32_Processor", "ProcessorId");
    Console.WriteLine($"CPU ID: {cpuId}");
} catch (Exception ex) {
    Console.WriteLine($"WMI Error: {ex.Message}");
    // Possibile: Permissions, WMI service non disponibile
}
```

#### "Cannot connect to API"
```bash
# Verifica URL API
ping your-app.vercel.app

# Test manuale endpoint
curl https://your-app.vercel.app/api/device/register

# Verifica in locale
curl http://localhost:3000/api/device/register
```

#### "Registry access denied"
```csharp
// Verifica permessi utente per Registry
try {
    Registry.SetValue(@"HKEY_CURRENT_USER\Test", "Test", "Test");
    Registry.DeleteValue(@"HKEY_CURRENT_USER\Test", "Test");
    Console.WriteLine("Registry access: OK");
} catch {
    Console.WriteLine("Registry access: DENIED");
    // Possibile: Antivirus, Group Policy restrictions
}
```

### 3. Modalità Debug Estesa

Aggiungi flag debug temporaneo:

```csharp
private static readonly bool DEBUG_MODE = true; // Remove in production

// In ogni metodo critico:
if (DEBUG_MODE) {
    await Console.Error.WriteLineAsync($"[DEBUG] Method: {MethodBase.GetCurrentMethod().Name}");
    await Console.Error.WriteLineAsync($"[DEBUG] Params: {JsonSerializer.Serialize(parameters)}");
}
```

## 🔄 Aggiornamenti Futuri

### 1. Versioning
```csharp
private static readonly string VERSION = "1.0.0";
private static readonly string BUILD_DATE = "2024-06-04";

// Include nei logs
await Console.Error.WriteLineAsync($"[MCP Platform] Version {VERSION} ({BUILD_DATE})");
```

### 2. Feature Flags
```csharp
// Per A/B testing o rollout graduale
private static readonly bool ENABLE_VM_DETECTION = true;
private static readonly bool ENABLE_CLOCK_SYNC_CHECK = false;
private static readonly int TRIAL_HOURS = 48; // Configurabile
```

### 3. Upgrade Path
```csharp
// Check versione e auto-update
private static async Task<bool> CheckForUpdates() {
    var latestVersion = await httpClient.GetStringAsync($"{API_BASE_URL}/version/latest");
    return Version.Parse(latestVersion) > Version.Parse(VERSION);
}
```

## 📋 Checklist Pre-Distribuzione

### Build & Test
- [ ] Compilato in Release mode
- [ ] Tutte le dipendenze incluse
- [ ] Test device fingerprinting OK
- [ ] Test trial registration OK
- [ ] Test controllo offline OK
- [ ] Logs puliti e informativi

### Security & Protection  
- [ ] NET Reactor applicato
- [ ] File obfuscato verificato
- [ ] Anti-debug attivo
- [ ] Registry encryption funzionante
- [ ] Kill switch globale testato

### Distribution
- [ ] File uploadato su GitHub Releases
- [ ] URL download aggiornato nelle API
- [ ] Backend production online
- [ ] Database Supabase configurato
- [ ] Admin dashboard accessibile

### Documentation
- [ ] URL API aggiornato in produzione
- [ ] Logs di esempio documentati
- [ ] Troubleshooting guide completa
- [ ] Backup strategy definita

---

🎯 **Il sistema è ora completo e pronto per distribuzione enterprise!**

Il nuovo KillSwitchChecker offre controllo granulare per dispositivo, protezione anti-piracy avanzata e monitoring completo tramite admin dashboard.
