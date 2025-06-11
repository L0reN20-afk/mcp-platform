'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Crown, 
  Check, 
  Star, 
  Zap, 
  Shield, 
  Rocket,
  Heart,
  Loader2
} from 'lucide-react'
import { useTrialDownload, trackEvent } from '@/lib/hooks/useApi'

interface PricingPlan {
  id: string
  name: string
  price: string
  originalPrice?: string
  description: string
  features: string[]
  popular?: boolean
  cta: string
  icon: React.ComponentType<any>
  color: string
  gradient: string
  badge?: string
}

export default function PricingSection() {
  const [isAnnual, setIsAnnual] = useState(false)

  // API integration
  const { downloadTrial, loading, error } = useTrialDownload()
  const [downloadSuccess, setDownloadSuccess] = useState(false)

  const handleDownloadClick = async (planId: string) => {
    try {
      // Track download intent with plan info
      await trackEvent('trial_download_clicked', {
        section: 'pricing',
        plan_id: planId,
        billing_cycle: isAnnual ? 'annual' : 'monthly',
        user_agent: navigator.userAgent
      })

      const result = await downloadTrial()
      
      if (result && result.success) {
        setDownloadSuccess(true)
        
        // Track successful download
        await trackEvent('trial_download_success', {
          trial_id: result.trial_id,
          download_url: result.download_url,
          source: 'pricing_section',
          plan_selection: planId
        })

        // Redirect to download
        if (result.download_url) {
          window.open(result.download_url, '_blank')
        }

        // Reset success state after 3 seconds
        setTimeout(() => setDownloadSuccess(false), 3000)
      }
    } catch (err) {
      console.error('Download error:', err)
    }
  }

  const handlePlanAction = async (plan: PricingPlan) => {
    if (plan.id === 'beta') {
      // Handle trial download
      await handleDownloadClick(plan.id)
    } else {
      // Handle other plan actions (subscription, contact sales, etc.)
      await trackEvent('plan_action_clicked', {
        section: 'pricing',
        plan_id: plan.id,
        plan_name: plan.name,
        cta: plan.cta,
        billing_cycle: isAnnual ? 'annual' : 'monthly'
      })
      
      // TODO: Implement subscription flow or contact form
      console.log(`Action for plan ${plan.id}:`, plan.cta)
    }
  }

  const plans: PricingPlan[] = [
    {
      id: 'beta',
      name: 'Beta Trial',
      price: 'Gratuito',
      description: 'Trial completo 48 ore per testare tutti i server MCP',
      features: [
        'Accesso completo a tutti i 4 server MCP',
        'VS Code + Visual Studio + Word + Filesystem',
        'Supporto tecnico via email',
        '48 ore di test completo',
        'Nessuna limitazione funzionale',
        'Setup assistito incluso'
      ],
      popular: false,
      cta: 'Scarica Trial Gratuito',
      icon: Heart,
      color: 'text-success-400',
      gradient: 'from-success-600 to-success-800',
      badge: 'DISPONIBILE ORA'
    },
    {
      id: 'pro',
      name: 'Piano Pro',
      price: isAnnual ? '€24.99' : '€29.99',
      originalPrice: isAnnual ? '€35.99' : '€39.99',
      description: 'Perfetto per sviluppatori professionali e team piccoli',
      features: [
        'Tutti i server MCP inclusi',
        'Supporto prioritario 24/7',
        'Backup automatico cloud',
        'Integrazioni personalizzate',
        'Analytics avanzati',
        'API access completo',
        'Updates automatici',
        'Template e preset professionali'
      ],
      popular: true,
      cta: 'Inizia con Pro',
      icon: Crown,
      color: 'text-primary-400',
      gradient: 'from-primary-600 to-accent-600',
      badge: 'PIÙ POPOLARE'
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: isAnnual ? '€79.99' : '€99.99',
      originalPrice: isAnnual ? '€119.99' : '€149.99',
      description: 'Soluzione enterprise per grandi team e organizzazioni',
      features: [
        'Tutti i server MCP + funzionalità enterprise',
        'Server dedicati personalizzati',
        'Support manager dedicato',
        'SLA 99.9% garantito',
        'Onboarding e training incluso',
        'Integrazioni SSO e sicurezza avanzata',
        'Deployment on-premise disponibile',
        'Custom development su richiesta'
      ],
      popular: false,
      cta: 'Contatta Vendite',
      icon: Rocket,
      color: 'text-secondary-400',
      gradient: 'from-secondary-600 to-warning-600',
      badge: 'ENTERPRISE'
    }
  ]

  return (
    <section id="pricing" className="relative py-16 section-container">
      
      <div className="container mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 fade-in"
        >
          <div className="flex items-center justify-center mb-6">
            <Crown className="w-7 h-7 text-warning-400 mr-3" />
            <span className="text-warning-400 font-semibold text-base">Prezzi Trasparenti</span>
          </div>
          {/* Main Title */}
          <div className="max-w-4xl mx-auto mb-6">
            <div className="px-6 py-4">
              <h2 className="text-2xl md:text-5xl font-bold text-reveal mb-6">
                Piani per ogni{' '}
                <span className="bg-gradient-to-r from-warning-400 to-primary-400 bg-clip-text text-transparent">
                  Esigenza
                </span>
              </h2>
              {/* Linea decorativa warning-primary */}
              <div className="w-32 h-1 bg-gradient-to-r from-warning-500 to-primary-500 mx-auto rounded-full"></div>
            </div>
          </div>
          {/* Description */}
          <div className="mb-8">
            <p className="text-lg text-gray-300 max-w-3xl mx-auto px-3">
              Inizia gratis con il trial 48h, poi scegli il piano perfetto per te
            </p>
          </div>

          {/* Annual/Monthly Toggle */}
          <div className="flex items-center justify-center space-x-4">
            <span className={`font-medium ${!isAnnual ? 'text-white' : 'text-gray-300'}`}>
              Mensile
            </span>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsAnnual(!isAnnual)}
              className="relative w-16 h-8 bg-white/10 rounded-full border border-white/20 transition-all duration-300"
            >
              <motion.div
                animate={{ x: isAnnual ? 32 : 4 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="absolute top-1 w-6 h-6 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full"
              />
            </motion.button>
            <span className={`font-medium ${isAnnual ? 'text-white' : 'text-gray-300'}`}>
              Annuale
            </span>
            {isAnnual && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-success-500 text-white px-3 py-1 rounded-full text-xs font-semibold"
              >
                Risparmi 20%
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto mb-12">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 50, rotateY: index % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              whileHover={{ 
                y: -10, 
                scale: 1.02,
                rotateY: index % 2 === 0 ? 2 : -2 
              }}
              className={`pricing-card relative bg-white/5 backdrop-blur-lg border-2 rounded-3xl p-7 transition-all duration-500 flex flex-col h-full ${
                plan.popular 
                  ? 'border-primary-400 bg-primary-400/5 scale-105 lg:scale-110' 
                  : plan.id === 'beta'
                  ? 'border-success-400 bg-success-400/5 hover:border-success-300'
                  : plan.id === 'enterprise'
                  ? 'border-secondary-400 bg-secondary-400/5 hover:border-secondary-300'
                  : 'border-white/10 hover:border-white/30'
              }`}
            >
              {/* Badge */}
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className={`bg-gradient-to-r ${plan.gradient} text-white px-6 py-2 rounded-full text-xs font-semibold flex items-center space-x-1`}>
                    <Star className="w-4 h-4" />
                    <span>{plan.badge}</span>
                  </div>
                </div>
              )}

              <div className="text-center flex-grow flex flex-col">
                {/* Icon */}
                <div className={`w-14 h-14 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${plan.gradient} flex items-center justify-center relative`}>
                  <plan.icon className="w-7 h-7 text-white absolute inset-0 m-auto" />
                </div>

                {/* Plan Name */}
                <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-gray-300 mb-6 flex-grow">{plan.description}</p>

                {/* Price */}
                <div className="mb-8">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <span className="text-2xl font-bold text-white">{plan.price}</span>
                    {plan.originalPrice && (
                      <>
                        <span className="text-base text-gray-300 line-through">{plan.originalPrice}</span>
                        <div className="bg-success-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                          -{Math.round((1 - parseFloat(plan.price.replace('€', '')) / parseFloat(plan.originalPrice.replace('€', ''))) * 100)}%
                        </div>
                      </>
                    )}
                  </div>
                  {plan.price !== 'Gratuito' && (
                    <p className="text-xs text-gray-300">al mese, fatturato {isAnnual ? 'annualmente' : 'mensilmente'}</p>
                  )}
                </div>

                {/* Features */}
                <div className="space-y-4 mb-8 text-left flex-grow">
                  {plan.features.map((feature, featureIndex) => (
                    <motion.div
                      key={featureIndex}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.1 * featureIndex }}
                      className="flex items-start space-x-3"
                    >
                      <Check className={`w-4 h-4 ${plan.color} mt-0.5 flex-shrink-0`} />
                      <span className="text-gray-300">{feature}</span>
                    </motion.div>
                  ))}
                </div>

                {/* CTA Button */}
                <motion.button
                  whileHover={{ scale: (loading && plan.id === 'beta') ? 1 : 1.05 }}
                  whileTap={{ scale: (loading && plan.id === 'beta') ? 1 : 0.95 }}
                  onClick={() => handlePlanAction(plan)}
                  disabled={loading && plan.id === 'beta'}
                  className={`w-full py-3 rounded-full font-semibold text-base transition-all duration-300 flex items-center justify-center space-x-2 ${
                    plan.popular
                      ? `bg-gradient-to-r ${plan.gradient} text-white hover:shadow-lg hover:shadow-primary-500/25`
                      : plan.id === 'beta'
                      ? 'bg-success-500/20 text-white hover:bg-success-500/30 border-2 border-success-400/30 hover:border-success-400'
                      : plan.id === 'enterprise'
                      ? 'bg-secondary-500/20 text-white hover:bg-secondary-500/30 border-2 border-secondary-400/30 hover:border-secondary-400'
                      : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
                  } ${(loading && plan.id === 'beta') ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {plan.id === 'beta' && loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : plan.id === 'beta' && downloadSuccess ? (
                    <Star className="w-4 h-4 text-yellow-300" />
                  ) : null}
                  <span>
                    {plan.id === 'beta' && loading 
                      ? 'Preparazione...' 
                      : plan.id === 'beta' && downloadSuccess 
                      ? 'Download Avviato!' 
                      : plan.cta
                    }
                  </span>
                </motion.button>

                {/* Error Message for Beta Plan */}
                {plan.id === 'beta' && error && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 bg-red-500/20 border border-red-500/30 rounded-lg p-3 text-red-300 text-center text-xs"
                  >
                    <p>{error}</p>
                    <button 
                      onClick={() => window.location.reload()} 
                      className="mt-1 text-xs underline hover:no-underline"
                    >
                      Riprova
                    </button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}
