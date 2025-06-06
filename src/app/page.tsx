'use client'

import { useEffect, useState } from 'react'
import HeroSection from '@/components/sections/HeroSection'
import FeaturesSection from '@/components/sections/FeaturesSection'
import PackagesSection from '@/components/sections/PackagesSection'
import PricingSection from '@/components/sections/PricingSection'
import DemoSection from '@/components/sections/DemoSection'
import CTASection from '@/components/sections/CTASection'
import Footer from '@/components/sections/Footer'
import ParticleBackground from '@/components/3d/ParticleBackground'
import Navigation from '@/components/ui/Navigation'
import TrialModal from '@/components/ui/TrialModal'

export default function Home() {
  const [isTrialModalOpen, setIsTrialModalOpen] = useState(false)

  useEffect(() => {
    // 🚫 TEMPORANEAMENTE DISABILITATO per evitare conflitti con ParticleBackground ScrollTriggers
    // Initialize GSAP and scroll-triggered animations
    // import('@/lib/animations').then(async ({ initializeScrollAnimations }) => {
    //   await initializeScrollAnimations()
    // })
    
    console.log('✅ Page inizializzata - ScrollTriggers gestiti solo da ParticleBackground')
  }, [])

  const handleTrialClick = () => {
    setIsTrialModalOpen(true)
  }

  const handleTrialModalClose = () => {
    setIsTrialModalOpen(false)
  }

  return (
    <main className="relative min-h-screen text-white">
      {/* 3D Particle Background */}
      <ParticleBackground />
      
      {/* Navigation */}
      <Navigation onTrialClick={handleTrialClick} />
      
      {/* Sections */}
      <div className="relative z-10">
        <HeroSection onTrialClick={handleTrialClick} />
        <FeaturesSection />
        <PackagesSection />
        <PricingSection />
        <DemoSection />
        <CTASection onTrialClick={handleTrialClick} />
        <Footer />
      </div>

      {/* Trial Modal */}
      <TrialModal 
        isOpen={isTrialModalOpen} 
        onClose={handleTrialModalClose} 
      />
    </main>
  )
}
