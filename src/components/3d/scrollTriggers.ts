import * as THREE from 'three'
import { gsap } from 'gsap'
import { ParticleSystem } from './types'
import { morphToShape } from './morphingEngine'

// 📜 SCROLL TRIGGERS - Gestione ottimizzata dei trigger (con debug)

// Dynamic import for ScrollTrigger to avoid SSR issues
let ScrollTrigger: any
if (typeof window !== 'undefined') {
  import('gsap/ScrollTrigger').then(({ ScrollTrigger: ST }) => {
    ScrollTrigger = ST
    gsap.registerPlugin(ScrollTrigger)
  })
}

// 🎬 SETUP SCROLL TRIGGERS UNIFICATI (morphing + progressive separation)
export function setupScrollTriggers(particleSystem: ParticleSystem, scene: THREE.Scene) {
  if (typeof window === 'undefined') return
  
  const initScrollTriggers = () => {
    if (!ScrollTrigger) {
      setTimeout(initScrollTriggers, 100)
      return
    }
    
    // 🧹 PULIZIA PREVENTIVA - Elimina eventuali trigger esistenti
    ScrollTrigger.getAll().forEach((trigger: any) => trigger.kill())
    
    console.log('🎬 Inizializzazione ScrollTriggers unificati con debug...')
    
    const sections = ['hero', 'features', 'packages', 'pricing', 'demo']
    
    sections.forEach((section, index) => {
      const nextSection = sections[index + 1]
      
      console.log(`🔧 Creando trigger per sezione: ${section}`)
      
      // 🎯 TRIGGER UNIFICATO per morphing + progressive separation
      const trigger = ScrollTrigger.create({
        trigger: `#${section}`,
        start: "top center",
        end: "bottom center",
        
        // 📊 DEBUG CALLBACKS + MORPHING VERSO SEZIONE CORRENTE
        onEnter: () => {
          console.log(`🟢 ENTER: Entering ${section} - morphing verso ${section}`)
          // 🎯 MORPHING VERSO LA SEZIONE CORRENTE quando si entra
          if (particleSystem.currentShape !== section) {
            morphToShape(particleSystem, section, scene)
          }
        },
        onEnterBack: () => {
          console.log(`🟣 ENTER BACK: Entering back ${section} - morphing verso ${section}`)
          // 🎯 MORPHING VERSO LA SEZIONE CORRENTE quando si torna indietro
          if (particleSystem.currentShape !== section) {
            morphToShape(particleSystem, section, scene)
          }
        },
        onLeave: () => {
          console.log(`🔴 LEAVE: Leaving ${section}`)
        },
        onLeaveBack: () => {
          console.log(`🟡 LEAVE BACK: Leaving back ${section}`)
        },
        
        // 🌊 PROGRESSIVE SEPARATION + MORPHING UNIFICATI
        ...(nextSection && {
          onUpdate: (self: any) => {
            const progress = self.progress
            
            // Debug progress solo ogni 10%
            if (progress % 0.1 < 0.01) {
              console.log(`📊 ${section}: ${(progress * 100).toFixed(0)}%`)
            }
            
            // 🎯 Progressive Separation: 50% → 80%
            if (progress >= 0.5 && progress < 0.8) {
              const separationProgress = (progress - 0.5) / 0.3
              applySeparationEffectOptimized(particleSystem, separationProgress)
            }
            // 🚀 MORPHING FINALE: 80% → 100%
            else if (progress >= 0.8) {
              // Triggera morphing solo una volta quando raggiungi 80%
              if (!particleSystem.isMorphing) {
                console.log(`🚀 TRIGGER MORPHING a 80%: ${section} → ${nextSection}`)
                particleSystem.isMorphing = true
                morphToShape(particleSystem, nextSection, scene)
              }
            }
            // Reset sotto il 50%
            else if (progress < 0.5) {
              resetSeparationEffectOptimized(particleSystem)
              particleSystem.isMorphing = false // Reset flag
            }
          }
        }),
        
        // 🎯 GESTIONE SEZIONI SENZA NEXT (ultima sezione)
        ...(!nextSection && {
          onUpdate: (self: any) => {
            const progress = self.progress
            
            // Solo progressive separation per l'ultima sezione, nessun morphing
            if (progress >= 0.5 && progress <= 0.8) {
              const separationProgress = (progress - 0.5) / 0.3
              applySeparationEffectOptimized(particleSystem, separationProgress)
            } else if (progress < 0.5) {
              resetSeparationEffectOptimized(particleSystem)
            }
          }
        })
      })
      
      console.log(`✅ Trigger creato per ${section}:`, trigger)
    })
    
    // 🔍 DEBUG INFO
    const allTriggers = ScrollTrigger.getAll()
    console.log(`🎯 Totale ScrollTriggers attivi: ${allTriggers.length}`)
    console.log('📋 Lista triggers:', allTriggers.map((t: any) => t.vars.trigger))
    
    // 🔄 REFRESH PREVENTIVO
    ScrollTrigger.refresh()
    console.log('🔄 ScrollTrigger.refresh() completato')
  }
  
  initScrollTriggers()
}

