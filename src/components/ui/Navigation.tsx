'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Download } from 'lucide-react'

interface NavigationProps {
  onTrialClick?: () => void
}

export default function Navigation({ onTrialClick }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    { name: 'Home', href: '#hero' },
    { name: 'Features', href: '#features' },
    { name: 'Pacchetti', href: '#packages' },
    { name: 'Prezzi', href: '#pricing' },
    { name: 'Demo', href: '#demo' },
  ]

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
    setIsOpen(false)
  }

  const handleTrialClick = () => {
    if (onTrialClick) {
      onTrialClick()
    } else {
      console.log('Trial modal dovrebbe aprirsi')
    }
    setIsOpen(false) // Chiudi menu mobile se aperto
  }

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-black/80 backdrop-blur-lg border-b border-white/10' 
          : 'bg-transparent'
      }`}
    >
      <div className="w-full px-4 py-4">
        {/* Desktop Layout - Grid a 3 colonne */}
        <div className="hidden md:grid grid-cols-3 items-center w-full">
          {/* Logo - Estremo sinistro */}
          <div className="justify-self-start">
            <div
              className="cursor-pointer group"
              onClick={() => scrollToSection('#hero')}
            >
              <div className="relative">
                <motion.div
                  initial={{ rotate: 0 }}
                  whileHover={{ 
                    rotate: [0, 45, -20, 35, 0],
                    scale: 1.05,
                    transition: { 
                      duration: 1.0,
                      ease: "easeInOut",
                      times: [0, 0.2, 0.35, 0.65, 1]
                    }
                  }}
                  style={{ transformOrigin: "center center" }}
                  className="p-2 rounded"
                >
                  <Image
                    src="/images/logo.png"
                    width={56}
                    height={56}
                    alt="Buildmyth Logo"
                    className="cursor-pointer"
                    priority
                  />
                </motion.div>
              </div>
            </div>
          </div>

          {/* Navigation - Centro perfetto */}
          <div className="justify-self-center">
            <div className="flex items-center space-x-8">
              {navItems.map((item, index) => (
                <motion.button
                  key={item.name}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -2 }}
                  onClick={() => scrollToSection(item.href)}
                  className="text-white/80 hover:text-white transition-colors relative group"
                >
                  {item.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-500 to-accent-500 group-hover:w-full transition-all duration-300"></span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* CTA Button - Estremo destro */}
          <div className="justify-self-end">
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleTrialClick}
              className="flex items-center space-x-2 bg-gradient-to-r from-[#e43838] to-[#205e5e] text-white px-6 py-3 rounded-full font-semibold hover:shadow-lg hover:shadow-[#e43838]/25 transition-all duration-300"
            >
              <Download className="w-4 h-4" />
              <span>Trial 48h</span>
            </motion.button>
          </div>
        </div>

        {/* Mobile Layout - Flexbox tradizionale */}
        <div className="flex items-center justify-between md:hidden">
          {/* Logo Mobile */}
          <div
            className="cursor-pointer group"
            onClick={() => scrollToSection('#hero')}
          >
            <div className="relative">
              <motion.div
                initial={{ rotate: 0 }}
                whileHover={{ 
                  rotate: [0, 45, -20, 35, 0],
                  scale: 1.05,
                  transition: { 
                    duration: 1.0,
                    ease: "easeInOut",
                    times: [0, 0.2, 0.35, 0.65, 1]
                  }
                }}
                style={{ transformOrigin: "center center" }}
                className="p-2 rounded"
              >
                <Image
                  src="/images/logo.png"
                  width={48}
                  height={48}
                  alt="Buildmyth Logo"
                  className="cursor-pointer"
                  priority
                />
              </motion.div>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-white"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </motion.button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden mt-4 bg-black/90 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden"
            >
              <div className="p-6 space-y-4">
                {navItems.map((item, index) => (
                  <motion.button
                    key={item.name}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ x: 10 }}
                    onClick={() => scrollToSection(item.href)}
                    className="block w-full text-left text-white/80 hover:text-white py-2 transition-colors"
                  >
                    {item.name}
                  </motion.button>
                ))}
                <motion.button
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: navItems.length * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleTrialClick}
                  className="flex items-center space-x-2 bg-gradient-to-r from-[#e43838] to-[#205e5e] text-white px-6 py-3 rounded-full font-semibold w-full justify-center mt-4"
                >
                  <Download className="w-4 h-4" />
                  <span>Trial 48h Gratuito</span>
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  )
}