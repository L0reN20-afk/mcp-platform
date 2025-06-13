'use client'

import { motion } from 'framer-motion'
import { 
  Download, 
  Zap, 
  Clock, 
  Shield, 
  ArrowRight,
  Sparkles
} from 'lucide-react'
import { trackEvent } from '@/lib/hooks/useApi'

interface CTASectionProps {
  onTrialClick?: () => void
}

export default function CTASection({ onTrialClick }: CTASectionProps) {
  const handleTrialClick = async () => {
    try {
      // Track trial button click
      await trackEvent('trial_modal_opened', {
        section: 'cta',
        user_agent: navigator.userAgent
      })
    } catch (err) {
      console.error('Tracking error:', err)
    }

    if (onTrialClick) {
      onTrialClick()
    } else {
      console.log('Trial modal dovrebbe aprirsi')
    }
  }

  const handleDemoClick = async () => {
    try {
      await trackEvent('demo_live_clicked', { section: 'cta' })
      // TODO: Implementare demo live o scroll alla sezione demo
      const demoSection = document.querySelector('#demo')
      if (demoSection) {
        demoSection.scrollIntoView({ behavior: 'smooth' })
      }
    } catch (err) {
      console.error('Tracking error:', err)
    }
  }

  const trustSignals = [
    'SSL 256-bit encryption',
    'GDPR Compliant',
    '24/7 Monitoring'
  ]

  return (
    <section className="cta-section">
      
      <div className="cta-container mx-auto relative z-10">
        {/* Main CTA */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          {/* Urgency Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="cta-urgency-badge bg-gradient-to-r from-warning-600/20 to-success-600/20 border border-warning-400/30"
          >
            <Sparkles className="cta-urgency-icon text-warning-400 animate-pulse" />
            <span className="text-warning-400 font-semibold">🔥 Trial 48h in Scadenza - Ultimi Posti Disponibili</span>
          </motion.div>

          {/* Main Headline */}
          <div className="cta-headline-container">
            <div className="cta-headline-wrapper">
              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="cta-title leading-tight"
              >
                Non Perdere{' '}
                <span className="bg-gradient-to-r from-warning-400 via-primary-400 to-accent-400 bg-clip-text text-transparent">
                  l&apos;Opportunità
                </span>
              </motion.h2>
              {/* Linea decorativa warning-accent */}
              <div className="cta-divider bg-gradient-to-r from-warning-500 to-accent-500"></div>
            </div>
          </div>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="cta-subtitle text-gray-300"
            style={{ filter: 'brightness(1.1)' }}
          >
            Unisciti a <span className="text-primary-400 font-semibold">1000+ sviluppatori</span> che hanno già 
            rivoluzionato il loro workflow con i server MCP professionali
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="cta-buttons-container"
          >
            <motion.button
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleTrialClick}
              className="cta-button-primary group bg-gradient-to-r from-warning-600 to-success-600 text-white hover:shadow-2xl hover:shadow-warning-500/25 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-warning-400 to-success-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <Download className="cta-button-primary-icon group-hover:animate-bounce relative z-10" />
              <span className="relative z-10">Prova Trial 48h GRATIS</span>
              <div className="cta-button-primary-badge bg-white/20 relative z-10">
                BETA
              </div>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleDemoClick}
              className="cta-button-secondary group border-white/30 text-white hover:border-accent-400 hover:text-accent-400"
            >
              <span>Vedi Demo Live</span>
              <ArrowRight className="cta-button-secondary-icon group-hover:translate-x-1" />
            </motion.button>
          </motion.div>

          {/* Urgency Timer Effect */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="cta-timer-container bg-black/60 backdrop-blur-lg border border-warning-400/30"
          >
            <div className="cta-timer-content">
              <Clock className="cta-timer-icon text-warning-400 animate-pulse" />
              <div className="cta-timer-text">
                <div className="cta-timer-title text-white">48 Ore Gratuite</div>
                <div className="cta-timer-subtitle text-warning-400">Accesso completo a tutto</div>
              </div>
            </div>
            <div className="cta-timer-features text-gray-400">
              <div className="cta-timer-feature">
                <Zap className="cta-timer-feature-icon text-primary-400" />
                <span>Setup istantaneo</span>
              </div>
              <div className="cta-timer-feature">
                <Shield className="cta-timer-feature-icon text-success-400" />
                <span>Nessuna carta richiesta</span>
              </div>
            </div>
          </motion.div>

          {/* Trust Signals */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="cta-trust-signals text-gray-400"
          >
            {trustSignals.map((signal, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                className="cta-trust-signal"
              >
                <Shield className="cta-trust-signal-icon text-success-400" />
                <span>{signal}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
