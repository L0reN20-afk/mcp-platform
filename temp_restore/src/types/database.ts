// Database Types for MCP Platform
// Definisce le interfacce TypeScript per tutte le tabelle del database Supabase

export interface DeviceTrial {
  id: string
  device_fingerprint: string
  email?: string
  auth_provider?: 'google' | 'microsoft' | 'apple' | 'unknown'  // ← OAuth provider
  email_updated_at?: string // ← Timestamp aggiornamento email
  download_ip?: string
  country?: string
  first_download: string // ISO timestamp
  trial_expires: string // ISO timestamp
  status: 'active' | 'expired' | 'banned'
  created_at: string // ISO timestamp
}

export interface DeviceEvent {
  id: string
  device_fingerprint: string
  event_type: 'launch' | 'offline_check' | 'server_ping' | 'registration' | 'trial_check' | 'oauth_login' | 'email_updated'  // ← Nuovi event types
  timestamp: string // ISO timestamp
  details?: Record<string, any>
}

export interface NewsletterSubscriber {
  id: string
  email: string
  subscribed_at: string // ISO timestamp
  status: 'active' | 'unsubscribed'
}

export interface AdminAlert {
  id: string
  alert_type: 
    | 'multiple_devices_same_ip' 
    | 'clock_manipulation' 
    | 'vm_detected'
    | 'trial_expired'
    | 'suspicious_behavior'
    | 'oauth_login_failed'     // ← Nuovo alert type
  device_fingerprint?: string
  details: Record<string, any>
  severity: 'low' | 'medium' | 'high'
  resolved: boolean
  created_at: string // ISO timestamp
}

// API Request/Response Types
export interface TrialDownloadRequest {
  email?: string
  user_agent?: string
  referrer?: string
}

export interface TrialDownloadResponse {
  success: boolean
  download_url?: string
  trial_id?: string
  message?: string
  error?: string
}

export interface DeviceRegisterRequest {
  device_fingerprint: string
  user_email?: string           // ← OAuth email
  auth_provider?: string        // ← OAuth provider  
  auth_token?: string          // ← OAuth token (opzionale)
  system_info?: {
    os: string
    machine_name: string
    user_name: string
    dotnet_version: string
    [key: string]: any
  }
}

export interface DeviceRegisterResponse {
  success: boolean
  trial_expires?: string
  trial_remaining_hours?: number
  user_email?: string           // ← Email utente
  auth_provider?: string        // ← Provider OAuth  
  is_new_device?: boolean
  message?: string
  error?: string
}

export interface TrialCheckRequest {
  device_fingerprint: string
}

export interface TrialCheckResponse {
  success: boolean
  trial_valid: boolean
  trial_expires?: string
  trial_remaining_hours?: number
  status?: 'active' | 'expired' | 'banned'
  user_email?: string           // ← Email utente se disponibile
  auth_provider?: string        // ← Provider OAuth se disponibile
  message?: string
  error?: string
}

export interface AdminStatsResponse {
  total_devices: number
  active_trials: number
  expired_trials: number
  banned_devices: number
  newsletter_subscribers: number
  downloads_today: number
  downloads_this_week: number
  downloads_this_month: number
  // OAuth Statistics
  total_oauth_users: number     // ← Nuove statistiche OAuth
  google_users: number
  microsoft_users: number  
  apple_users: number
  top_countries: Array<{
    country: string
    count: number
  }>
  top_oauth_providers: Array<{  // ← Top provider OAuth
    provider: string
    count: number
  }>
  recent_activity: DeviceEvent[]
  alerts_unresolved: number
}

export interface DeviceInfo {
  device_fingerprint: string
  email?: string
  auth_provider?: string        // ← Provider OAuth
  country?: string
  first_download: string
  trial_expires: string
  status: string
  last_seen?: string
  total_launches: number
  ip_address?: string
}

// OAuth Types
export interface OAuthStatsResponse {
  totalOAuthUsers: number
  googleUsers: number
  microsoftUsers: number
  appleUsers: number
  topProviders: Array<{
    provider: string
    count: number
  }>
}

// Utility Types
export type DatabaseTables = 
  | 'device_trials'
  | 'device_events' 
  | 'newsletter_subscribers'
  | 'admin_alerts'

export type TrialStatus = 'active' | 'expired' | 'banned'
export type AlertSeverity = 'low' | 'medium' | 'high'
export type EventType = 'launch' | 'offline_check' | 'server_ping' | 'registration' | 'trial_check' | 'oauth_login' | 'email_updated'
export type AuthProvider = 'google' | 'microsoft' | 'apple' | 'unknown'