// 🌊 SEPARAZIONE OTTIMIZZATA (NO GSAP, transform diretti)
function applySeparationEffectOptimized(particleSystem: ParticleSystem, progress: number) {
  if (!particleSystem.points) return
  
  // 🚀 TRASFORMAZIONE DIRETTA (no gsap.to infinite)
  const targetScale = 1.0 + (progress * 1.0) // Max 2.0x
  
  // Applica direttamente senza animazioni GSAP
  particleSystem.points.scale.set(targetScale, targetScale, targetScale)
  
  // Debug solo a 25%, 50%, 75%
  if (progress === 0.25 || progress === 0.5 || progress === 0.75) {
    console.log(`🌊 Separazione: ${(progress * 100).toFixed(0)}% - Scala: ${targetScale.toFixed(2)}x`)
  }
}

// 🔄 RESET OTTIMIZZATO
function resetSeparationEffectOptimized(particleSystem: ParticleSystem) {
  if (!particleSystem.points) return
  
  // Reset diretto a scala normale
  particleSystem.points.scale.set(1.0, 1.0, 1.0)
  console.log('🔄 Reset separazione a scala 1.0x')
}

// 🎮 SETUP PARALLAX EFFECTS (mantenuto ma con debug)
export function setupParallaxEffects() {
  if (typeof window === 'undefined') return
  
  const initParallax = () => {
    if (!ScrollTrigger) {
      setTimeout(initParallax, 100)
      return
    }
    
    console.log('🎮 Inizializzazione Parallax Effects...')
    
    // Parallax per elementi background decorativi
    const parallaxElements = gsap.utils.toArray('.parallax-element')
    console.log(`🎮 Trovati ${parallaxElements.length} elementi parallax`)
    
    parallaxElements.forEach((element: any, index: number) => {
      gsap.to(element, {
        yPercent: -50,
        ease: "none",
        scrollTrigger: {
          trigger: element,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
          onUpdate: (self: any) => {
            if (index === 0) { // Log solo per il primo elemento
              console.log(`🎮 Parallax progress: ${(self.progress * 100).toFixed(0)}%`)
            }
          }
        }
      })
    })
  }
  
  initParallax()
}

// 🔧 CLEANUP SCROLL TRIGGERS (con debug)
export function cleanupScrollTriggers() {
  if (ScrollTrigger) {
    const beforeCount = ScrollTrigger.getAll().length
    ScrollTrigger.getAll().forEach((trigger: any) => trigger.kill())
    const afterCount = ScrollTrigger.getAll().length
    console.log(`🧹 ScrollTriggers puliti: ${beforeCount} → ${afterCount}`)
  }
}

// 📊 DEBUG SCROLL TRIGGERS (migliorato)
export function debugScrollTriggers() {
  if (ScrollTrigger) {
    console.log('🔍 === SCROLL TRIGGER DEBUG ===')
    const triggers = ScrollTrigger.getAll()
    console.log(`📊 Totale triggers: ${triggers.length}`)
    
    triggers.forEach((trigger: any, index: number) => {
      console.log(`${index + 1}. Trigger:`, {
        element: trigger.vars.trigger,
        start: trigger.vars.start,
        end: trigger.vars.end,
        scrub: trigger.vars.scrub,
        pin: trigger.vars.pin,
        isActive: trigger.isActive
      })
    })
    
    ScrollTrigger.refresh()
    console.log('🔄 ScrollTrigger refreshed')
    console.log('🔍 === END DEBUG ===')
  }
}

// 🎯 AUTO-DEBUG ogni 5 secondi in development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  setInterval(() => {
    if (ScrollTrigger) {
      const triggers = ScrollTrigger.getAll()
      if (triggers.length > 0) {
        console.log(`🔍 [AUTO-DEBUG] ${triggers.length} ScrollTriggers attivi`)
      }
    }
  }, 5000)
}
