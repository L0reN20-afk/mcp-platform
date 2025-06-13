// src/lib/whitelist.ts
// Sistema di controllo accessi per il trial MCP

const ALLOWED_DOMAINS = [
  'gmail.com',
  'outlook.com', 
  'hotmail.com',
  'company.com',        // Aggiungi domini aziendali specifici
  'developer.com'
]

const ALLOWED_EMAILS = [
  'lorenzoromano.lr17@gmail.com',
  'beta-tester@gmail.com',
  // Aggiungi email specifiche autorizzate
]

const BLOCKED_DOMAINS = [
  'tempmail.com',
  '10minutemail.com',
  'guerrillamail.com'
  // Blocca servizi email temporanei
]

export function isEmailAllowed(email: string): { allowed: boolean; reason: string } {
  // 1. Controlla email specifiche autorizzate
  if (ALLOWED_EMAILS.includes(email.toLowerCase())) {
    return { allowed: true, reason: 'Email autorizzata' }
  }

  // 2. Estrai dominio
  const domain = email.split('@')[1]?.toLowerCase()
  if (!domain) {
    return { allowed: false, reason: 'Email non valida' }
  }

  // 3. Controlla domini bloccati
  if (BLOCKED_DOMAINS.includes(domain)) {
    return { allowed: false, reason: 'Servizio email temporaneo non consentito' }
  }

  // 4. Controlla domini autorizzati (se lista non vuota)
  if (ALLOWED_DOMAINS.length > 0 && !ALLOWED_DOMAINS.includes(domain)) {
    return { allowed: false, reason: 'Dominio email non autorizzato per il beta test' }
  }

  return { allowed: true, reason: 'Email valida' }
}
