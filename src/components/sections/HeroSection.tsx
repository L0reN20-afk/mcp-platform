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
    loggers.hero.once('INFO', 'init', 'HeroSection inizializzata - Video WebM fluido a 60 FPS')
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

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center section-container">
      
      <div className="container mx-auto py-8 relative z-10">
        <div className="max-w-6xl mx-auto text-center">
          {/* Unified Content Block - Solo Titolo */}
          <div className="max-w-5xl mx-auto mb-16 mt-[-235px]">
            <div className="px-6 py-2 space-y-4" style={{ transform: 'translateY(-60px)' }}>
              {/* Main Title con Martello al posto della "i" - Posizione originale */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <h1 
                  ref={titleRef}
                  className="text-7xl md:text-9xl lg:text-10xl font-bold mb-4 leading-tight flex items-center justify-center"
                  style={{
                    filter: 'brightness(1.1)'
                  }}
                >
                  <span 
                    className="bg-gradient-to-r from-[#e55a5a] to-[#d47575] bg-clip-text text-transparent inline-block pb-2"
                    style={{ lineHeight: '1.1' }}
                  >
                    Bu
                  </span>
                  <HammerPngAnimation
                    autoPlay
                    loop={true}
                    className="-mx-12 inline-block lg:w-40 lg:h-40 md:w-36 md:h-36 sm:w-32 sm:h-32"
                    style={{
                      filter: 'brightness(1.1) drop-shadow(0 0 20px rgba(255, 107, 107, 0.3))',
                      transform: 'translateY(-19px)'
                    }}
                    width={170}
                    height={170}
                  />
                  <span 
                    className="bg-gradient-to-r from-[#d48070] to-[#3bb5b0] bg-clip-text text-transparent inline-block pb-2"
                    style={{ lineHeight: '1.1' }}
                  >
                    ldmyth
                  </span>
                </h1>
                <div 
                  className="w-40 h-1.5 bg-gradient-to-r from-[#e55a5a] to-[#3bb5b0] mx-auto rounded-full"
                  style={{
                    filter: 'brightness(1.1)',
                    transform: 'translateY(-20px)'
                  }}
                ></div>
              </motion.div>

              {/* Frase ad Effetto - INVISIBILE DURANTE INTRO (mantiene spazio) */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: showIntro ? 0 : 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="mt-4"
                style={{ 
                  transform: 'translateY(-10px)',
                  visibility: showIntro ? 'hidden' : 'visible'
                }}
              >
                <p 
                  className="hero-subtitle text-base md:text-lg lg:text-xl text-gray-300 leading-relaxed font-medium"
                  style={{
                    filter: 'brightness(1.1)'
                  }}
                >
                  Rendi il tuo{' '}
                  <span className="font-semibold" style={{ color: '#ff6b6b', fontSize: '1.2em' }}>workflow</span>
                  {' '}straordinariamente efficiente con Buildmyth: la{' '}
                  <span className="font-semibold" style={{ color: '#4ecdc4', fontSize: '1.2em' }}>rivoluzione definitiva</span>
                  {' '}per costruire il tuo successo.
                </p>
              </motion.div>
            </div>
          </div>

          {/* CTA Buttons - NASCOSTI DURANTE INTRO */}
          {!showIntro && (
            <div className="absolute bottom-[-295px] left-1/2 transform -translate-x-1/2 w-full max-w-4xl">
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.9 }}
                className="hero-cta flex flex-col sm:flex-row gap-7 justify-center items-center"
              >
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleTrialClick}
                  className="magnetic-button group bg-gradient-to-r from-[#e43838] to-[#205e5e] text-white px-9 py-4 rounded-full font-bold text-base flex items-center space-x-3 hover:shadow-xl hover:shadow-[#e43838]/25 transition-all duration-300"
                >
                  <Download className="w-5 h-5 group-hover:animate-bounce" />
                  <span>Scarica Trial 48h Gratuito</span>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleDiscoverClick}
                  className="magnetic-button group bg-white/5 backdrop-blur-lg border-2 border-[#e43838]/60 text-white px-9 py-4 rounded-full font-bold text-base hover:border-[#e43838] hover:text-[#e43838] hover:bg-white/10 transition-all duration-300"
                >
                  <span>Scopri i Pacchetti</span>
                </motion.button>
              </motion.div>
            </div>
          )}

          {/* Scroll Indicator - Posizionato sotto i tasti - NASCOSTO DURANTE INTRO */}
          {!showIntro && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="absolute bottom-[-370px] left-1/2 transform -translate-x-1/2 flex flex-col items-center space-y-2 text-white/60"
            >
              <span className="text-xs font-medium">Scorri per esplorare</span>
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-5 h-9 border-2 border-white/30 rounded-full flex justify-center"
              >
                <motion.div
                  animate={{ y: [0, 16, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-1 h-3 bg-white/60 rounded-full mt-2"
                />
              </motion.div>
            </motion.div>
          )}
        </div>
      </div>

    </section>
  )
}