'use client'

import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { gsap } from 'gsap'

// 📦 IMPORT MODULI SPECIALIZZATI
import { ParticleSystem } from './types'
import { ANIMATION_CONFIG, OPTIMAL_PARTICLE_COUNTS } from './constants'
import { 
  generateUniformSpherePositions,
  generateUniformTorusPositions,
  generateUniformCubePositions,
  generateMorphingBlobPositions,
  generateDoubleHelixPositions
} from './geometryGenerators'
import { generateColorsForShapeWithMobile } from './colorGenerators'
import { 
  createCircleTexture, 
  getOptimalParticleCountWithMobile, 
  generateOriginalSizes,
  createParticleMaterialWithMobileOptimizations,
  setupCamera,
  setupRendererWithMobileFallback,
  setupCanvasStyles,
  handleResizeWithMobile,
  cleanupResources,
  isMobileDevice
} from './utils'
import { loggers } from '@/utils/logger'

// Dynamic import for ScrollTrigger to avoid SSR issues
let ScrollTrigger: any
if (typeof window !== 'undefined') {
  import('gsap/ScrollTrigger').then(({ ScrollTrigger: ST }) => {
    ScrollTrigger = ST
    gsap.registerPlugin(ScrollTrigger)
  })
}

// 🎯 COMPONENTE CON DELTA TIME & REFRESH RATE DETECTION
export default function ParticleBackground() {
  const mountRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const particleSystemRef = useRef<ParticleSystem | null>(null)
  const animationIdRef = useRef<number>()
  const scrollTriggersRef = useRef<any[]>([])
  
  // ⏱️ DELTA TIME & REFRESH RATE TRACKING
  const lastTimeRef = useRef<number>(performance.now())
  const frameCountRef = useRef<number>(0)
  const fpsStartTimeRef = useRef<number>(performance.now())
  const detectedFPSRef = useRef<number>(60)
  const deltaTimeRef = useRef<number>(16.67) // 60 FPS baseline
  
  // 📱 SSR Safe mobile detection
  const [isMobile, setIsMobile] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)

  // 📊 HELPER FUNCTIONS
  const detectRefreshRate = () => {
    frameCountRef.current++
    
    if (frameCountRef.current === 120) { // Sample over 2 seconds at 60fps
      const elapsed = performance.now() - fpsStartTimeRef.current
      const actualFPS = (120 * 1000) / elapsed
      detectedFPSRef.current = Math.round(actualFPS)
      
      // ✅ ANTI-SPAM: Log solo una volta
      loggers.particles.once('INFO', 'fps', `Refresh rate: ${actualFPS} FPS`, {
        deltaBaseline: `${(1000 / actualFPS).toFixed(2)}ms`
      })
      
      // Reset for continuous monitoring
      frameCountRef.current = 0
      fpsStartTimeRef.current = performance.now()
      
      return detectedFPSRef.current
    }
    return detectedFPSRef.current
  }

  const calculateDeltaTime = () => {
    const currentTime = performance.now()
    const rawDelta = currentTime - lastTimeRef.current
    lastTimeRef.current = currentTime
    
    // Smooth delta time to avoid spikes
    deltaTimeRef.current = Math.min(rawDelta, 33.33) // Cap at 30 FPS minimum
    
    return deltaTimeRef.current
  }

  const getTimeMultiplier = () => {
    // Normalize to 60 FPS baseline (16.67ms per frame)
    return deltaTimeRef.current / 16.67
  }

  // 🧹 CLEANUP COMPLETO centralizzato
  const performCleanup = () => {
    loggers.particles.debug('Cleanup iniziato')
    
    // Stop animation loop
    if (animationIdRef.current) {
      cancelAnimationFrame(animationIdRef.current)
      animationIdRef.current = undefined
    }
    
    // Cleanup scroll triggers
    if (ScrollTrigger) {
      scrollTriggersRef.current.forEach(trigger => trigger.kill())
      scrollTriggersRef.current = []
    }
    
    // Cleanup particle system
    if (particleSystemRef.current) {
      particleSystemRef.current = null
    }
    
    // Cleanup three.js resources
    const renderer = rendererRef.current
    const particleSystem = particleSystemRef.current
    
    if (renderer && particleSystem && particleSystem.geometry && particleSystem.material) {
      cleanupResources(
        renderer,
        particleSystem.geometry,
        particleSystem.material,
        particleSystem.material.map as THREE.CanvasTexture
      )
    }
    
    // Remove canvas
    if (mountRef.current && rendererRef.current?.domElement) {
      try {
        mountRef.current.removeChild(rendererRef.current.domElement)
      } catch (e) {
        loggers.particles.warn('Canvas già rimosso', e)
      }
    }
    
    // Reset refs
    sceneRef.current = null
    rendererRef.current = null
    
    loggers.particles.debug('Cleanup completato')
  }

  useEffect(() => {
    // 📱 Detect mobile only on client-side
    setIsMobile(isMobileDevice())
    
    if (!mountRef.current) {
      loggers.particles.warn('Mount ref non disponibile')
      return
    }

    loggers.particles.group('Sistema Particelle Init', () => {
      loggers.particles.info('DELTA TIME + REFRESH RATE DETECTION')
    })

    try {
      // 🏗️ SETUP SCENA BASE
      const scene = new THREE.Scene()
      const camera = setupCamera()
      const renderer = setupRendererWithMobileFallback()
      
      // 🎨 MOUNT RENDERER
      mountRef.current.appendChild(renderer.domElement)
      setupCanvasStyles(renderer.domElement)

      // 🎯 INIZIALIZZAZIONE SISTEMA PARTICELLARE
      const particleSystem = initializeParticleSystem(scene)
      if (!particleSystem) {
        throw new Error('Inizializzazione particle system fallita')
      }
      
      // 📦 SALVA RIFERIMENTI
      sceneRef.current = scene
      rendererRef.current = renderer
      particleSystemRef.current = particleSystem

      // 🎨 BACKGROUND UNIFORME - nero semi-trasparente per tutti i temi
      if (typeof window !== 'undefined') {
        renderer.setClearColor(0x000000, 0.5)
      }

      // ⚡ ANIMATION LOOP CON DELTA TIME
      const animate = () => {
        animationIdRef.current = requestAnimationFrame(animate)
        
        // 📊 CALCOLA DELTA TIME E RILEVA REFRESH RATE
        const deltaTime = calculateDeltaTime()
        const timeMultiplier = getTimeMultiplier()
        detectRefreshRate()
        
        if (particleSystem.points) {
          // ✅ ROTAZIONE ADATTIVA CON DELTA TIME
          const rotationSpeedY = ANIMATION_CONFIG.rotationSpeed.y * timeMultiplier
          const rotationSpeedX = ANIMATION_CONFIG.rotationSpeed.x * timeMultiplier
          
          particleSystem.points.rotation.y += rotationSpeedY
          particleSystem.points.rotation.x += rotationSpeedX
          
          // 🔧 TIMER SEMPRE AGGIORNATO per continuità (DELTA TIME)
          particleSystem.specialAnimationTimer = (particleSystem.specialAnimationTimer || 0) + deltaTime
          
          // 🔧 ANIMAZIONI SPECIALI: Solo se NON è in corso un morphing
          if (!particleSystem.isMorphing) {
            // 🌊 BLOB MORFANTE - Con continuità visiva
            if (particleSystem.currentShape === 'pricing') {
              updateMorphingBlob(particleSystem)
            }
            
            // 🧬 DNA HELIX - Con continuità visiva
            if (particleSystem.currentShape === 'demo') {
              updateDNAHelix(particleSystem)
            }
          }
        }

        // ✅ RENDERING
        renderer.render(scene, camera)
      }
      animate()

      // 🎯 SETUP SCROLL TRIGGERS BIDIREZIONALI - Con isteresi 20%/80%
      setTimeout(() => {
        setupBidirectionalScrollTriggers(particleSystem, scene)
      }, 1000)

      // 📱 RESIZE HANDLER (SSR Safe)
      let resizeTimeout: NodeJS.Timeout
      const resizeHandler = () => {
        clearTimeout(resizeTimeout)
        resizeTimeout = setTimeout(() => {
          handleResizeEvent(camera, renderer, particleSystem)
        }, 100)
      }
      
      if (typeof window !== 'undefined') {
        window.addEventListener('resize', resizeHandler)
      }

      setIsInitialized(true)
      loggers.particles.info('Sistema inizializzato con DELTA TIME + REFRESH RATE')

      // 🧹 CLEANUP
      return () => {
        loggers.particles.debug('Cleanup useEffect')
        
        // Cleanup listeners (SSR Safe)
        if (typeof window !== 'undefined') {
          window.removeEventListener('resize', resizeHandler)
        }
        
        // Cleanup timeout
        clearTimeout(resizeTimeout)
        
        // Cleanup completo centralizzato
        performCleanup()
        
        setIsInitialized(false)
      }
    } catch (error) {
      loggers.particles.error('Errore inizializzazione', error)
      setIsInitialized(false)
      performCleanup()
    }
  }, [])

  // 🧹 CLEANUP AGGIUNTIVO on unmount
  useEffect(() => {
    return () => {
      performCleanup()
    }
  }, [])

  // 🔄 SETUP SCROLL TRIGGERS BIDIREZIONALI - Isteresi 20%/80%
  const setupBidirectionalScrollTriggers = (particleSystem: ParticleSystem, scene: THREE.Scene) => {
    if (!ScrollTrigger || typeof window === 'undefined') {
      setTimeout(() => setupBidirectionalScrollTriggers(particleSystem, scene), 500)
      return
    }

    loggers.particles.debug('Setup scroll triggers BIDIREZIONALI con isteresi 20%/60%')

    const sections = [
      { id: 'hero', shape: 'hero' },
      { id: 'features', shape: 'features' },
      { id: 'packages', shape: 'packages' },
      { id: 'pricing', shape: 'pricing' },
      { id: 'demo', shape: 'demo' }
    ]

    sections.forEach((section, index) => {
      // ⬇️ SCROLL DOWN (attuale): Entri nella sezione al 20%
      const downTrigger = ScrollTrigger.create({
        trigger: `#${section.id}`,
        start: "top 20%",     // ← Attivazione anticipata (mantieni identico)
        end: "bottom 100%",
        onEnter: () => {
          loggers.particles.debug(`SCROLL DOWN: Entering ${section.shape}`)
          morphToShape(particleSystem, section.shape, scene)
        },
        // markers: true,  // 🐛 DEBUG: Uncomment per vedere i trigger
        id: `${section.id}-down`
      })

      // ⬆️ SCROLL UP (nuovo): Esci dalla sezione all'80% → forma precedente
      if (index > 0) {  // Skip prima sezione (Hero non ha precedente)
        const prevSection = sections[index - 1]
        const upTrigger = ScrollTrigger.create({
          trigger: `#${section.id}`,
          start: "top 60%",     // ← Speculare del 20% (isteresi ottimizzata)
          end: "top 20%",       // ← Fino al punto di attivazione DOWN
          onLeaveBack: () => {
            loggers.particles.debug(`SCROLL UP: Leaving ${section.shape} → ${prevSection.shape}`)
            morphToShape(particleSystem, prevSection.shape, scene)
          },
          // markers: true,  // 🐛 DEBUG: Uncomment per vedere i trigger
          id: `${section.id}-up`
        })
        
        scrollTriggersRef.current.push(upTrigger)
      }

      scrollTriggersRef.current.push(downTrigger)
    })

    const totalTriggers = scrollTriggersRef.current.length
    const downTriggers = sections.length
    const upTriggers = sections.length - 1  // Hero non ha UP trigger
    
    loggers.particles.group('Triggers Bidirezionali', () => {
      loggers.particles.info(`DOWN: ${downTriggers} trigger (20% viewport)`)
      loggers.particles.info(`UP: ${upTriggers} trigger (60% viewport)`)
      loggers.particles.info(`Totale: ${totalTriggers} trigger con isteresi`)
      loggers.particles.info('Zona sicura: 40% gap anti-flutter')
    })
  }

  // 🎭 MORPHING CON AGGIUSTAMENTO NUMERO PARTICELLE ALL'INIZIO
  const morphToShape = (particleSystem: ParticleSystem, targetShape: string, scene: THREE.Scene) => {
    if (particleSystem.currentShape === targetShape) return

    loggers.particles.debug(`Morphing: ${particleSystem.currentShape} → ${targetShape}`)

    // 🔧 BLOCCA ANIMAZIONI CONTINUE durante morphing
    particleSystem.isMorphing = true

    // 🆕 AGGIUSTA NUMERO PARTICELLE ALL'INIZIO DEL MORPHING
    const optimalCount = getOptimalParticleCountWithMobile(targetShape)
    const currentCount = particleSystem.currentParticleCount
    
    loggers.particles.debug(`Particelle: ${currentCount} → ${optimalCount}`, { targetShape })

    // 🎯 PREPARAZIONE ARRAY per il numero target
    let workingPositions: Float32Array
    let workingColors: Float32Array
    let workingTargetPositions: Float32Array
    let workingColorsArray: Float32Array

    if (optimalCount !== currentCount) {
      // 📦 AGGIUSTA IL NUMERO DI PARTICELLE SUBITO
      adjustParticleCountBeforeMorph(particleSystem, optimalCount, scene)
    }

    // 📊 USA GLI ARRAY AGGIORNATI
    workingPositions = particleSystem.geometry.attributes.position.array as Float32Array
    workingColors = particleSystem.geometry.attributes.color.array as Float32Array
    workingTargetPositions = particleSystem.targetPositions
    workingColorsArray = particleSystem.colors

    // Aggiorna lo stato
    const previousShape = particleSystem.currentShape
    particleSystem.currentShape = targetShape
    particleSystem.startTime = Date.now()

    // Genera nuovi colori per il target
    generateColorsForShapeWithMobile(targetShape, workingColorsArray, optimalCount)

    // 🔧 VARIABILE per tenere traccia del tempo di inizio morphing
    const morphStartTime = particleSystem.specialAnimationTimer || 0

    // 🎯 MORPHING ESTETICO AVANZATO con effetti visivi:
    gsap.to({}, {
      duration: 1.5, 
      ease: "power3.inOut", 
      onUpdate: function() {
        const progress = this.progress()
        
        // 🔧 AGGIORNA TARGET POSITIONS in tempo reale per continuità
        const currentMorphTime = morphStartTime + (progress * 1500) // 1.5s = 1500ms
        
        switch (targetShape) {
          case 'hero':
            generateUniformSpherePositions(workingTargetPositions, optimalCount)
            break
          case 'features':
            generateUniformTorusPositions(workingTargetPositions, optimalCount)
            break
          case 'packages':
            generateUniformCubePositions(workingTargetPositions, optimalCount)
            break
          case 'pricing':
            generateMorphingBlobPositions(workingTargetPositions, optimalCount, currentMorphTime)
            break
          case 'demo':
            generateDoubleHelixPositions(workingTargetPositions, optimalCount, currentMorphTime)
            break
        }
        
        // ✨ INTERPOLAZIONE PIÙ FLUIDA
        const easedProgress = gsap.parseEase("power3.inOut")(progress)
        
        // 🎭 EFFETTI ESTETICI durante il morphing
        
        // ✨ SCALING EFFECT: Particelle crescono leggermente durante transizione
        const scaleEffect = 1.0 + (Math.sin(progress * Math.PI) * 0.15)
        const sizes = particleSystem.geometry.attributes.size.array as Float32Array
        for (let i = 0; i < sizes.length; i++) {
          sizes[i] = sizes[i] * scaleEffect
        }
        particleSystem.geometry.attributes.size.needsUpdate = true
        
        // 🌀 ROTAZIONE EXTRA FLUIDA durante morfing
        if (particleSystem.points) {
          const rotationBoost = Math.sin(progress * Math.PI) * 0.02
          particleSystem.points.rotation.y += rotationBoost
          particleSystem.points.rotation.x += rotationBoost * 0.5
        }
        
        // Interpola posizioni verso target aggiornati
        for (let i = 0; i < workingPositions.length; i++) {
          workingPositions[i] = workingPositions[i] + (workingTargetPositions[i] - workingPositions[i]) * easedProgress
        }
        
        // Interpola colori
        for (let i = 0; i < workingColors.length; i++) {
          workingColors[i] = workingColors[i] + (workingColorsArray[i] - workingColors[i]) * easedProgress
        }
        
        particleSystem.geometry.attributes.position.needsUpdate = true
        particleSystem.geometry.attributes.color.needsUpdate = true
      },
      onComplete: () => {
        // 🔧 SINCRONIZZAZIONE TEMPORALE
        if (targetShape === 'pricing' || targetShape === 'demo') {
          const finalMorphTime = morphStartTime + 1500
          particleSystem.specialAnimationTimer = finalMorphTime
          console.log(`🔧 Timer sincronizzato: ${finalMorphTime}ms`)
        }
        
        // 🔧 RIABILITA ANIMAZIONI CONTINUE
        particleSystem.isMorphing = false
        
        loggers.particles.once('INFO', `morph-${previousShape}-${targetShape}`, 
          `Morphing completed: ${previousShape} → ${targetShape}`, { particleCount: optimalCount })
      }
    })
  }

  // 🆕 AGGIUSTAMENTO NUMERO PARTICELLE ALL'INIZIO DEL MORPHING
  const adjustParticleCountBeforeMorph = (particleSystem: ParticleSystem, targetCount: number, scene: THREE.Scene) => {
    try {
      const currentCount = particleSystem.currentParticleCount
      const geometry = particleSystem.geometry
      
      loggers.particles.debug(`Aggiustamento particelle: ${currentCount} → ${targetCount}`)
      
      // 📦 SALVA i dati attuali
      const currentPositions = geometry.attributes.position.array as Float32Array
      const currentColors = geometry.attributes.color.array as Float32Array
      const currentSizes = geometry.attributes.size.array as Float32Array
      
      // 🆕 CREA NUOVI ARRAY con il numero target
      const newPositions = new Float32Array(targetCount * 3)
      const newColors = new Float32Array(targetCount * 3)
      const newSizes = new Float32Array(targetCount)
      
      if (targetCount > currentCount) {
        // ➕ AGGIUNGI PARTICELLE: Copia esistenti + duplica per riempire
        loggers.particles.debug(`Aggiungendo ${targetCount - currentCount} particelle`)
        
        // Copia particelle esistenti
        for (let i = 0; i < currentCount * 3; i++) {
          newPositions[i] = currentPositions[i]
          newColors[i] = currentColors[i]
        }
        for (let i = 0; i < currentCount; i++) {
          newSizes[i] = currentSizes[i]
        }
        
        // Duplica particelle esistenti per riempire il target
        for (let i = currentCount; i < targetCount; i++) {
          const sourceIndex = i % currentCount // Cicla tra le particelle esistenti
          
          // Copia posizione dalla particella sorgente
          newPositions[i * 3] = currentPositions[sourceIndex * 3]
          newPositions[i * 3 + 1] = currentPositions[sourceIndex * 3 + 1]
          newPositions[i * 3 + 2] = currentPositions[sourceIndex * 3 + 2]
          
          // Copia colore dalla particella sorgente
          newColors[i * 3] = currentColors[sourceIndex * 3]
          newColors[i * 3 + 1] = currentColors[sourceIndex * 3 + 1]
          newColors[i * 3 + 2] = currentColors[sourceIndex * 3 + 2]
          
          // Copia size dalla particella sorgente
          newSizes[i] = currentSizes[sourceIndex]
        }
        
      } else {
        // ➖ MANTIENI SOLO LE PRIME N PARTICELLE
        loggers.particles.debug(`Mantenendo solo le prime ${targetCount} particelle`)
        
        for (let i = 0; i < targetCount * 3; i++) {
          newPositions[i] = currentPositions[i]
          newColors[i] = currentColors[i]
        }
        for (let i = 0; i < targetCount; i++) {
          newSizes[i] = currentSizes[i]
        }
      }
      
      // 🔄 AGGIORNA GLI ATTRIBUTI DELLA GEOMETRIA
      geometry.setAttribute('position', new THREE.BufferAttribute(newPositions, 3))
      geometry.setAttribute('color', new THREE.BufferAttribute(newColors, 3))
      geometry.setAttribute('size', new THREE.BufferAttribute(newSizes, 1))
      
      // 🔄 AGGIORNA GLI ARRAY DI LAVORO
      particleSystem.targetPositions = new Float32Array(targetCount * 3)
      particleSystem.colors = new Float32Array(targetCount * 3)
      particleSystem.currentParticleCount = targetCount
      
      // ✅ NOTIFICA UPDATE
      geometry.attributes.position.needsUpdate = true
      geometry.attributes.color.needsUpdate = true
      geometry.attributes.size.needsUpdate = true
      
      loggers.particles.debug(`Particelle aggiustate: ${currentCount} → ${targetCount}`)
      
    } catch (error) {
      loggers.particles.error('Errore aggiustamento particelle', error)
    }
  }

  return (
    <div 
      ref={mountRef} 
      className="particles-container" 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        pointerEvents: 'none'
      }} 
    >
      {/* 📱 MOBILE OVERLAY */}
      {isMobile && isInitialized && (
        <div 
          className="mobile-contrast-overlay"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.2) 100%)',
            zIndex: 1,
            pointerEvents: 'none'
          }}
        />
      )}
    </div>
  )
}

