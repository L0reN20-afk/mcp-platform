'use client'

import { motion } from 'framer-motion'
import { 
  Download, 
  Zap, 
  Clock, 
  Shield, 
  Users, 
  Star,
  ArrowRight,
  Sparkles,
  TrendingUp
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

  const urgencyStats = [
    { icon: Users, value: '1000+', label: 'Dev attivi oggi', color: 'text-primary-400' },
    { icon: TrendingUp, value: '250+', label: 'Download oggi', color: 'text-success-400' },
    { icon: Star, value: '4.9/5', label: 'Rating utenti', color: 'text-warning-400' },
    { icon: Shield, value: '99.9%', label: 'Uptime', color: 'text-accent-400' }
  ]

  const trustSignals = [
    'SSL 256-bit encryption',
    'GDPR Compliant',
    'SOC 2 Type II',
    '24/7 Monitoring'
  ]

  return (
    <section className="relative py-20 section-container">
      {/* Background with animated gradients - PIù TRASPARENTE per vedere le particelle */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/30 via-gray-900/15 to-black/30"></div>
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl animate-pulse delay-700"></div>
      </div>
      
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
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-warning-600/20 to-success-600/20 border border-warning-400/30 rounded-full px-6 py-3 mb-8"
          >
            <Sparkles className="w-5 h-5 text-warning-400 animate-pulse" />
            <span className="text-warning-400 font-semibold">🔥 Trial 48h in Scadenza - Ultimi Posti Disponibili</span>
          </motion.div>

          {/* Main Headline */}
          <div className="relative max-w-5xl mx-auto mb-6">
            {/* Safe Zone Background - Protezione dalle particelle di sfondo */}
            <div className="absolute inset-0 bg-black/25 backdrop-blur-md rounded-2xl shadow-2xl shadow-black/50 border border-white/10 -m-6"></div>
            <div className="relative px-6 py-4">
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
            className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-8"
          >
            <motion.button
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleTrialClick}
              className="group bg-gradient-to-r from-warning-600 to-success-600 text-white px-10 py-5 rounded-full font-bold text-xl flex items-center space-x-4 hover:shadow-2xl hover:shadow-warning-500/25 transition-all duration-300 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-warning-400 to-success-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <Download className="w-6 h-6 group-hover:animate-bounce relative z-10" />
              <span className="relative z-10">Prova Trial 48h GRATIS</span>
              <div className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium relative z-10">
                BETA
              </div>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleDemoClick}
              className="group border-2 border-white/30 text-white px-10 py-5 rounded-full font-semibold text-xl hover:border-accent-400 hover:text-accent-400 transition-all duration-300 flex items-center space-x-3"
            >
              <span>Vedi Demo Live</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </motion.button>
          </motion.div>

          {/* Urgency Timer Effect */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-black/60 backdrop-blur-lg border border-warning-400/30 rounded-2xl p-8 max-w-2xl mx-auto mb-16"
          >
            <div className="flex items-center justify-center space-x-3 mb-4">
              <Clock className="w-8 h-8 text-warning-400 animate-pulse" />
              <div className="text-center">
                <div className="text-3xl font-bold text-white">48 Ore Gratuite</div>
                <div className="text-warning-400 font-medium">Accesso completo a tutto</div>
              </div>
            </div>
            <div className="flex items-center justify-center space-x-6 text-sm text-gray-400">
              <div className="flex items-center space-x-2">
                <Zap className="w-4 h-4 text-primary-400" />
                <span>Setup istantaneo</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-success-400" />
                <span>Nessuna carta richiesta</span>
              </div>
            </div>
          </motion.div>

          {/* Social Proof Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16"
          >
            {urgencyStats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                whileHover={{ y: -5, scale: 1.05 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center hover:border-white/20 transition-all duration-300"
              >
                <stat.icon className={`w-10 h-10 ${stat.color} mx-auto mb-3`} />
                <div className={`text-2xl font-bold ${stat.color} mb-1 counter`} 
                     data-target={stat.value.replace(/\D/g, '')} 
                     data-suffix={stat.value.replace(/\d/g, '')}>
                  {stat.value}
                </div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* Trust Signals */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-wrap justify-center items-center gap-8 text-gray-400 text-sm"
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
                <Shield className="w-4 h-4 text-success-400" />
                <span>{signal}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* Final Guarantee */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="mt-12 max-w-2xl mx-auto"
          >
            <div className="bg-gradient-to-r from-success-600/20 to-primary-600/20 border border-success-400/30 rounded-2xl p-6 text-center">
              <Shield className="w-12 h-12 text-success-400 mx-auto mb-4" />
              <h4 className="text-xl font-bold text-white mb-2">💎 Garanzia Soddisfatti o Rimborsati</h4>
              <p className="text-gray-300">
                Non sei convinto? Ti rimborsiamo al 100% entro 30 giorni. 
                <span className="text-success-400 font-semibold"> Zero rischi, massimo risultato.</span>
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
