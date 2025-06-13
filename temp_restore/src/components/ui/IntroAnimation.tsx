'use client'

import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'

// Import delle funzioni originali per mantenere identica composizione
import { 
  createCircleTexture,
  generateOriginalSizes,
  getOptimalParticleCountWithMobile
} from '@/components/3d/utils'
import { generateBlueColors } from '@/components/3d/colorGenerators'
import { SHAPE_DIMENSIONS, MATERIAL_CONFIG } from '@/components/3d/constants'
import { loggers } from '@/utils/logger'

interface IntroAnimationProps {
  onComplete: () => void
}

// 🎯 STATO FRAMMENTO A QUATTRO CATEGORIE
interface Fragment {
  index: number
  velocity: THREE.Vector3
  angularVelocity: THREE.Vector3
  onGround: boolean
  bounces: number
  isRolling: boolean
  staysCentral: boolean      // 🆕 5%: rimane al centro con rimbalzi verticali
  bounceOutward: boolean     // 🆕 30%: rimbalza verso l'esterno evidenti
  bounceSubtle: boolean      // 🆕 33%: rimbalza verso l'esterno sottili
  
  // Proprietà fisiche
  mass: number
  friction: number
  bounciness: number
  stoppingThreshold: number
  rollingSmoothness: number
  maxBounces: number
  explosionForceMultiplier: number
  initialVerticalVelocity: number
}

// 🎨 TEXTURE CIRCOLARE ULTRA-PERFETTA con ALPHATEST
function createPerfectCircleTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = 512   // 🎯 ULTRA-HD: 512x512 per zero pixelatura
  canvas.height = 512
  const context = canvas.getContext('2d')!
  
  context.clearRect(0, 0, canvas.width, canvas.height)
  
  const centerX = canvas.width / 2
  const centerY = canvas.height / 2
  const radius = 240   // 🎯 Raggio proporzionale a 512x512
  
  const imageData = context.createImageData(canvas.width, canvas.height)
  const data = imageData.data
  
  for (let x = 0; x < canvas.width; x++) {
    for (let y = 0; y < canvas.height; y++) {
      const dx = x - centerX
      const dy = y - centerY
      const distance = Math.sqrt(dx * dx + dy * dy)
      
      const index = (y * canvas.width + x) * 4
      
      if (distance <= radius) {
        let alpha = 1.0
        if (distance > radius - 32) {  // 🎯 ANTI-ALIASING ULTRA-SMOOTH: bordo 32px
          alpha = Math.max(0, (radius - distance) / 32)
        }
        
        data[index] = 255
        data[index + 1] = 255
        data[index + 2] = 255
        data[index + 3] = Math.floor(alpha * 255)
      } else {
        data[index] = 0
        data[index + 1] = 0
        data[index + 2] = 0
        data[index + 3] = 0
      }
    }
  }
  
  context.putImageData(imageData, 0, 0)
  
  const texture = new THREE.CanvasTexture(canvas)
  texture.needsUpdate = true
  texture.generateMipmaps = true  // 🎯 MIPMAP ABILITATI per qualità a tutte le distanze
  texture.minFilter = THREE.LinearMipmapLinearFilter  // 🎯 FILTRO ULTRA-QUALITY
  texture.magFilter = THREE.LinearFilter  // 🎯 ZOOM SMOOTH
  texture.wrapS = THREE.ClampToEdgeWrapping
  texture.wrapT = THREE.ClampToEdgeWrapping
  
  return texture
}