// 🏗️ INIZIALIZZAZIONE SISTEMA PARTICELLARE (identico)
function initializeParticleSystem(scene: THREE.Scene): ParticleSystem | null {
  try {
    const currentParticleCount = getOptimalParticleCountWithMobile('hero')

    // 🎨 SETUP GEOMETRIA
    const geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(currentParticleCount * 3)
    const colors = new Float32Array(currentParticleCount * 3)
    const sizes = new Float32Array(currentParticleCount)

    // 🌐 INIZIALIZZAZIONE PARTICELLE (Sfera uniforme)
    generateUniformSpherePositions(positions, currentParticleCount)
    generateColorsForShapeWithMobile('hero', colors, currentParticleCount)
    generateOriginalSizes(sizes, currentParticleCount)

    // 📐 SETUP ATTRIBUTI GEOMETRIA
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))

    // 🎨 SETUP MATERIALE
    const circleTexture = createCircleTexture()
    const material = createParticleMaterialWithMobileOptimizations(circleTexture)

    // 🎯 CREAZIONE POINTS
    const points = new THREE.Points(geometry, material)
    scene.add(points)

    // 📦 CREAZIONE SISTEMA PARTICELLARE
    const particleSystem: ParticleSystem = {
      geometry,
      material,
      points,
      targetPositions: new Float32Array(currentParticleCount * 3),
      colors: new Float32Array(currentParticleCount * 3),
      currentShape: 'hero',
      startTime: Date.now(),
      currentParticleCount,
      isMorphing: false,
      specialAnimationTimer: 0,
      pausedSpecialTime: 0
    }

    loggers.particles.info(`Sistema particelle con continuità: ${currentParticleCount} particelle`)
    return particleSystem
  } catch (error) {
    loggers.particles.error('Errore inizializzazione particle system', error)
    return null
  }
}

