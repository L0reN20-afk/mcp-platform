'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { 
  Zap, 
  Mail, 
  Github, 
  Twitter, 
  Linkedin,
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
        { name: 'VS Code Server', href: '#vscode', hasIcon: true, Icon: Code2 },
        { name: 'Visual Studio 2022', href: '#visual-studio', hasIcon: true, Icon: FileCode },
        { name: 'Word Server', href: '#word', hasIcon: true, Icon: FileText },
        { name: 'Filesystem Server', href: '#filesystem', hasIcon: true, Icon: FolderOpen }
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
        { name: 'Tutorial Video', href: '#tutorials', external: true, hasIcon: false },
        { name: 'Blog Tecnico', href: '#blog', external: true, hasIcon: false }
      ]
    },
    {
      title: 'Supporto',
      links: [
        { name: 'Centro Assistenza', href: '#help', hasIcon: false },
        { name: 'Community Discord', href: '#discord', external: true, hasIcon: false },
        { name: 'Contatta Supporto', href: '#contact', hasIcon: false },
        { name: 'Status Sistema', href: '#status', external: true, hasIcon: false }
      ]
    }
  ]

  const socialLinks = [
    { Icon: Twitter, href: '#twitter', label: 'Twitter' },
    { Icon: Github, href: '#github', label: 'GitHub' },
    { Icon: Linkedin, href: '#linkedin', label: 'LinkedIn' },
    { Icon: null, href: '#discord', label: 'Discord', text: 'D' }
  ]

  const legalLinks = [
    { name: 'Privacy Policy', href: '#privacy' },
    { name: 'Terms of Service', href: '#terms' },
    { name: 'Cookie Policy', href: '#cookies' },
    { name: 'GDPR Compliance', href: '#gdpr' }
  ]

  return (
    <footer className="relative bg-black border-t border-white/10">
      <div className="container mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="py-16 border-b border-white/10"
        >
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-3xl font-bold text-white mb-4">
              Rimani aggiornato sulle <span className="text-primary-400">novità MCP</span>
            </h3>
            <p className="text-gray-400 mb-8 text-lg">
              Ricevi updates sui nuovi server, tutorial esclusivi e offerte speciali
            </p>
            
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
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
                  className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-full text-white placeholder-gray-400 focus:outline-none focus:border-primary-400 focus:bg-white/10 transition-all duration-300 disabled:opacity-50"
                  required
                />
              </div>
              <motion.button
                whileHover={{ scale: loading ? 1 : 1.05 }}
                whileTap={{ scale: loading ? 1 : 0.95 }}
                type="submit"
                disabled={loading || !email}
                className="bg-gradient-to-r from-primary-600 to-accent-600 text-white px-8 py-4 rounded-full font-semibold hover:shadow-lg hover:shadow-primary-500/25 transition-all duration-300 flex items-center space-x-2 justify-center disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : success ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <Mail className="w-5 h-5" />
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
            
            <p className="text-sm text-gray-500 mt-4">
              Nessuno spam. Puoi cancellarti in qualsiasi momento.
            </p>
          </div>
        </motion.div>

        <div className="py-16">
          <div className="grid lg:grid-cols-6 gap-12">
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="mb-8"
              >
                <div className="flex items-center space-x-3 mb-6">
                  <div className="relative">
                    <Zap className="w-10 h-10 text-primary-500" />
                    <div className="absolute inset-0 bg-primary-500/20 blur-lg animate-pulse"></div>
                  </div>
                  <span className="text-2xl font-bold bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
                    MCP Platform
                  </span>
                </div>
                
                <p className="text-gray-400 mb-6 leading-relaxed">
                  La piattaforma leader per server MCP professionali. 
                  Automatizza VS Code, Visual Studio, Word e molto altro con 
                  la potenza del Model Context Protocol.
                </p>

                <div className="flex space-x-4">
                  {socialLinks.map((social, index) => (
                    <motion.a
                      key={social.label}
                      href={social.href}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      whileHover={{ scale: 1.2, y: -2 }}
                      className="w-12 h-12 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:border-primary-400 hover:bg-primary-400/10 transition-all duration-300"
                      aria-label={social.label}
                    >
                      {social.Icon ? (
                        <social.Icon className="w-5 h-5" />
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
                className="lg:col-span-1"
              >
                <h4 className="text-white font-semibold text-lg mb-6">
                  {section.title}
                </h4>
                <ul className="space-y-4">
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
                        className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center space-x-2 group"
                      >
                        {link.hasIcon && 'Icon' in link && link.Icon && (
                          <link.Icon className="w-4 h-4 text-primary-400" />
                        )}
                        <span className="group-hover:translate-x-1 transition-transform duration-300">
                          {link.name}
                        </span>
                        {'external' in link && link.external && (
                          <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        )}
                      </a>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="py-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-gray-400 text-sm"
            >
              <p className="flex items-center space-x-1">
                <span>© 2024 MCP Platform. Tutti i diritti riservati.</span>
                <span className="text-red-400">•</span>
                <span className="flex items-center space-x-1">
                  <span>Made with</span>
                  <Heart className="w-4 h-4 text-red-400 fill-current animate-pulse" />
                  <span>in Italy</span>
                </span>
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="flex flex-wrap items-center space-x-6 text-sm"
            >
              {legalLinks.map((link, index) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-gray-400 hover:text-white transition-colors duration-300"
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
              className="w-12 h-12 bg-primary-600 hover:bg-primary-500 rounded-full flex items-center justify-center text-white transition-all duration-300 hover:shadow-lg hover:shadow-primary-500/25"
              aria-label="Torna in cima"
            >
              <ArrowUp className="w-5 h-5" />
            </motion.button>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="py-6 border-t border-white/5"
        >
          <div className="flex flex-wrap justify-center items-center gap-8 text-gray-500 text-sm">
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4 text-success-400" />
              <span>SSL Secured</span>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4 text-success-400" />
              <span>GDPR Compliant</span>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4 text-success-400" />
              <span>SOC 2 Type II</span>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4 text-success-400" />
              <span>ISO 27001</span>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}