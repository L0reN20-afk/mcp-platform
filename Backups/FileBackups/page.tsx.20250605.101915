'use client'

import { useEffect } from 'react'
import HeroSection from '@/components/sections/HeroSection'
import FeaturesSection from '@/components/sections/FeaturesSection'
import PackagesSection from '@/components/sections/PackagesSection'
import PricingSection from '@/components/sections/PricingSection'
import DemoSection from '@/components/sections/DemoSection'
import CTASection from '@/components/sections/CTASection'
import Footer from '@/components/sections/Footer'
import ParticleBackground from '@/components/3d/ParticleBackground'
import Navigation from '@/components/ui/Navigation'

export default function Home() {
  useEffect(() => {
    // 🚫 TEMPORANEAMENTE DISABILITATO per evitare conflitti con ParticleBackground ScrollTriggers
    // Initialize GSAP and scroll-triggered animations
    // import('@/lib/animations').then(async ({ initializeScrollAnimations }) => {
    //   await initializeScrollAnimations()
    // })
    
    console.log('✅ Page inizializzata - ScrollTriggers gestiti solo da ParticleBackground')
  }, [])

  return (
    <main className="relative min-h-screen text-white">
      {/* 3D Particle Background */}
      <ParticleBackground />
      
      {/* Navigation */}
      <Navigation />
      
      {/* Sections */}
      <div className="relative z-10">
        <HeroSection />
        <FeaturesSection />
        <PackagesSection />
        <PricingSection />
        <DemoSection />
        <CTASection />
        <Footer />
      </div>
    </main>
  )
}
