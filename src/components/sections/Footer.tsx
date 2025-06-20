'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import Image from 'next/image'
import { 
  Mail, 
  Code2,
  FileCode,
  FileText,
  FolderOpen,
  Shield,
  Heart,
  ExternalLink,
  ArrowUp,
  Loader2,
  CheckCircle
} from 'lucide-react'
import { useNewsletterSubscription, trackEvent } from '@/lib/hooks/useApi'

export default function Footer() {
  const [email, setEmail] = useState('')
  const { subscribe, loading, success, error, reset } = useNewsletterSubscription()

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !email.includes('@')) {
      return
    }

    // Track newsletter signup intent
    await trackEvent('newsletter_signup_attempt', {
      email_domain: email.split('@')[1],
      source: 'footer'
    })

    const result = await subscribe(email)
    
    if (result) {
      await trackEvent('newsletter_signup_success', {
        email_domain: email.split('@')[1]
      })
      setEmail('')
    }
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const footerSections = [
    {
      title: 'Server MCP',
      links: [
        { name: 'VS Code Server', href: '#vscode', hasIcon: true, Icon: Code2, iconColor: 'text-primary-400' },
        { name: 'Visual Studio 2022', href: '#visual-studio', hasIcon: true, Icon: FileCode, iconColor: 'text-secondary-400' },
        { name: 'Word Server', href: '#word', hasIcon: true, Icon: FileText, iconColor: 'text-accent-400' },
        { name: 'Filesystem Server', href: '#filesystem', hasIcon: true, Icon: FolderOpen, iconColor: 'text-success-400' }
      ]
    },
    {
      title: 'Soluzioni',
      links: [
        { name: 'Coding Package', href: '#coding', hasIcon: false },
        { name: 'Office Package', href: '#office', hasIcon: false },
        { name: 'Server Individuali', href: '#individual', hasIcon: false },
        { name: 'Enterprise Custom', href: '#enterprise', hasIcon: false }
      ]
    },
    {
      title: 'Risorse',
      links: [
        { name: 'Documentazione', href: '#docs', external: true, hasIcon: false },
        { name: 'API Reference', href: '#api', external: true, hasIcon: false },
        { name: 'Tutorial Video', href: '#tutorials', external: true, hasIcon: false }
      ]
    },
    {
      title: 'Supporto',
      links: [
        { name: 'Centro Assistenza', href: '#help', hasIcon: false }
      ]
    }
  ]

  const socialLinks: any[] = []

  const legalLinks = [
    { name: 'Privacy Policy', href: '#privacy' },
    { name: 'Terms of Service', href: '#terms' },
    { name: 'Cookie Policy', href: '#cookies' },
    { name: 'GDPR Compliance', href: '#gdpr' }
  ]

  return (
    <footer className="footer-section bg-black border-t border-white/10">
      <div className="footer-container mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="footer-newsletter-section"
        >
          <div className="footer-newsletter-container">
            <h3 className="footer-newsletter-title text-white">
              Rimani aggiornato sulle <span className="bg-gradient-to-r from-[#ff6b6b] to-[#4ecdc4] bg-clip-text text-transparent">novità MCP</span>
            </h3>
            <p className="footer-newsletter-description text-gray-400">
              Ricevi updates sui nuovi server, tutorial esclusivi e offerte speciali
            </p>
            
            <form onSubmit={handleNewsletterSubmit} className="footer-newsletter-form">
              <div className="flex-1">
                <input
                  type="email"
                  placeholder="Inserisci la tua email..."
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    if (error || success) reset()
                  }}
                  disabled={loading}
                  className="footer-newsletter-input w-full bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-primary-400 focus:bg-white/10 transition-all duration-300 disabled:opacity-50"
                  required
                />
              </div>
              <motion.button
                whileHover={{ scale: loading ? 1 : 1.05 }}
                whileTap={{ scale: loading ? 1 : 0.95 }}
                type="submit"
                disabled={loading || !email}
                className="footer-newsletter-button bg-gradient-to-r from-[#ff6b6b] to-[#4ecdc4] text-white hover:shadow-lg hover:shadow-[#ff6b6b]/25 disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : success ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  <Mail className="w-4 h-4" />
                )}
                <span>
                  {loading ? 'Iscrizione...' : success ? 'Iscritto!' : 'Iscriviti'}
                </span>
              </motion.button>
            </form>
            
            {/* Success Message */}
            {success && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 text-green-400 text-sm"
              >
                ✅ Iscrizione completata! Controlla la tua email per la conferma.
              </motion.div>
            )}

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 text-red-400 text-sm"
              >
                ❌ {error}
              </motion.div>
            )}
            
            <p className="footer-newsletter-disclaimer text-gray-500">
              Nessuno spam. Puoi cancellarti in qualsiasi momento.
            </p>
          </div>
        </motion.div>

        <div className="footer-main-section">
          <div className="footer-main-grid">
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="footer-brand-section"
              >
                <div className="footer-brand-header">
                  <div className="relative">
                    <Image
                      src="/images/logo.png"
                      width={36}
                      height={36}
                      alt="Buildmyth Logo"
                      className="footer-brand-logo cursor-pointer"
                      priority
                    />
                  </div>
                  <span className="footer-brand-name bg-gradient-to-r from-[#ff6b6b] to-[#4ecdc4] bg-clip-text text-transparent">
                    Buildmyth
                  </span>
                </div>
                
                <p className="footer-brand-description text-gray-400 leading-relaxed">
                  La piattaforma leader per server MCP professionali. 
                  Automatizza VS Code, Visual Studio, Word e molto altro con 
                  la potenza del Model Context Protocol.
                </p>

                <div className="footer-social-links">
                  {socialLinks.map((social, index) => (
                    <motion.a
                      key={social.label}
                      href={social.href}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      whileHover={{ scale: 1.2, y: -2 }}
                      className="footer-social-link bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:border-primary-400 hover:bg-primary-400/10"
                      aria-label={social.label}
                    >
                      {social.Icon ? (
                        <social.Icon className="footer-social-icon" />
                      ) : (
                        <span className="font-bold text-purple-400">{social.text}</span>
                      )}
                    </motion.a>
                  ))}
                </div>
              </motion.div>
            </div>

            {footerSections.map((section, sectionIndex) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: sectionIndex * 0.1 }}
                className="footer-links-section lg:col-span-1"
              >
                <h4 className="footer-links-title text-white font-semibold">
                  {section.title}
                </h4>
                <ul className="footer-links-list">
                  {section.links.map((link, linkIndex) => (
                    <motion.li
                      key={link.name}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: linkIndex * 0.05 }}
                    >
                      <a
                        href={link.href}
                        className="footer-link text-gray-400 hover:text-white transition-colors duration-300 group"
                      >
                        {link.hasIcon && 'Icon' in link && link.Icon && (
                          <link.Icon className={`footer-link-icon ${'iconColor' in link ? link.iconColor : 'text-gray-400'}`} />
                        )}
                        <span className="footer-link-text group-hover:translate-x-1 transition-transform duration-300">
                          {link.name}
                        </span>
                        {'external' in link && link.external && (
                          <ExternalLink className="footer-external-icon group-hover:opacity-100 transition-opacity duration-300" />
                        )}
                      </a>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="footer-bottom-section">
          <div className="footer-bottom-content">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="footer-copyright text-gray-400"
            >
              <p className="footer-copyright-text">
                <span>© 2025 Buildmyth. Tutti i diritti riservati.</span>
                <span className="text-red-400">•</span>
                <span className="flex items-center space-x-1">
                  <span>Made with</span>
                  <Heart className="footer-heart-icon text-red-400 fill-current animate-pulse" />
                  <span>in Italy</span>
                </span>
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="footer-legal-links"
            >
              {legalLinks.map((link, index) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="footer-legal-link text-gray-400 hover:text-white transition-colors duration-300"
                >
                  {link.name}
                </a>
              ))}
            </motion.div>

            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.9 }}
              onClick={scrollToTop}
              className="footer-scroll-top-button bg-gradient-to-r from-[#e43838] to-[#205e5e] hover:from-[#ff6b6b] hover:to-[#4ecdc4] text-white hover:shadow-lg hover:shadow-[#e43838]/25"
              aria-label="Torna in cima"
            >
              <ArrowUp className="footer-scroll-top-icon" />
            </motion.button>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="footer-security-section"
        >
          <div className="footer-security-content text-gray-500">
            <div className="footer-security-badge">
              <Shield className="footer-security-icon text-success-400" />
              <span>SSL Secured</span>
            </div>
            <div className="footer-security-badge">
              <Shield className="footer-security-icon text-success-400" />
              <span>GDPR Compliant</span>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}
