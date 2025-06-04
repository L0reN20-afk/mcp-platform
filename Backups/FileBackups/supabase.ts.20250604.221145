// Database utilities for MCP Platform
// Configurazione Supabase e funzioni helper per interazione con database

import { createClient } from '@supabase/supabase-js'
import type { 
  DeviceTrial, 
  DeviceEvent, 
  NewsletterSubscriber, 
  AdminAlert,
  TrialStatus,
  EventType 
} from '@/types/database'

// Configurazione Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_KEY!

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseKey)

// Utility Functions
export class DatabaseService {
  
  // Device Trial Management
  static async getDeviceTrial(deviceFingerprint: string): Promise<DeviceTrial | null> {
    const { data, error } = await supabase
      .from('device_trials')
      .select('*')
      .eq('device_fingerprint', deviceFingerprint)
      .single()
    
    if (error) {
      console.error('Error fetching device trial:', error)
      return null
    }
    
    return data
  }

  static async createDeviceTrial(
    deviceFingerprint: string,
    email?: string,
    ip?: string,
    country?: string
  ): Promise<DeviceTrial | null> {
    const now = new Date()
    const trialExpires = new Date(now.getTime() + 48 * 60 * 60 * 1000) // 48 hours

    const { data, error } = await supabase
      .from('device_trials')
      .insert({
        device_fingerprint: deviceFingerprint,
        email,
        download_ip: ip,
        country,
        first_download: now.toISOString(),
        trial_expires: trialExpires.toISOString(),
        status: 'active' as TrialStatus
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating device trial:', error)
      return null
    }

    return data
  }

  static async updateTrialStatus(
    deviceFingerprint: string, 
    status: TrialStatus
  ): Promise<boolean> {
    const { error } = await supabase
      .from('device_trials')
      .update({ status })
      .eq('device_fingerprint', deviceFingerprint)

    if (error) {
      console.error('Error updating trial status:', error)
      return false
    }

    return true
  }

  static async isTrialValid(deviceFingerprint: string): Promise<{
    valid: boolean
    trial?: DeviceTrial
    remainingHours?: number
  }> {
    const trial = await this.getDeviceTrial(deviceFingerprint)
    
    if (!trial) {
      return { valid: false }
    }

    if (trial.status !== 'active') {
      return { valid: false, trial }
    }

    const now = new Date()
    const expires = new Date(trial.trial_expires)
    const remainingMs = expires.getTime() - now.getTime()
    const remainingHours = Math.max(0, remainingMs / (1000 * 60 * 60))

    const valid = remainingHours > 0

    return { 
      valid, 
      trial, 
      remainingHours: Math.round(remainingHours * 100) / 100 
    }
  }

  // Device Events
  static async logDeviceEvent(
    deviceFingerprint: string,
    eventType: EventType,
    details?: Record<string, any>
  ): Promise<boolean> {
    const { error } = await supabase
      .from('device_events')
      .insert({
        device_fingerprint: deviceFingerprint,
        event_type: eventType,
        timestamp: new Date().toISOString(),
        details: details || {}
      })

    if (error) {
      console.error('Error logging device event:', error)
      return false
    }

    return true
  }

  static async getDeviceEvents(
    deviceFingerprint: string,
    limit: number = 10
  ): Promise<DeviceEvent[]> {
    const { data, error } = await supabase
      .from('device_events')
      .select('*')
      .eq('device_fingerprint', deviceFingerprint)
      .order('timestamp', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Error fetching device events:', error)
      return []
    }

    return data || []
  }

  // Newsletter Management
  static async subscribeNewsletter(email: string): Promise<boolean> {
    const { error } = await supabase
      .from('newsletter_subscribers')
      .upsert({
        email,
        subscribed_at: new Date().toISOString(),
        status: 'active'
      })

    if (error) {
      console.error('Error subscribing to newsletter:', error)
      return false
    }

    return true
  }

  // Admin Stats
  static async getAdminStats(): Promise<{
    totalDevices: number
    activeTrials: number
    expiredTrials: number
    bannedDevices: number
    newsletterSubscribers: number
    downloadsToday: number
    topCountries: Array<{ country: string; count: number }>
  }> {
    try {
      // Get basic counts
      const [
        totalDevicesResult,
        activeTrialsResult,
        expiredTrialsResult,
        bannedDevicesResult,
        newsletterResult
      ] = await Promise.all([
        supabase.from('device_trials').select('*', { count: 'exact', head: true }),
        supabase.from('device_trials').select('*', { count: 'exact', head: true }).eq('status', 'active'),
        supabase.from('device_trials').select('*', { count: 'exact', head: true }).eq('status', 'expired'),
        supabase.from('device_trials').select('*', { count: 'exact', head: true }).eq('status', 'banned'),
        supabase.from('newsletter_subscribers').select('*', { count: 'exact', head: true }).eq('status', 'active')
      ])

      // Get downloads today
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const { count: downloadsToday } = await supabase
        .from('device_trials')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', today.toISOString())

      // Get top countries
      const { data: countryData } = await supabase
        .from('device_trials')
        .select('country')
        .not('country', 'is', null)

      const countryCounts: Record<string, number> = {}
      countryData?.forEach(item => {
        if (item.country) {
          countryCounts[item.country] = (countryCounts[item.country] || 0) + 1
        }
      })

      const topCountries = Object.entries(countryCounts)
        .map(([country, count]) => ({ country, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5)

      return {
        totalDevices: totalDevicesResult.count || 0,
        activeTrials: activeTrialsResult.count || 0,
        expiredTrials: expiredTrialsResult.count || 0,
        bannedDevices: bannedDevicesResult.count || 0,
        newsletterSubscribers: newsletterResult.count || 0,
        downloadsToday: downloadsToday || 0,
        topCountries
      }
    } catch (error) {
      console.error('Error fetching admin stats:', error)
      return {
        totalDevices: 0,
        activeTrials: 0,
        expiredTrials: 0,
        bannedDevices: 0,
        newsletterSubscribers: 0,
        downloadsToday: 0,
        topCountries: []
      }
    }
  }

  // Alert Management
  static async createAlert(
    alertType: AdminAlert['alert_type'],
    deviceFingerprint?: string,
    details: Record<string, any> = {},
    severity: 'low' | 'medium' | 'high' = 'medium'
  ): Promise<boolean> {
    const { error } = await supabase
      .from('admin_alerts')
      .insert({
        alert_type: alertType,
        device_fingerprint: deviceFingerprint,
        details,
        severity,
        resolved: false,
        created_at: new Date().toISOString()
      })

    if (error) {
      console.error('Error creating alert:', error)
      return false
    }

    return true
  }

  // IP-based detection
  static async checkSuspiciousIP(ip: string): Promise<boolean> {
    const { data } = await supabase
      .from('device_trials')
      .select('device_fingerprint')
      .eq('download_ip', ip)
    
    // If more than 3 different devices from same IP, flag as suspicious
    const uniqueDevices = new Set(data?.map(d => d.device_fingerprint))
    
    if (uniqueDevices.size > 3) {
      await this.createAlert(
        'multiple_devices_same_ip',
        undefined,
        { ip, device_count: uniqueDevices.size },
        'high'
      )
      return true
    }

    return false
  }
}

// Utility function to get client IP
export function getClientIP(request: Request): string {
  const forwardedFor = request.headers.get('x-forwarded-for')
  const realIP = request.headers.get('x-real-ip')
  
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim()
  }
  
  if (realIP) {
    return realIP
  }
  
  return 'unknown'
}

// Utility function to get country from IP (basic implementation)
export async function getCountryFromIP(ip: string): Promise<string> {
  try {
    // Using a free IP geolocation service
    const response = await fetch(`http://ip-api.com/json/${ip}`)
    const data = await response.json()
    return data.country || 'Unknown'
  } catch (error) {
    console.error('Error getting country from IP:', error)
    return 'Unknown'
  }
}
