// 🎯 SISTEMA LOGGING CENTRALIZZATO - Trading Bot 2025
// Elimina spam, formatta consistentemente, supporta livelli debug

export type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR'

interface LogConfig {
  level: LogLevel
  enableDebug: boolean
  enableSpamPrevention: boolean
  component?: string
}

// 🎯 CONFIGURAZIONE GLOBALE
const LOG_CONFIG: LogConfig = {
  level: process.env.NODE_ENV === 'development' ? 'DEBUG' : 'INFO',
  enableDebug: process.env.NODE_ENV === 'development',
  enableSpamPrevention: true
}

// 🚫 ANTI-SPAM TRACKER
const spamTracker = new Map<string, { count: number; lastTime: number; hash: string }>()
const SPAM_THRESHOLD = 3 // Max 3 volte stesso messaggio
const SPAM_WINDOW = 5000 // 5 secondi

// 🎨 EMOJI PER LIVELLI
const LEVEL_EMOJIS = {
  DEBUG: '🔧',
  INFO: '✅', 
  WARN: '⚠️',
  ERROR: '❌'
}

class Logger {
  private component: string
  private oneTimeFlags = new Set<string>()

  constructor(component: string) {
    this.component = component
  }

  private formatMessage(level: LogLevel, message: string, data?: any): string {
    const emoji = LEVEL_EMOJIS[level]
    const timestamp = new Date().toLocaleTimeString('it-IT', { 
      hour12: false
    })
    
    let formatted = `${emoji} [${this.component}] ${message}`
    
    if (data !== undefined) {
      formatted += ` | ${typeof data === 'object' ? JSON.stringify(data) : data}`
    }
    
    return formatted
  }

  private shouldLog(level: LogLevel, message: string): boolean {
    // 1. Controlla livello globale
    const levels: LogLevel[] = ['DEBUG', 'INFO', 'WARN', 'ERROR']
    const currentLevelIndex = levels.indexOf(LOG_CONFIG.level)
    const messageLevelIndex = levels.indexOf(level)
    
    if (messageLevelIndex < currentLevelIndex) {
      return false
    }

    // 2. Anti-spam se abilitato
    if (LOG_CONFIG.enableSpamPrevention && level !== 'ERROR') {
      const key = `${this.component}-${message}`
      const hash = this.createSimpleHash(message)
      const now = Date.now()
      
      const existing = spamTracker.get(key)
      if (existing) {
        if (now - existing.lastTime < SPAM_WINDOW) {
          existing.count++
          if (existing.count > SPAM_THRESHOLD) {
            return false // Block spam
          }
        } else {
          // Reset counter dopo window
          existing.count = 1
          existing.lastTime = now
        }
      } else {
        spamTracker.set(key, { count: 1, lastTime: now, hash })
      }
    }

    return true
  }

  private createSimpleHash(str: string): string {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convert to 32-bit integer
    }
    return hash.toString(36)
  }

  // 🚀 METODI PUBBLICI
  debug(message: string, data?: any) {
    if (this.shouldLog('DEBUG', message)) {
      console.log(this.formatMessage('DEBUG', message, data))
    }
  }

  info(message: string, data?: any) {
    if (this.shouldLog('INFO', message)) {
      console.log(this.formatMessage('INFO', message, data))
    }
  }

  warn(message: string, data?: any) {
    if (this.shouldLog('WARN', message)) {
      console.warn(this.formatMessage('WARN', message, data))
    }
  }

  error(message: string, data?: any) {
    if (this.shouldLog('ERROR', message)) {
      console.error(this.formatMessage('ERROR', message, data))
    }
  }

  // 🔒 ONE-TIME LOG (perfetto per inizializzazioni)
  once(level: LogLevel, key: string, message: string, data?: any) {
    const fullKey = `${this.component}-${key}`
    if (!this.oneTimeFlags.has(fullKey)) {
      this.oneTimeFlags.add(fullKey)
      this[level.toLowerCase() as keyof Logger](message, data)
    }
  }

  // 📊 GROUP LOGGING per operazioni complesse
  group(title: string, callback: () => void) {
    if (LOG_CONFIG.enableDebug) {
      console.group(`🎯 [${this.component}] ${title}`)
      callback()
      console.groupEnd()
    } else {
      callback()
    }
  }

  // 🎯 PERFORMANCE TIMING
  time(label: string) {
    if (LOG_CONFIG.enableDebug) {
      console.time(`⏱️ [${this.component}] ${label}`)
    }
  }

  timeEnd(label: string) {
    if (LOG_CONFIG.enableDebug) {
      console.timeEnd(`⏱️ [${this.component}] ${label}`)
    }
  }
}

// 🏭 FACTORY per creare logger specifici
export function createLogger(component: string): Logger {
  return new Logger(component)
}

// 🎯 LOGGER PRE-CONFIGURATI per componenti principali
export const loggers = {
  intro: createLogger('IntroAnimation'),
  particles: createLogger('ParticleBackground'), 
  sphere: createLogger('BackgroundSphere'),
  hero: createLogger('HeroSection'),
  page: createLogger('Page')
}

// 🔧 UTILITY per configurazione runtime
export function setLogLevel(level: LogLevel) {
  (LOG_CONFIG as any).level = level
}

export function setDebugMode(enabled: boolean) {
  (LOG_CONFIG as any).enableDebug = enabled
}

export function getLogConfig(): Readonly<LogConfig> {
  return LOG_CONFIG
}
