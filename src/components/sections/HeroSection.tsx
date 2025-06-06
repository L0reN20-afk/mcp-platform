'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Download, Zap, Users, Clock, Shield, Star } from 'lucide-react'
import { gsap } from 'gsap'

interface HeroSectionProps {
  onTrialClick?: () => void
}

export default function HeroSection({ onTrialClick }: HeroSectionProps) {
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    // 🚫 TEMPORANEAMENTE DISABILITATO per evitare conflitti con ParticleBackground ScrollTriggers
    // Typewriter effect for main title
    // if (titleRef.current) {
    //   const text = titleRef.current.textContent || ''
    //   titleRef.current.textContent = ''
    //   titleRef.current.classList.add('hero-title')
      
    //   gsap.to(titleRef.current, {
    //     duration: 2,
    //     ease: "none",
    //     onUpdate: function() {
    //       const progress = this.progress()
    //       const currentLength = Math.floor(progress * text.length)
    //       if (titleRef.current) {
    //         titleRef.current.textContent = text.slice(0, currentLength)
    //       }
    //     }
    //   })
    // }
    
    console.log('✅ HeroSection inizializzata - solo Framer Motion attivo')
  }, [])

  const handleTrialClick = () => {
    if (onTrialClick) {
      onTrialClick()
    } else {
      // Fallback se onTrialClick non è fornito
      console.log('Trial click - modal dovrebbe aprirsi')
    }
  }

  const handleDiscoverClick = () => {
    // Scrolla alla sezione pacchetti
    const packagesSection = document.querySelector('#packages')
    if (packagesSection) {
      packagesSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const stats = [
    { icon: Zap, value: "4+", label: "Server MCP", color: "text-primary-400" },
    { icon: Users, value: "100%", label: "Automazione", color: "text-accent-400" },
    { icon: Clock, value: "24/7", label: "Support", color: "text-secondary-400" },
    { icon: Shield, value: "48h", label: "Trial Gratuito", color: "text-success-400" }
  ]

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center section-container">
      {/* Background gradient overlay - PIù TRASPARENTE per vedere meglio le particelle */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-gray-900/20 to-black/40 pointer-events-none"></div>
      
      <div className="container mx-auto py-20 relative z-10">
        <div className="max-w-6xl mx-auto text-center">
          {/* Main Title */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <div className="relative max-w-4xl mx-auto">
              {/* Safe Zone Background - Protezione dalle particelle blu */}
              <div className="absolute inset-0 bg-black/25 backdrop-blur-md rounded-2xl shadow-2xl shadow-black/50 border border-white/10 -m-6"></div>
              <div className="relative px-6 py-4">
                <h1 
                  ref={titleRef}
                  className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 bg-gradient-to-r from-primary-400 via-accent-400 to-secondary-400 bg-clip-text text-transparent leading-tight"
                >
                  MCP Platform
                </h1>
                <div className="w-32 h-1 bg-gradient-to-r from-primary-500 to-accent-500 mx-auto rounded-full"></div>
              </div>
            </div>
          </motion.div>

          {/* Subtitle con Safe Zone */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative mb-8"
          >
            {/* Safe Zone Background */}
            <div className="absolute inset-0 bg-black/14 backdrop-blur-sm rounded-2xl -m-4"></div>
            <p 
              ref={subtitleRef}
              className="hero-subtitle relative text-xl md:text-2xl lg:text-3xl text-gray-200 max-w-4xl mx-auto leading-relaxed px-4"
            >
              Server MCP professionali per{' '}
              <span className="text-primary-400 font-semibold">automazione completa</span>
              {' '}di VS Code, Visual Studio, Word e Filesystem.{' '}
              <span className="text-accent-400 font-semibold">Trial 48h gratuito</span>
              {' '}disponibile ora.
            </p>
          </motion.div>

          {/* Description con Safe Zone */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="relative mb-12"
          >
            {/* Safe Zone Background */}
            <div className="absolute inset-0 bg-black/14 backdrop-blur-sm rounded-xl -m-3"></div>
            <p className="relative text-lg text-gray-300 max-w-3xl mx-auto px-3">
              Piattaforma che offre abbonamenti mensili per server MCP personalizzati. 
              Scegli tra pacchetti completi o server individuali per automatizzare il tuo workflow di sviluppo.
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="hero-cta flex flex-col sm:flex-row gap-6 justify-center items-center mb-12"
          >
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleTrialClick}
              className="magnetic-button group bg-gradient-to-r from-primary-600 to-accent-600 text-white px-8 py-4 rounded-full font-semibold text-lg flex items-center space-x-3 hover:shadow-xl hover:shadow-primary-500/25 transition-all duration-300"
            >
              <Download className="w-5 h-5 group-hover:animate-bounce" />
              <span>Scarica Trial 48h Gratuito</span>
            </motion.button>
            
            {/* Safe Zone per bottone Scopri i Pacchetti */}
            <div className="relative">
              {/* Safe Zone Background */}
              <div className="absolute inset-0 bg-black/14 backdrop-blur-sm rounded-full -m-2"></div>
              
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleDiscoverClick}
                className="relative magnetic-button group bg-transparent border-2 border-primary-400/60 text-white px-8 py-4 rounded-full font-semibold text-lg hover:border-primary-400 hover:text-primary-400 transition-all duration-300"
              >
                <span>Scopri i Pacchetti</span>
              </motion.button>
            </div>
          </motion.div>

          {/* Scroll Indicator - Riposizionato tra CTA e Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.1 }}
            className="flex flex-col items-center space-y-2 text-white/60 mb-16"
          >
            <span className="text-sm font-medium">Scorri per esplorare</span>
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center"
            >
              <motion.div
                animate={{ y: [0, 16, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-1 h-3 bg-white/60 rounded-full mt-2"
              />
            </motion.div>
          </motion.div>

          {/* Stats */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.3 }}
            className="hero-stats grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 1.5 + index * 0.1 }}
                className="floating-element text-center group cursor-pointer"
              >
                <div className={`backdrop-blur-sm border-2 rounded-2xl p-6 transition-all duration-300 group-hover:scale-110 ${
                  stat.color === 'text-primary-400' 
                    ? 'bg-white/5 border-primary-400/60 hover:border-primary-400 bg-primary-400/5' 
                    : stat.color === 'text-accent-400'
                    ? 'bg-white/5 border-accent-400/60 hover:border-accent-400 bg-accent-400/5'
                    : stat.color === 'text-secondary-400' 
                    ? 'bg-white/5 border-secondary-400/60 hover:border-secondary-400 bg-secondary-400/5'
                    : stat.color === 'text-success-400'
                    ? 'bg-white/5 border-success-400/60 hover:border-success-400 bg-success-400/5'
                    : 'bg-white/5 border-white/10 hover:border-white/20'
                }`}>
                  <stat.icon className={`w-8 h-8 ${stat.color} mx-auto mb-3 group-hover:scale-110 transition-transform duration-300`} />
                  <div className={`text-3xl font-bold ${stat.color} mb-1 counter`} data-target={stat.value.replace(/\D/g, '')} data-suffix={stat.value.replace(/\d/g, '')}>
                    {stat.value}
                  </div>
                  <div className="text-gray-400 text-sm font-medium">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>


    </section>
  )
}
