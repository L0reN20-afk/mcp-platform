'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Download, Zap, Users, Clock, Shield, Star } from 'lucide-react'
import HammerPngAnimation from '@/components/ui/HammerPngAnimation'
import { loggers } from '@/utils/logger'

interface HeroSectionProps {
  onTrialClick?: () => void
  showIntro?: boolean
}

export default function HeroSection({ onTrialClick, showIntro = false }: HeroSectionProps) {
  const titleRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    loggers.hero.once('INFO', 'init', 'HeroSection inizializzata - Layout proporzionale perfetto')
  }, [])

  const handleTrialClick = () => {
    if (onTrialClick) {
      onTrialClick()
    } else {
      console.log('Trial click - modal dovrebbe aprirsi')
    }
  }

  const handleDiscoverClick = () => {
    const packagesSection = document.querySelector('#packages')
    if (packagesSection) {
      packagesSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section id="hero" className="hero-perfect-fold">
      <div className="hero-grid-container">
        
        {/* Logo e Tagline - Area principale */}
        <div className="hero-main-content">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="hero-logo-section"
          >
            {/* Main Title con Martello */}
            <h1 
              ref={titleRef}
              className="hero-title"
              style={{ filter: 'brightness(1.1)' }}
            >
              <span 
                className="bg-gradient-to-r from-[#e55a5a] to-[#d47575] bg-clip-text text-transparent"
                style={{ lineHeight: '1.1' }}
              >
                Bu
              </span>
              <HammerPngAnimation
                autoPlay
                loop={true}
                className="hero-hammer"
                style={{
                  filter: 'brightness(1.1) drop-shadow(0 0 20px rgba(255, 107, 107, 0.3))',
                }}
              />
              <span 
                className="bg-gradient-to-r from-[#d48070] to-[#3bb5b0] bg-clip-text text-transparent"
                style={{ lineHeight: '1.1' }}
              >
                ldmyth
              </span>
            </h1>
            
            {/* Linea decorativa */}
            <div 
              className="hero-divider"
              style={{ filter: 'brightness(1.1)' }}
            ></div>
          </motion.div>

          {/* Tagline - INVISIBILE DURANTE INTRO */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: showIntro ? 0 : 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="hero-tagline-section"
            style={{ visibility: showIntro ? 'hidden' : 'visible' }}
          >
            <p 
              className="hero-subtitle"
              style={{ filter: 'brightness(1.1)' }}
            >
              Rendi il tuo{' '}
              <span className="font-semibold" style={{ color: '#ff6b6b', fontSize: '1.2em' }}>workflow</span>
              {' '}straordinariamente efficiente con Buildmyth: la{' '}
              <span className="font-semibold" style={{ color: '#4ecdc4', fontSize: '1.2em' }}>rivoluzione definitiva</span>
              {' '}per costruire il tuo successo.
            </p>
          </motion.div>
        </div>

        {/* CTA Buttons - NASCOSTI DURANTE INTRO */}
        {!showIntro && (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="hero-cta-section"
          >
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleTrialClick}
              className="hero-cta-primary"
            >
              <Download className="w-5 h-5 group-hover:animate-bounce" />
              <span>Scarica Trial 48h Gratuito</span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleDiscoverClick}
              className="hero-cta-secondary"
            >
              <span>Scopri i Pacchetti</span>
            </motion.button>
          </motion.div>
        )}

        {/* Scroll Indicator - NASCOSTO DURANTE INTRO */}
        {!showIntro && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="hero-scroll-section"
          >
            <span className="hero-scroll-text">Scorri per esplorare</span>
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="hero-scroll-indicator"
            >
              <motion.div
                animate={{ y: [0, 16, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="hero-scroll-dot"
              />
            </motion.div>
          </motion.div>
        )}
      </div>
    </section>
  )
}