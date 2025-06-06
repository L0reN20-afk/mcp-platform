'use client'

import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'

// 📦 IMPORT MODULI SPECIALIZZATI
import { ParticleSystem } from './types'
import { ANIMATION_CONFIG } from './constants'
import { 
  generateUniformSpherePositions,
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
import { morphToShape } from './morphingEngine'
import { setupScrollTriggers } from './scrollTriggers'

// 🎯 COMPONENTE PRINCIPALE OTTIMIZZATO
export default function ParticleBackground() {
  const mountRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const particleSystemRef = useRef<ParticleSystem | null>(null)
  const animationIdRef = useRef<number>()
  
  // 📱 SSR Safe mobile detection
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // 📱 Detect mobile only on client-side
    setIsMobile(isMobileDevice())
    
    if (!mountRef.current) return

    console.log('🎯 Inizializzazione sistema particelle ottimizzato...')

    // 🏗️ SETUP SCENA BASE
    const scene = new THREE.Scene()
    const camera = setupCamera()
    const renderer = setupRendererWithMobileFallback()
    
    // 🎨 MOUNT RENDERER
    mountRef.current.appendChild(renderer.domElement)
    setupCanvasStyles(renderer.domElement)

    // 🎯 INIZIALIZZAZIONE SISTEMA PARTICELLARE
    const particleSystem = initializeParticleSystem(scene)
    
    // 📦 SALVA RIFERIMENTI
    sceneRef.current = scene
    rendererRef.current = renderer
    particleSystemRef.current = particleSystem

    // 🎨 LISTENER DINAMICO per cambi di tema (SSR Safe)
    let themeMediaQuery: MediaQueryList | null = null
    let handleThemeChange: ((e: MediaQueryListEvent) => void) | null = null
    
    if (typeof window !== 'undefined') {
      themeMediaQuery = window.matchMedia('(prefers-color-scheme: light)')
      handleThemeChange = (e: MediaQueryListEvent) => {
        console.log(`🎨 Tema cambiato: ${e.matches ? 'chiaro' : 'scuro'}`)
        if (e.matches) {
          // Tema chiaro → Background opaco nero
          renderer.setClearColor(0x000000, 1)
        } else {
          // Tema scuro → Background trasparente
          renderer.setClearColor(0x000000, 0)
        }
      }
      themeMediaQuery.addEventListener('change', handleThemeChange)
    }

    // 🎬 ANIMATION LOOP OTTIMIZZATO
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate)
      
      if (particleSystem.points) {
        // Rotazione continua
        particleSystem.points.rotation.y += ANIMATION_CONFIG.rotationSpeed.y
        particleSystem.points.rotation.x += ANIMATION_CONFIG.rotationSpeed.x
        
        // 🌊 MORPHING CONTINUO per forme dinamiche (FIXED: no import dinamici)
        if (particleSystem.currentShape === 'pricing') {
          updateMorphingBlobOptimized(particleSystem)
        }
        
        // 🧬 ANIMAZIONE DNA CONTINUA (FIXED: no import dinamici)
        if (particleSystem.currentShape === 'demo') {
          updateDNAHelixOptimized(particleSystem)
        }
      }

      renderer.render(scene, camera)
    }
    animate()

    // 📜 SETUP SCROLL TRIGGERS UNIFICATI (include progressive separation)
    setupScrollTriggers(particleSystem, scene)

    // 📱 RESIZE HANDLER (SSR Safe)
    const resizeHandler = () => handleResizeEvent(camera, renderer, particleSystem, scene)
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', resizeHandler)
    }

    console.log('✅ Sistema particelle ottimizzato inizializzato!')

    // 🧹 CLEANUP
    return () => {
      // Cleanup listeners (SSR Safe)
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', resizeHandler)
      }
      // Cleanup tema listener (SSR Safe)
      if (themeMediaQuery && handleThemeChange) {
        themeMediaQuery.removeEventListener('change', handleThemeChange)
      }
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current)
      }
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement)
      }
      
      // Cleanup completo
      if (particleSystem) {
        cleanupResources(
          renderer,
          particleSystem.geometry,
          particleSystem.material,
          particleSystem.material.map as THREE.CanvasTexture
        )
      }
    }
  }, [])

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
      {/* 📱 MOBILE OVERLAY - Solo su dispositivi mobili per contrasto */}
      {isMobile && (
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

// 🏗️ INIZIALIZZAZIONE SISTEMA PARTICELLARE
function initializeParticleSystem(scene: THREE.Scene): ParticleSystem {
  // Calcola numero ottimale per la forma iniziale (hero)
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
    isMorphing: false // Inizializza flag morphing
  }

  return particleSystem
}

// 🌊 UPDATE MORPHING BLOB OTTIMIZZATO (no import dinamici)
function updateMorphingBlobOptimized(particleSystem: ParticleSystem) {
  const currentTime = Date.now() - particleSystem.startTime
  const positions = particleSystem.geometry.attributes.position.array as Float32Array
  const count = particleSystem.currentParticleCount
  
  // ✅ FIXED: Import statico invece di dinamico
  generateMorphingBlobPositions(positions, count, currentTime)
  particleSystem.geometry.attributes.position.needsUpdate = true
}

// 🧬 UPDATE DNA HELIX OTTIMIZZATO (no import dinamici)
function updateDNAHelixOptimized(particleSystem: ParticleSystem) {
  const currentTime = Date.now() - particleSystem.startTime
  const positions = particleSystem.geometry.attributes.position.array as Float32Array
  const count = particleSystem.currentParticleCount
  
  // ✅ FIXED: Import statico invece di dinamico
  generateDoubleHelixPositions(positions, count, currentTime)
  particleSystem.geometry.attributes.position.needsUpdate = true
}

// 📱 GESTIONE RESIZE CON AGGIORNAMENTO CONTEGGIO
function handleResizeEvent(
  camera: THREE.PerspectiveCamera,
  renderer: THREE.WebGLRenderer,
  particleSystem: ParticleSystem,
  scene: THREE.Scene
) {
  if (!camera || !renderer || !particleSystem) return
  
  // Resize base
  handleResizeWithMobile(camera, renderer, particleSystem.material)
  
  // 🎯 RICALCOLA NUMERO OTTIMALE PER LA FORMA CORRENTE
  const newOptimalCount = getOptimalParticleCountWithMobile(particleSystem.currentShape)
  
  // Se il numero ottimale è cambiato, ricrea la forma
  if (newOptimalCount !== particleSystem.currentParticleCount) {
    console.log(`📱 Resize: Aggiornamento particelle ${particleSystem.currentParticleCount} → ${newOptimalCount}`)
    morphToShape(particleSystem, particleSystem.currentShape, scene, true) // skipAnimation = true
  }
  
  console.log(`📱 Resize: particelle: ${particleSystem.currentParticleCount}`)
}