// 🌊 UPDATE MORPHING BLOB (identico)
function updateMorphingBlob(particleSystem: ParticleSystem) {
  try {
    const currentTime = particleSystem.specialAnimationTimer || 0
    const positions = particleSystem.geometry.attributes.position.array as Float32Array
    const count = particleSystem.currentParticleCount
    
    generateMorphingBlobPositions(positions, count, currentTime)
    particleSystem.geometry.attributes.position.needsUpdate = true
  } catch (error) {
    loggers.particles.warn('Errore update morphing blob', error)
  }
}

// 🧬 UPDATE DNA HELIX (identico)
function updateDNAHelix(particleSystem: ParticleSystem) {
  try {
    const currentTime = particleSystem.specialAnimationTimer || 0
    const positions = particleSystem.geometry.attributes.position.array as Float32Array
    const count = particleSystem.currentParticleCount
    
    generateDoubleHelixPositions(positions, count, currentTime)
    particleSystem.geometry.attributes.position.needsUpdate = true
  } catch (error) {
    loggers.particles.warn('Errore update DNA helix', error)
  }
}

// 📱 GESTIONE RESIZE (identico)
function handleResizeEvent(
  camera: THREE.PerspectiveCamera,
  renderer: THREE.WebGLRenderer,
  particleSystem: ParticleSystem
) {
  if (!camera || !renderer || !particleSystem) {
    console.warn('⚠️ Resize: Missing components')
    return
  }
  
  try {
    handleResizeWithMobile(camera, renderer, particleSystem.material)
    loggers.particles.debug('Resize gestito')
  } catch (error) {
    loggers.particles.warn('Errore resize event', error)
  }
}