export default function IntroAnimation({ onComplete }: IntroAnimationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const sphereRef = useRef<THREE.Points | null>(null)
  const dustParticlesRef = useRef<THREE.Points | null>(null)
  const animationIdRef = useRef<number>()
  
  const fallCompletedRef = useRef(false)
  const impactOccurredRef = useRef(false)
  const fragmentsDataRef = useRef<Fragment[]>([])
  
  // 🚀 FISICA REALISTICA
  const fallVelocityRef = useRef(0)
  const GRAVITY_ACCELERATION = 0.0072
  const TERMINAL_VELOCITY = 0.225
  
  const FLOOR_Y = -1.8
  const FRAGMENT_SPREAD = 1.8

  useEffect(() => {
    if (!canvasRef.current) return

    loggers.intro.group('Inizializzazione IntroAnimation', () => {
      loggers.intro.info('Esplosione semplice + prospettiva corretta')
    })

    // Setup scene Three.js
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({ 
      canvas: canvasRef.current, 
      alpha: true,
      antialias: true,
      premultipliedAlpha: false
    })
    
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setClearColor(0x000000, 0)
    
    // 📉 Camera abbassata per ridurre effetto inclinazione
    camera.position.y = -4
    camera.position.z = 8
    camera.lookAt(0, 0, 0)  // Guarda verso il centro della scena

    sceneRef.current = scene
    rendererRef.current = renderer

    createOptimizedSphere(scene)
    createDustParticles(scene)

    loggers.intro.debug(`Floor Y: ${FLOOR_Y} - Prospettiva verticale`)

    const animate = () => {
      if (fallCompletedRef.current) return
      
      animationIdRef.current = requestAnimationFrame(animate)
      
      if (!impactOccurredRef.current) {
        updateRealisticFallPhysics()
      } else {
        updateOptimizedFragmentPhysics()
        updateDustEffect()
      }
      
      renderer.render(scene, camera)
    }
    animate()

    const timer = setTimeout(() => {
      fallCompletedRef.current = true
      setTimeout(() => {
        onComplete()
      }, 800)
    }, 2500)  // 🎯 LIMITE 2.5 SECONDI: stop forzato a 2500ms

    return () => {
      loggers.intro.debug('Cleanup finale completato')
      clearTimeout(timer)
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current)
      }
      scene.clear()
      renderer.dispose()
    }
  }, [onComplete])

  // ✨ PARTICELLE POLVERE con ALPHATEST
  const createDustParticles = (scene: THREE.Scene) => {
    const dustCount = 15
    const geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(dustCount * 3)
    const colors = new Float32Array(dustCount * 3)
    const sizes = new Float32Array(dustCount)

    for (let i = 0; i < dustCount; i++) {
      positions[i * 3] = 0
      positions[i * 3 + 1] = FLOOR_Y
      positions[i * 3 + 2] = 0
      
      colors[i * 3] = 0.95
      colors[i * 3 + 1] = 0.95  
      colors[i * 3 + 2] = 1.0
      
      sizes[i] = Math.random() * 0.015 + 0.005
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))

    const material = new THREE.PointsMaterial({
      size: 0.096,
      sizeAttenuation: true,
      vertexColors: true,
      // 🎯 SOLUZIONE ALPHATEST: Elimina quadrati neri anche per la polvere
      alphaTest: 0.5,
      transparent: false,
      opacity: 0,
      blending: THREE.NormalBlending
    })

    const dust = new THREE.Points(geometry, material)
    scene.add(dust)
    dustParticlesRef.current = dust
  }

  // 🌐 SFERA CON DISTRIBUZIONE UNIFORME SUL PIANO ORIZZONTALE
  const createOptimizedSphere = (scene: THREE.Scene) => {
    const particleCount = 600  // 🎯 NUMERO FISSO: 600 particelle ottimizzate
    
    const geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(particleCount * 3)
    const colors = new Float32Array(particleCount * 3)
    const sizes = new Float32Array(particleCount)

    const radius = SHAPE_DIMENSIONS.sphere.radius * 0.024
    
    // 🎯 DISTRIBUZIONE UNIFORME - TUTTE LE PARTICELLE SULLO STESSO PIANO Z
    for (let i = 0; i < particleCount; i++) {
      const y = 1 - (i / (particleCount - 1)) * 2
      const radiusAtY = Math.sqrt(1 - y * y)
      const theta = 2 * Math.PI * i / 1.618033988749

      let x = Math.cos(theta) * radiusAtY
      let z = Math.sin(theta) * radiusAtY
      
      // Centro leggermente meno denso ma non vuoto
      const distanceFromCenter = Math.sqrt(x * x + z * z)
      if (distanceFromCenter < 0.05) {
        const pushFactor = 0.05 / distanceFromCenter
        x *= pushFactor
        z *= pushFactor
      }

      positions[i * 3] = x * radius
      positions[i * 3 + 1] = (y * radius) + 4
      positions[i * 3 + 2] = z * radius  // 🎯 TUTTE SULLO STESSO PIANO Z inizialmente
    }

    // Colori bianchi uniformi per tutte le particelle
    for (let i = 0; i < particleCount; i++) {
      colors[i * 3] = 1.0     // R = bianco
      colors[i * 3 + 1] = 1.0 // G = bianco  
      colors[i * 3 + 2] = 1.0 // B = bianco
    }
    
    // Dimensioni uniformi
    for (let i = 0; i < particleCount; i++) {
      sizes[i] = 1.0
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))

    // 🎨 MATERIALE CON ALPHATEST - ELIMINA QUADRATI NERI
    const perfectTexture = createPerfectCircleTexture()
    const material = new THREE.PointsMaterial({
      size: 0.0816,
      sizeAttenuation: true,  // 🎯 PROSPETTIVA VERTICALE: Particelle lontane lungo Z appaiono più piccole
      vertexColors: true,
      // 🎯 SOLUZIONE DEFINITIVA: alphaTest elimina quadrati neri
      alphaTest: 0.5,        // ← CAMBIATO da 0.001 a 0.5
      transparent: false,    // ← CAMBIATO da true a false
      opacity: MATERIAL_CONFIG.opacity,
      blending: THREE.NormalBlending,
      map: perfectTexture,
      depthWrite: false,
      depthTest: true,
      premultipliedAlpha: false
    })

    const sphere = new THREE.Points(geometry, material)
    scene.add(sphere)
    sphereRef.current = sphere

    loggers.intro.info(`Sfera con alphaTest: ${particleCount} particelle - zero quadrati neri`)
    
    // 🎯 SISTEMA A QUATTRO CATEGORIE: 5% centro + 30% evidenti + 33% sottili + 32% rotolamento
    const fragments: Fragment[] = []
    for (let i = 0; i < particleCount; i++) {
      const x = positions[i * 3]
      const z = positions[i * 3 + 2]
      const distanceFromCenter = Math.sqrt(x * x + z * z)
      const normalizedDistance = Math.min(distanceFromCenter / radius, 1.0)
      
      // 🎯 DISTRIBUZIONE A QUATTRO LIVELLI
      const randomValue = Math.random()
      const staysCentral = randomValue < 0.05        // 5%: centro verticale
      const bounceOutward = randomValue >= 0.05 && randomValue < 0.35    // 30%: rimbalzi evidenti (0.05-0.35)
      const bounceSubtle = randomValue >= 0.35 && randomValue < 0.68     // 33%: rimbalzi sottili (0.35-0.68)
      // 32%: rotolante normale (0.68-1.00)
      
      const mass = 0.7 + normalizedDistance * 0.8
      const friction = 0.94 + normalizedDistance * 0.03
      const stoppingThreshold = 0.008 + normalizedDistance * 0.007  // 🎯 TARATO 2.5s: 0.008-0.015
      const rollingSmoothness = 0.978 + normalizedDistance * 0.005  // 🎯 TARATO 2.5s: 0.978-0.983
      
      // 🎯 PARAMETRI SPECIFICI PER CATEGORIA
      let bounciness, maxBounces, explosionForceMultiplier, initialVerticalVelocity
      
      if (staysCentral) {
        // 🎪 CENTRO: Rimbalzi verticali - VELOCITÀ RIDOTTE per 2.5s
        bounciness = 0.55 + Math.random() * 0.15     
        maxBounces = 2                               
        explosionForceMultiplier = Math.random() * 0.5 + 0.2  
        initialVerticalVelocity = Math.random() * 0.6 + 0.8   // 🎯 RIDOTTA: 0.8-1.4 (era 1.1-2.0)
      } else if (bounceOutward) {
        // 🚀 ESTERNO EVIDENTI: Rimbalzi diagonali - VELOCITÀ RIDOTTE per 2.5s  
        bounciness = 0.50 + Math.random() * 0.20     
        maxBounces = 2                               
        explosionForceMultiplier = Math.random() * FRAGMENT_SPREAD * 0.7 + 0.6  
        initialVerticalVelocity = Math.random() * 0.5 + 0.5   // 🎯 RIDOTTA: 0.5-1.0 (era 0.7-1.4)
      } else if (bounceSubtle) {
        // 🌀 ESTERNO SOTTILI: Rimbalzi diagonali - VELOCITÀ RIDOTTE per 2.5s
        bounciness = 0.35 + Math.random() * 0.15     
        maxBounces = 2                               
        explosionForceMultiplier = Math.random() * FRAGMENT_SPREAD * 0.5 + 0.4  
        initialVerticalVelocity = Math.random() * 0.3 + 0.3   // 🎯 RIDOTTA: 0.3-0.6 (era 0.4-0.9)
      } else {
        // 🌊 ROTOLANTE: Comportamento normale - VELOCITÀ RIDOTTE per 2.5s
        bounciness = 0.15 + Math.random() * 0.15     
        maxBounces = 1                               
        explosionForceMultiplier = Math.random() * FRAGMENT_SPREAD + 0.8  
        initialVerticalVelocity = Math.random() * 0.2 + 0.1   // 🎯 RIDOTTA: 0.1-0.3 (era 0.2-0.5)
      }
        
      fragments.push({
        index: i,
        velocity: new THREE.Vector3(),
        angularVelocity: new THREE.Vector3(),
        onGround: false,
        bounces: 0,
        isRolling: false,
        staysCentral,
        bounceOutward,
        bounceSubtle,
        mass,
        friction,
        bounciness,
        stoppingThreshold,
        rollingSmoothness,
        maxBounces,
        explosionForceMultiplier,
        initialVerticalVelocity
      })
    }
    
    fragmentsDataRef.current = fragments
    
    const centerCount = fragments.filter(f => f.staysCentral).length
    const bounceCount = fragments.filter(f => f.bounceOutward).length
    const subtleCount = fragments.filter(f => f.bounceSubtle).length
    const rollCount = fragments.filter(f => !f.staysCentral && !f.bounceOutward && !f.bounceSubtle).length
    
    loggers.intro.group(`${particleCount} Frammenti Distribuiti`, () => {
      loggers.intro.info(`Centro: ${centerCount} (${(centerCount/particleCount*100).toFixed(1)}%) - rimbalzi verticali`)
      loggers.intro.info(`Evidenti: ${bounceCount} (${(bounceCount/particleCount*100).toFixed(1)}%) - rimbalzi diagonali forti`)
      loggers.intro.info(`Sottili: ${subtleCount} (${(subtleCount/particleCount*100).toFixed(1)}%) - rimbalzi leggeri`)
      loggers.intro.info(`Rotolanti: ${rollCount} (${(rollCount/particleCount*100).toFixed(1)}%) - rotolamento normale`)
    })
  }

  // 🚀 FISICA REALISTICA
  const updateRealisticFallPhysics = () => {
    if (!sphereRef.current || impactOccurredRef.current) return

    const sphere = sphereRef.current
    const positions = sphere.geometry.attributes.position.array as Float32Array

    fallVelocityRef.current += GRAVITY_ACCELERATION
    
    if (fallVelocityRef.current > TERMINAL_VELOCITY) {
      fallVelocityRef.current = TERMINAL_VELOCITY
    }

    let lowestY = Infinity

    for (let i = 0; i < positions.length; i += 3) {
      const currentY = positions[i + 1]
      positions[i + 1] -= fallVelocityRef.current
      
      if (currentY < lowestY) {
        lowestY = currentY
      }
    }

    if (lowestY <= FLOOR_Y) {
      loggers.intro.group('Evento Impatto', () => {
        loggers.intro.info(`Velocità impatto: ${fallVelocityRef.current.toFixed(3)}`)
      })
      triggerSimpleExplosion()
      return
    }

    const rotationSpeed = fallVelocityRef.current * 0.1
    sphere.rotation.x += rotationSpeed
    sphere.rotation.y += rotationSpeed * 1.8

    sphere.geometry.attributes.position.needsUpdate = true
  }

  // 💥 ESPLOSIONE A QUATTRO LIVELLI: 5% centro + 30% evidenti + 33% sottili + 32% rotolamento
  const triggerSimpleExplosion = () => {
    if (!sphereRef.current || !fragmentsDataRef.current.length) return
    
    loggers.intro.group('Esplosione Fisica', () => {
      loggers.intro.info('Quattro livelli: Centro + Evidenti + Sottili + Rotolamento')
    })
    impactOccurredRef.current = true
    
    const sphere = sphereRef.current
    const positions = sphere.geometry.attributes.position.array as Float32Array
    
    const impactVelocity = fallVelocityRef.current
    
    // 🎯 ESPLOSIONE DIFFERENZIATA PER QUATTRO CATEGORIE
    fragmentsDataRef.current.forEach((fragment, i) => {
      const x = positions[i * 3]
      const z = positions[i * 3 + 2]
      
      if (fragment.staysCentral) {
        // 🎪 CENTRO: Rimbalzi verticali moderati
        positions[i * 3 + 1] = FLOOR_Y + 0.25  // Altezza moderata per rimbalzi meno estremi
        
        fragment.velocity.set(
          (Math.random() - 0.5) * fragment.explosionForceMultiplier,  // Dispersione leggera orizzontale
          fragment.initialVerticalVelocity,                           // Velocità moderata verticale
          (Math.random() - 0.5) * fragment.explosionForceMultiplier   // Dispersione leggera su Z
        )
        
      } else if (fragment.bounceOutward) {
        // 🚀 ESTERNO EVIDENTI: Rimbalzi diagonali forti
        positions[i * 3 + 1] = FLOOR_Y + 0.2  // Partenza alta per rimbalzi evidenti
        
        const distance = Math.sqrt(x * x + z * z)
        const normalizedX = distance > 0.01 ? x / distance : (Math.random() - 0.5)
        const normalizedZ = distance > 0.01 ? z / distance : (Math.random() - 0.5)
        
        fragment.velocity.set(
          normalizedX * fragment.explosionForceMultiplier,             // Direzione verso esterno
          fragment.initialVerticalVelocity + (impactVelocity * 0.4),   // Velocità verticale media-alta
          normalizedZ * fragment.explosionForceMultiplier              // Direzione verso esterno
        )
        
        // Prospettiva Z per movimento tridimensionale
        const zMovement = (Math.random() - 0.5) * 1.2
        positions[i * 3 + 2] += zMovement
        
      } else if (fragment.bounceSubtle) {
        // 🌀 ESTERNO SOTTILI: Rimbalzi diagonali leggeri
        positions[i * 3 + 1] = FLOOR_Y + 0.1  // Partenza media per rimbalzi sottili
        
        const distance = Math.sqrt(x * x + z * z)
        const normalizedX = distance > 0.01 ? x / distance : (Math.random() - 0.5)
        const normalizedZ = distance > 0.01 ? z / distance : (Math.random() - 0.5)
        
        fragment.velocity.set(
          normalizedX * fragment.explosionForceMultiplier,             // Direzione verso esterno
          fragment.initialVerticalVelocity + (impactVelocity * 0.25),  // Velocità verticale media-bassa
          normalizedZ * fragment.explosionForceMultiplier              // Direzione verso esterno
        )
        
        // Prospettiva Z per movimento tridimensionale (meno ampio)
        const zMovement = (Math.random() - 0.5) * 0.8
        positions[i * 3 + 2] += zMovement
        
      } else {
        // 🌊 ROTOLANTE: Sul pavimento, rotolamento normale
        positions[i * 3 + 1] = FLOOR_Y
        
        const distance = Math.sqrt(x * x + z * z)
        const normalizedX = distance > 0.01 ? x / distance : (Math.random() - 0.5)
        const normalizedZ = distance > 0.01 ? z / distance : (Math.random() - 0.5)
        
        fragment.velocity.set(
          normalizedX * fragment.explosionForceMultiplier,
          fragment.initialVerticalVelocity + (impactVelocity * 0.5),   // Velocità bassa verticale
          normalizedZ * fragment.explosionForceMultiplier
        )
        
        // Prospettiva Z per movimento tridimensionale
        const zMovement = (Math.random() - 0.5) * 1.5
        positions[i * 3 + 2] += zMovement
      }
      
      fragment.angularVelocity.set(
        (Math.random() - 0.5) * 0.15,
        (Math.random() - 0.5) * 0.15,
        (Math.random() - 0.5) * 0.15
      )
    })
    
    sphere.geometry.attributes.position.needsUpdate = true
    
    // Polvere
    if (dustParticlesRef.current) {
      const dustMaterial = dustParticlesRef.current.material as THREE.PointsMaterial
      dustMaterial.opacity = 0.3
      
      const dustPositions = dustParticlesRef.current.geometry.attributes.position.array as Float32Array
      for (let i = 0; i < dustPositions.length; i += 3) {
        dustPositions[i] = (Math.random() - 0.5) * 2.0
        dustPositions[i + 1] = FLOOR_Y + Math.random() * 0.2
        dustPositions[i + 2] = (Math.random() - 0.5) * 2.0
      }
      dustParticlesRef.current.geometry.attributes.position.needsUpdate = true
    }
    
    loggers.intro.once('INFO', 'explosion-complete', 'Esplosione a quattro livelli completata')
  }

  // 🎯 FISICA OTTIMIZZATA PER QUATTRO CATEGORIE + STOP FORZATO + DECELERAZIONE REALISTICA
  const updateOptimizedFragmentPhysics = () => {
    if (!sphereRef.current || !fragmentsDataRef.current.length) return

    // 🚫 STOP ASSOLUTO: Ferma tutto quando l'animazione intro è completata
    if (fallCompletedRef.current) {
      const sphere = sphereRef.current
      const positions = sphere.geometry.attributes.position.array as Float32Array
      
      // Ferma tutte le particelle e mettile sul pavimento
      fragmentsDataRef.current.forEach((fragment, i) => {
        positions[i * 3 + 1] = FLOOR_Y  // Sul pavimento
        fragment.velocity.set(0, 0, 0)  // Velocità zero
        fragment.onGround = true
        fragment.isRolling = false
        fragment.bounces = fragment.maxBounces  // Ferma rimbalzi
      })
      
      sphere.geometry.attributes.position.needsUpdate = true
      return
    }

    const sphere = sphereRef.current
    const positions = sphere.geometry.attributes.position.array as Float32Array
    
    fragmentsDataRef.current.forEach((fragment, i) => {
      const y = positions[i * 3 + 1]
      
      if (!fragment.onGround && y > FLOOR_Y) {
        // Fase aerea - applica gravità + DECELERAZIONE PROGRESSIVA
        const gravityEffect = GRAVITY_ACCELERATION * 8 * fragment.mass * 0.8
        fragment.velocity.y -= gravityEffect
        
        // 🌬️ RESISTENZA DELL'ARIA: Rallenta le particelle in movimento
        const horizontalSpeed = Math.sqrt(fragment.velocity.x * fragment.velocity.x + fragment.velocity.z * fragment.velocity.z)
        const airResistance = 0.98 - (horizontalSpeed * 0.01)  // Più resistenza = più velocità
        
        // 📍 DECELERAZIONE BASATA SU DISTANZA: Più lontane = più lente
        const x = positions[i * 3]
        const z = positions[i * 3 + 2]
        const distanceFromOrigin = Math.sqrt(x * x + z * z)
        const distanceDecay = Math.max(0.96, 1.0 - (distanceFromOrigin * 0.015))  // Rallenta con la distanza
        
        // Applica decelerazione progressiva solo alle velocità orizzontali
        fragment.velocity.x *= airResistance * distanceDecay
        fragment.velocity.z *= airResistance * distanceDecay
        
        positions[i * 3] += fragment.velocity.x * 0.02
        positions[i * 3 + 1] += fragment.velocity.y * 0.02
        positions[i * 3 + 2] += fragment.velocity.z * 0.02
        
      } else if (!fragment.onGround && y <= FLOOR_Y) {
        // Rimbalzo - gestione differenziata per tipo
        positions[i * 3 + 1] = FLOOR_Y
        
        if (fragment.bounces < fragment.maxBounces && Math.abs(fragment.velocity.y) > 0.05) {
          fragment.velocity.y = Math.abs(fragment.velocity.y) * fragment.bounciness
          
          if (fragment.staysCentral) {
            // 🎪 CENTRO: Rimbalzi verticali - PIÙ ATTRITO per 2.5s
            fragment.velocity.x *= fragment.friction * 0.75  // 🎯 PIÙ ATTRITO: 0.75 (era 0.9)
            fragment.velocity.z *= fragment.friction * 0.75
          } else if (fragment.bounceOutward) {
            // 🚀 ESTERNO EVIDENTI: PIÙ ATTRITO per 2.5s
            fragment.velocity.x *= fragment.friction * 0.65  // 🎯 PIÙ ATTRITO: 0.65 (era 0.75)
            fragment.velocity.z *= fragment.friction * 0.65
          } else if (fragment.bounceSubtle) {
            // 🌀 ESTERNO SOTTILI: PIÙ ATTRITO per 2.5s
            fragment.velocity.x *= fragment.friction * 0.70  // 🎯 PIÙ ATTRITO: 0.70 (era 0.8)
            fragment.velocity.z *= fragment.friction * 0.70
          } else {
            // 🌊 ROTOLANTE: Friction normale
            fragment.velocity.x *= fragment.friction
            fragment.velocity.z *= fragment.friction
          }
          
          fragment.bounces += 1
        } else {
          fragment.onGround = true
          // Solo le particelle rotolanti continuano a rotolare
          fragment.isRolling = !fragment.staysCentral && !fragment.bounceOutward && !fragment.bounceSubtle
          fragment.velocity.y = 0
        }
        
      } else if (fragment.onGround && fragment.isRolling) {
        // Rotolamento - solo per particelle rotolanti normali + DECELERAZIONE CONTINUA
        positions[i * 3 + 1] = FLOOR_Y
        
        const currentSpeed = Math.sqrt(
          fragment.velocity.x * fragment.velocity.x + 
          fragment.velocity.z * fragment.velocity.z
        )
        
        if (currentSpeed > fragment.stoppingThreshold) {
          const speedMultiplier = 0.012 * (fragment.mass * 0.8 + 0.6)
          positions[i * 3] += fragment.velocity.x * speedMultiplier
          positions[i * 3 + 2] += fragment.velocity.z * speedMultiplier
          
          // 🌊 DECELERAZIONE ROTOLAMENTO TARATA 2.5s: Rallenta gradualmente
          const rollingResistance = fragment.rollingSmoothness * 0.995  // 🎯 RESISTENZA TARATA 2.5s
          fragment.velocity.x *= rollingResistance
          fragment.velocity.z *= rollingResistance
        } else {
          fragment.velocity.x = 0
          fragment.velocity.z = 0
          fragment.isRolling = false
        }
      } else if (fragment.onGround && (fragment.staysCentral || fragment.bounceOutward || fragment.bounceSubtle)) {
        // Particelle che hanno finito di rimbalzare si fermano
        positions[i * 3 + 1] = FLOOR_Y
        fragment.velocity.set(0, 0, 0)
      }
    })
    
    sphere.geometry.attributes.position.needsUpdate = true
  }

  // ✨ POLVERE
  const updateDustEffect = () => {
    if (!dustParticlesRef.current) return
    
    const dust = dustParticlesRef.current
    const dustMaterial = dust.material as THREE.PointsMaterial
    const dustPositions = dust.geometry.attributes.position.array as Float32Array
    
    if (dustMaterial.opacity > 0) {
      dustMaterial.opacity -= 0.015
      
      for (let i = 0; i < dustPositions.length; i += 3) {
        dustPositions[i] += (Math.random() - 0.5) * 0.006
        dustPositions[i + 1] += Math.random() * 0.012
        dustPositions[i + 2] += (Math.random() - 0.5) * 0.006
      }
      
      dust.geometry.attributes.position.needsUpdate = true
    }
  }

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      />
    </div>
  )
}
