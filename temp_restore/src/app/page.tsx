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
import BackgroundSphere from '@/components/3d/BackgroundSphere'
import Navigation from '@/components/ui/Navigation'
import TrialModal from '@/components/ui/TrialModal'
import IntroAnimation from '@/components/ui/IntroAnimation'
import { loggers } from '@/utils/logger'

export default function Home() {
  const [isTrialModalOpen, setIsTrialModalOpen] = useState(false)
  const [showIntro, setShowIntro] = useState(true)

  useEffect(() => {
    loggers.page.once('INFO', 'init', 'Page inizializzata - ScrollTriggers gestiti da ParticleBackground')
  }, [])

  const handleTrialClick = () => {
    setIsTrialModalOpen(true)
  }

  const handleTrialModalClose = () => {
    setIsTrialModalOpen(false)
  }

  const handleIntroComplete = () => {
    setShowIntro(false)
  }

  return (
    <>
      {/* Intro Animation - Sfera che cade */}
      {showIntro && (
        <IntroAnimation onComplete={handleIntroComplete} />
      )}

      {/* Main Content */}
      <main className="relative min-h-screen text-white">
        {/* 3D Background Effects */}
        {!showIntro && (
          <>
            <BackgroundSphere />
            <ParticleBackground />
          </>
        )}
        
        {/* Navigation */}
        {!showIntro && <Navigation onTrialClick={handleTrialClick} />}
        
        {/* Sections */}
        <div className="relative z-10">
          <HeroSection onTrialClick={handleTrialClick} showIntro={showIntro} />
          {!showIntro && (
            <>
              <FeaturesSection />
              <PackagesSection />
              <PricingSection />
              <DemoSection />
              <CTASection onTrialClick={handleTrialClick} />
              <Footer />
            </>
          )}
        </div>

        {/* Trial Modal */}
        <TrialModal 
          isOpen={isTrialModalOpen} 
          onClose={handleTrialModalClose} 
        />
      </main>
    </>
  )
}
