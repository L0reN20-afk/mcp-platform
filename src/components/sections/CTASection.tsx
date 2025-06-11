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
    <section className="relative py-16 section-container">
      
      <div className="container mx-auto relative z-10">
        {/* Main CTA */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-5xl mx-auto"
        >
          {/* Urgency Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-warning-600/20 to-success-600/20 border border-warning-400/30 rounded-full px-5 py-3 mb-8"
          >
            <Sparkles className="w-4 h-4 text-warning-400 animate-pulse" />
            <span className="text-warning-400 font-semibold">🔥 Trial 48h in Scadenza - Ultimi Posti Disponibili</span>
          </motion.div>

          {/* Main Headline */}
          <div className="max-w-5xl mx-auto mb-6">
            <div className="px-6 py-4">
              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
              >
                Non Perdere{' '}
                <span className="bg-gradient-to-r from-warning-400 via-primary-400 to-accent-400 bg-clip-text text-transparent">
                  l&apos;Opportunità
                </span>
              </motion.h2>
              {/* Linea decorativa warning-accent */}
              <div className="w-32 h-1 bg-gradient-to-r from-warning-500 to-accent-500 mx-auto rounded-full"></div>
            </div>
          </div>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-2xl text-gray-300 mb-12 max-w-3xl mx-auto"
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
            className="flex flex-col sm:flex-row gap-5 justify-center items-center mb-8"
          >
            <motion.button
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleTrialClick}
              className="group bg-gradient-to-r from-warning-600 to-success-600 text-white px-9 py-4 rounded-full font-bold text-xl flex items-center space-x-4 hover:shadow-2xl hover:shadow-warning-500/25 transition-all duration-300 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-warning-400 to-success-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <Download className="w-5 h-5 group-hover:animate-bounce relative z-10" />
              <span className="relative z-10">Prova Trial 48h GRATIS</span>
              <div className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium relative z-10">
                BETA
              </div>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleDemoClick}
              className="group border-2 border-white/30 text-white px-9 py-4 rounded-full font-semibold text-xl hover:border-accent-400 hover:text-accent-400 transition-all duration-300 flex items-center space-x-3"
            >
              <span>Vedi Demo Live</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </motion.button>
          </motion.div>

          {/* Urgency Timer Effect */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-black/60 backdrop-blur-lg border border-warning-400/30 rounded-2xl p-7 max-w-2xl mx-auto mb-16"
          >
            <div className="flex items-center justify-center space-x-3 mb-4">
              <Clock className="w-7 h-7 text-warning-400 animate-pulse" />
              <div className="text-center">
                <div className="text-3xl font-bold text-white">48 Ore Gratuite</div>
                <div className="text-warning-400 font-medium">Accesso completo a tutto</div>
              </div>
            </div>
            <div className="flex items-center justify-center space-x-6 text-sm text-gray-400">
              <div className="flex items-center space-x-2">
                <Zap className="w-3 h-3 text-primary-400" />
                <span>Setup istantaneo</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="w-3 h-3 text-success-400" />
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
            className="flex flex-wrap justify-center items-center gap-7 text-gray-400 text-sm"
          >
            {trustSignals.map((signal, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                className="flex items-center space-x-2"
              >
                <Shield className="w-3 h-3 text-success-400" />
                <span>{signal}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
