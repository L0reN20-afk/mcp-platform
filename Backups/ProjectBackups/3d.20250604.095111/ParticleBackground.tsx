'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { gsap } from 'gsap'

// Dynamic import for ScrollTrigger to avoid SSR issues
let ScrollTrigger: any
if (typeof window !== 'undefined') {
  import('gsap/ScrollTrigger').then(({ ScrollTrigger: ST }) => {
    ScrollTrigger = ST
    gsap.registerPlugin(ScrollTrigger)
  })
}

interface ParticleSystem {
  geometry: THREE.BufferGeometry
  material: THREE.PointsMaterial
  points: THREE.Points
  targetPositions: Float32Array
  colors: Float32Array
  currentShape: string
  startTime: number
  currentParticleCount: number
  // 🧬 DNA ENHANCEMENTS
  dnaConnections?: DNAConnections
  dnaGlow?: DNAGlow
}

// 🔗 **DNA CONNECTIONS SYSTEM** - Ponti idrogeno tra eliche
interface DNAConnections {
  lines: THREE.Line[]
  lineMaterials: THREE.LineBasicMaterial[]
  lastUpdateTime: number
  activeConnections: number
  maxConnections: number
}

// 🌟 **DNA GLOW SYSTEM** - Effetto luminoso
interface DNAGlow {
  glowMesh: THREE.Mesh
  glowMaterial: THREE.MeshBasicMaterial
  innerGlow: THREE.Points
  outerGlow: THREE.Points
}

// 🎨 TEXTURE CIRCOLARE per fare cerchi invece di quadratini
function createCircleTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 64
  canvas.height = 64
  const context = canvas.getContext('2d')!
  
  const centerX = canvas.width / 2
  const centerY = canvas.height / 2
  const radius = 28
  
  // Crea gradiente radiale per anti-aliasing
  const gradient = context.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius)
  gradient.addColorStop(0, 'rgba(255, 255, 255, 1)')
  gradient.addColorStop(0.7, 'rgba(255, 255, 255, 1)')
  gradient.addColorStop(1, 'rgba(255, 255, 255, 0)')
  
  context.fillStyle = gradient
  context.fillRect(0, 0, canvas.width, canvas.height)
  
  return new THREE.CanvasTexture(canvas)
}

export default function ParticleBackground() {
  const mountRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const particleSystemRef = useRef<ParticleSystem | null>(null)
  const animationIdRef = useRef<number>()

  useEffect(() => {
    if (!mountRef.current) return

    console.log('🎯 Inizializzazione sistema particelle avanzato con DNA ELICA e Blob sottile...')

    // Scene setup (IDENTICO ALL'ORIGINALE)
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false })
    
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0) // BACKGROUND ORIGINALE TRASPARENTE
    mountRef.current.appendChild(renderer.domElement)

    // CORREZIONE: Forzare stili del canvas per visibilità (IDENTICO ALL'ORIGINALE)
    const canvas = renderer.domElement
    canvas.style.position = 'fixed'
    canvas.style.top = '0'
    canvas.style.left = '0'
    canvas.style.zIndex = '-1'
    canvas.style.pointerEvents = 'none'

    // DIMENSIONI FISSE - più grandi dell'originale per maggiore impatto visivo
    // Niente più calcoli responsive complicati, dimensioni che funzionano bene!
    
    // Camera position - FISSO come originale, più vicino per figure più grandi
    camera.position.z = 45 // Era 50, ora 45 per vedere meglio

    // 🎯 NUMERI OTTIMALI DI PARTICELLE PER OGNI FORMA
    const getOptimalParticleCount = (shape: string) => {
      const baseMultiplier = Math.min(window.devicePixelRatio || 1, 2)
      
      switch(shape) {
        case 'hero': // Sfera - numeri che danno buona distribuzione Fibonacci
          return Math.floor(1800 * baseMultiplier)
        
        case 'features': // Toro - numero che si divide bene in griglia 2D
          const torusGrid = Math.floor(45 * baseMultiplier) // 45x45 = 2025
          return torusGrid * torusGrid
        
        case 'packages': // Cubo - divisibile per 6 facce, griglia quadrata per faccia
          const faceGrid = Math.floor(18 * baseMultiplier) // 18x18 per faccia
          return faceGrid * faceGrid * 6 // 6 facce = 1944 particelle
        
        case 'pricing': // Blob morfante - numero flessibile ma abbondante per dettagli
          return Math.floor(2200 * baseMultiplier)
        
        case 'demo': // 🧬 DNA Doppia Elica - numero ottimale per due spirali
          return Math.floor(1800 * baseMultiplier) // Perfetto per distribuzione elica
        
        default:
          return Math.floor(1800 * baseMultiplier)
      }
    }

    // Inizia con la forma hero (sfera)
    let currentParticleCount = getOptimalParticleCount('hero')

    // Particle system setup (RITORNO AL POINTSMATERIAL ORIGINALE)
    const geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(currentParticleCount * 3)
    const colors = new Float32Array(currentParticleCount * 3)
    const sizes = new Float32Array(currentParticleCount)

    // Initialize particles in sphere formation (DISTRIBUZIONE UNIFORME - MIGLIORAMENTO 2)
    generateUniformSpherePositions(positions, currentParticleCount) // DIMENSIONI FISSE
    generateBlueColors(colors, currentParticleCount)
    generateOriginalSizes(sizes, currentParticleCount) // DIMENSIONI ORIGINALI

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))

    // 🎨 MATERIAL ORIGINALE + TEXTURE CIRCOLARE (MIGLIORAMENTO 1: cerchi)
    const circleTexture = createCircleTexture()
    
    // CORREZIONE CRITICA: devicePixelRatio per dimensioni corrette su retina
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2)
    const adjustedSize = 0.4 * pixelRatio // Moltiplicare per pixelRatio
    
    const material = new THREE.PointsMaterial({
      size: adjustedSize, // DIMENSIONE CORRETTA per tutti i display
      sizeAttenuation: true, // Mantieni true per profondità 3D
      vertexColors: true,
      transparent: true,
      opacity: 0.9, // OPACITY AUMENTATA per maggiore visibilità (era 0.8)
      blending: THREE.AdditiveBlending, // BLENDING ORIGINALE
      map: circleTexture // TEXTURE CIRCOLARE per fare cerchi!
    })

    const points = new THREE.Points(geometry, material)
    scene.add(points)

    const particleSystem: ParticleSystem = {
      geometry,
      material,
      points,
      targetPositions: new Float32Array(currentParticleCount * 3),
      colors: new Float32Array(currentParticleCount * 3),
      currentShape: 'hero',
      startTime: Date.now(),
      currentParticleCount // Aggiungi il conteggio corrente
      // Niente più scale - dimensioni fisse!
    }

    sceneRef.current = scene
    rendererRef.current = renderer
    particleSystemRef.current = particleSystem

    // Animation loop (IDENTICO ALL'ORIGINALE)
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate)
      
      if (particleSystem.points) {
        // Continuous rotation per tutte le forme - LEGGERMENTE AUMENTATA
        particleSystem.points.rotation.y += 0.0015 // Era 0.001, ora più veloce
        particleSystem.points.rotation.x += 0.0008 // Era 0.0005, ora più veloce
        
        // 🌊 MORPHING CONTINUO per la figura dinamica nella sezione PRICING
        if (particleSystem.currentShape === 'pricing') {
          const currentTime = Date.now() - particleSystem.startTime
          const positions = particleSystem.geometry.attributes.position.array as Float32Array
          const count = particleSystem.currentParticleCount // Usa il conteggio corretto
          
          generateMorphingBlobPositions(positions, count, currentTime) // CON NUMERO OTTIMALE
          particleSystem.geometry.attributes.position.needsUpdate = true
        }
        
        // 🧬 ANIMAZIONE CONTINUA per DNA Doppia Elica nella sezione DEMO
        if (particleSystem.currentShape === 'demo') {
          const currentTime = Date.now() - particleSystem.startTime
          const positions = particleSystem.geometry.attributes.position.array as Float32Array
          const count = particleSystem.currentParticleCount
          
          generateDoubleHelixPositions(positions, count, currentTime) // NUOVA FUNZIONE!
          particleSystem.geometry.attributes.position.needsUpdate = true
        }
      }

      renderer.render(scene, camera)
    }
    animate()

    // Scroll-triggered morphing (AGGIORNATO per passare scene)
    setupScrollTriggers(particleSystem, scene)

    // 📱 HANDLE RESIZE CON AGGIORNAMENTO CONTEGGIO PARTICELLE
    const handleResize = () => {
      if (!camera || !renderer || !particleSystem) return
      
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
      
      // CORREZIONE: Mantieni dimensioni particelle fisse per devicePixelRatio
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2)
      const adjustedSize = 0.4 * pixelRatio
      particleSystem.material.size = adjustedSize
      
      // 🎯 RICALCOLA NUMERO OTTIMALE PER LA FORMA CORRENTE
      const getOptimalParticleCount = (shape: string) => {
        const baseMultiplier = Math.min(window.devicePixelRatio || 1, 2)
        
        switch(shape) {
          case 'hero': return Math.floor(1800 * baseMultiplier)
          case 'features': 
            const torusGrid = Math.floor(45 * baseMultiplier)
            return torusGrid * torusGrid
          case 'packages': 
            const faceGrid = Math.floor(18 * baseMultiplier)
            return faceGrid * faceGrid * 6
          case 'pricing': return Math.floor(2200 * baseMultiplier)
          case 'demo': return Math.floor(1800 * baseMultiplier) // DNA
          default: return Math.floor(1800 * baseMultiplier)
        }
      }
      
      const newOptimalCount = getOptimalParticleCount(particleSystem.currentShape)
      
      // Se il numero ottimale è cambiato, ricrea la forma con il nuovo conteggio
      if (newOptimalCount !== particleSystem.currentParticleCount) {
        console.log(`📱 Resize: Aggiornamento particelle ${particleSystem.currentParticleCount} → ${newOptimalCount}`)
        morphToShape(particleSystem, particleSystem.currentShape, scene, true) // skipAnimation = true, passa scene
      }
      
      console.log(`📱 Resize: pixelRatio ${pixelRatio}, particelle: ${particleSystem.currentParticleCount}`)
    }
    window.addEventListener('resize', handleResize)

    console.log('✅ Sistema particelle 3D con DNA ELICA e Blob sottile inizializzato!')

    return () => {
      window.removeEventListener('resize', handleResize)
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current)
      }
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement)
      }
      renderer.dispose()
      geometry.dispose()
      material.dispose()
      circleTexture.dispose()
    }
  }, [])

  return <div ref={mountRef} className="particles-container" style={{
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: -1,
    pointerEvents: 'none'
  }} />
}

// 🌐 DISTRIBUZIONE UNIFORME PER SFERA - Spirale di Fibonacci (MIGLIORAMENTO 2)
function generateUniformSpherePositions(positions: Float32Array, count: number) {
  // DIMENSIONE FISSA leggermente aumentata (era 20, ora 25)
  const radius = 25 // Fisso, più grande dell'originale
  
  for (let i = 0; i < count; i++) {
    // Algoritmo spirale di Fibonacci per distribuzione uniforme
    const y = 1 - (i / (count - 1)) * 2 // da -1 a 1
    const radiusAtY = Math.sqrt(1 - y * y)
    const theta = 2 * Math.PI * i / 1.618033988749 // Golden ratio
    
    const x = Math.cos(theta) * radiusAtY
    const z = Math.sin(theta) * radiusAtY
    
    positions[i * 3] = x * radius
    positions[i * 3 + 1] = y * radius
    positions[i * 3 + 2] = z * radius
  }
}

// 🍩 DISTRIBUZIONE UNIFORME PER TORO (OTTIMIZZATA PER GRIGLIA QUADRATA)
function generateUniformTorusPositions(positions: Float32Array, count: number) {
  // DIMENSIONI FISSE corrette (erano 30/12, ora 28/10)
  const majorRadius = 28 // Era 30, ora 28
  const minorRadius = 10 // Era 12, ora 10
  
  // Calcola la griglia quadrata esatta dal numero di particelle
  const gridSize = Math.floor(Math.sqrt(count))
  const actualCount = gridSize * gridSize // Numero esatto che useremo
  let index = 0
  
  console.log(`🍩 Toro: ${count} particelle richieste, griglia ${gridSize}x${gridSize} = ${actualCount} particelle`)
  
  for (let i = 0; i < gridSize && index < count; i++) {
    for (let j = 0; j < gridSize && index < count; j++) {
      // Parametri u e v distribuiti uniformemente
      const u = (i / gridSize) * 2 * Math.PI // 0 to 2π per il raggio maggiore
      const v = (j / gridSize) * 2 * Math.PI // 0 to 2π per il raggio minore
      
      // Equazioni parametriche del toro
      const x = (majorRadius + minorRadius * Math.cos(v)) * Math.cos(u)
      const y = (majorRadius + minorRadius * Math.cos(v)) * Math.sin(u)
      const z = minorRadius * Math.sin(v)
      
      positions[index * 3] = x
      positions[index * 3 + 1] = y
      positions[index * 3 + 2] = z
      index++
    }
  }
  
  console.log(`🍩 Toro completato con ${index} particelle`)
}

// 📦 DISTRIBUZIONE UNIFORME PER CUBO (OTTIMIZZATA PER NUMERI SPECIFICI)
function generateUniformCubePositions(positions: Float32Array, count: number) {
  // DIMENSIONE FISSA leggermente aumentata (era 28, ora 32)
  const size = 32 // Era 28, ora 32
  
  // Calcola il numero esatto di particelle per faccia
  const particlesPerFace = Math.floor(count / 6)
  const gridSize = Math.ceil(Math.sqrt(particlesPerFace))
  let index = 0
  
  console.log(`📦 Cubo: ${count} particelle totali, ${particlesPerFace} per faccia, griglia ${gridSize}x${gridSize}`)
  
  // 6 facce del cubo con distribuzione perfetta
  const faces = [
    { normal: [0, 0, 1], u: [1, 0, 0], v: [0, 1, 0] },   // Front
    { normal: [0, 0, -1], u: [-1, 0, 0], v: [0, 1, 0] }, // Back
    { normal: [1, 0, 0], u: [0, 0, -1], v: [0, 1, 0] },  // Right
    { normal: [-1, 0, 0], u: [0, 0, 1], v: [0, 1, 0] },  // Left
    { normal: [0, 1, 0], u: [1, 0, 0], v: [0, 0, -1] },  // Top
    { normal: [0, -1, 0], u: [1, 0, 0], v: [0, 0, 1] }   // Bottom
  ]
  
  faces.forEach((face, faceIndex) => {
    let particlesOnThisFace = 0
    const targetParticlesForFace = faceIndex < 5 ? particlesPerFace : count - index // Ultima faccia prende il resto
    
    for (let i = 0; i < gridSize && particlesOnThisFace < targetParticlesForFace && index < count; i++) {
      for (let j = 0; j < gridSize && particlesOnThisFace < targetParticlesForFace && index < count; j++) {
        const u = (i / (gridSize - 1) - 0.5) * size
        const v = (j / (gridSize - 1) - 0.5) * size
        
        const x = face.normal[0] * size/2 + face.u[0] * u + face.v[0] * v
        const y = face.normal[1] * size/2 + face.u[1] * u + face.v[1] * v
        const z = face.normal[2] * size/2 + face.u[2] * u + face.v[2] * v
        
        positions[index * 3] = x
        positions[index * 3 + 1] = y
        positions[index * 3 + 2] = z
        index++
        particlesOnThisFace++
      }
    }
  })
  
  console.log(`📦 Cubo completato con ${index} particelle`)
}

// 🌊 FIGURA DINAMICA MORFANTE - DEFORMAZIONI MOLTO PIÙ SOTTILI! ✨
function generateMorphingBlobPositions(positions: Float32Array, count: number, time: number) {
  const baseRadius = 22 // FISSO - era 23, ora 22 (dimensione finale perfetta)
  
  for (let i = 0; i < count; i++) {
    // Base sferica uniforme (MIGLIORAMENTO 2: distribuzione uniforme)
    const y = 1 - (i / (count - 1)) * 2
    const radiusAtY = Math.sqrt(1 - y * y)
    const theta = 2 * Math.PI * i / 1.618033988749
    
    let x = Math.cos(theta) * radiusAtY * baseRadius
    let yPos = y * baseRadius
    let z = Math.sin(theta) * radiusAtY * baseRadius
    
    // 🌊 DEFORMAZIONI DINAMICHE - MOLTO PIÙ SOTTILI! ✨
    const timeScale = time * 0.0008 // Era 0.001, ora più lento
    
    const wave1 = Math.sin(3 * Math.atan2(yPos, x) + timeScale * 2) * 
                  Math.cos(2 * Math.atan2(z, Math.sqrt(x*x + yPos*yPos)) + timeScale * 1.5)
    
    const wave2 = Math.sin(5 * Math.atan2(z, x) + timeScale * 3) * 
                  Math.cos(4 * Math.atan2(yPos, Math.sqrt(x*x + z*z)) + timeScale * 2.5)
    
    const wave3 = Math.sin(7 * Math.atan2(x, z) + timeScale * 4) * 
                  Math.cos(6 * Math.atan2(yPos, x) + timeScale * 3.5)
    
    // 🎯 DEFORMAZIONI MOLTO PIÙ SOTTILI (era 0.4, 0.2, 0.1 ora 0.2, 0.1, 0.05)
    const morphScale = 1 + 0.2 * wave1 + 0.1 * wave2 + 0.05 * wave3
    
    positions[i * 3] = x * morphScale
    positions[i * 3 + 1] = yPos * morphScale
    positions[i * 3 + 2] = z * morphScale
  }
}

// 🧬 NUOVA! DNA DOPPIA ELICA **TUBOLARE** - Ogni elica è un TUBO! ✨🔥
function generateDoubleHelixPositions(positions: Float32Array, count: number, time: number = 0) {
  const radius = 12        // Raggio base delle eliche
  const height = 50        // Altezza totale della doppia elica  
  const turns = 4          // Numero di giri completi
  const helixSeparation = 3 // 🆕 PIÙ VICINE! Era 6, ora 3
  const tubeRadius = 1.8   // 🆕 RAGGIO del tubo di ogni elica
  
  // 🕰️ ROTAZIONE DINAMICA per animazione fluida
  const timeScale = time * 0.001 // Velocità rotazione
  const rotationOffset = timeScale * Math.PI // Rotazione nel tempo
  
  console.log(`🧬 DNA TUBOLARE: Generando ${count} particelle in tubi (4 fili per elica = 8 fili totali)`)
  
  for (let i = 0; i < count; i++) {
    // 🧬 8 FILI TOTALI: 4 per ogni elica che formano la circonferenza del tubo
    const filamentIndex = i % 8 // 0-7: 8 fili totali
    const isFirstHelix = filamentIndex < 4 // Primi 4 fili = prima elica
    const tubeFilamentIndex = filamentIndex % 4 // 0-3: posizione nella circonferenza del tubo
    
    // Progresso lungo l'altezza dell'elica
    const helixProgress = Math.floor(i / 8) / Math.floor(count / 8) // Distribuzione lungo altezza
    const t = helixProgress * turns * 2 * Math.PI // Parametro per spirale principale
    
    // Altezza lungo l'asse Y
    const y = (helixProgress - 0.5) * height // Da -height/2 a +height/2
    
    // 🎯 POSIZIONE SULLA CIRCONFERENZA DEL TUBO
    // Ogni filo forma la sezione circolare del tubo
    const tubeAngle = (tubeFilamentIndex / 4) * Math.PI * 2 // 0°, 90°, 180°, 270°
    
    if (isFirstHelix) {
      // 🧬 PRIMA ELICA TUBOLARE (senso orario)
      // Calcola il centro della spirale
      const helixCenterX = radius * Math.cos(t + rotationOffset)
      const helixCenterZ = radius * Math.sin(t + rotationOffset) + helixSeparation/2
      
      // Calcola i vettori tangente e normale per orientare il tubo
      const tangentX = -radius * Math.sin(t + rotationOffset) // Vettore tangente X
      const tangentZ = radius * Math.cos(t + rotationOffset)  // Vettore tangente Z
      const tangentY = height / (turns * 2 * Math.PI)        // Vettore tangente Y
      
      // Normalizza il vettore tangente
      const tangentLength = Math.sqrt(tangentX*tangentX + tangentY*tangentY + tangentZ*tangentZ)
      const normTangentX = tangentX / tangentLength
      const normTangentY = tangentY / tangentLength  
      const normTangentZ = tangentZ / tangentLength
      
      // Vettore normale (perpendicolare alla tangente)
      const normalX = Math.cos(t + rotationOffset + Math.PI/2)
      const normalZ = Math.sin(t + rotationOffset + Math.PI/2)
      
      // Vettore binormale (prodotto vettoriale tangente × normale)
      const binormalX = normTangentY * normalZ - normTangentZ * 0
      const binormalY = normTangentZ * normalX - normTangentX * normalZ  
      const binormalZ = normTangentX * 0 - normTangentY * normalX
      
      // Posizione finale sulla circonferenza del tubo
      const tubeOffsetX = tubeRadius * (Math.cos(tubeAngle) * normalX + Math.sin(tubeAngle) * binormalX)
      const tubeOffsetY = tubeRadius * (Math.sin(tubeAngle) * binormalY)
      const tubeOffsetZ = tubeRadius * (Math.cos(tubeAngle) * normalZ + Math.sin(tubeAngle) * binormalZ)
      
      positions[i * 3] = helixCenterX + tubeOffsetX
      positions[i * 3 + 1] = y + tubeOffsetY
      positions[i * 3 + 2] = helixCenterZ + tubeOffsetZ
      
    } else {
      // 🧬 SECONDA ELICA TUBOLARE (senso antiorario + offset π)
      // Calcola il centro della spirale
      const helixCenterX = radius * Math.cos(-t - rotationOffset + Math.PI)
      const helixCenterZ = radius * Math.sin(-t - rotationOffset + Math.PI) - helixSeparation/2
      
      // Calcola i vettori per la seconda elica (senso opposto)
      const tangentX = radius * Math.sin(-t - rotationOffset + Math.PI)
      const tangentZ = -radius * Math.cos(-t - rotationOffset + Math.PI)
      const tangentY = height / (turns * 2 * Math.PI)
      
      // Normalizza il vettore tangente
      const tangentLength = Math.sqrt(tangentX*tangentX + tangentY*tangentY + tangentZ*tangentZ)
      const normTangentX = tangentX / tangentLength
      const normTangentY = tangentY / tangentLength
      const normTangentZ = tangentZ / tangentLength
      
      // Vettore normale
      const normalX = Math.cos(-t - rotationOffset + Math.PI + Math.PI/2)
      const normalZ = Math.sin(-t - rotationOffset + Math.PI + Math.PI/2)
      
      // Vettore binormale
      const binormalX = normTangentY * normalZ - normTangentZ * 0
      const binormalY = normTangentZ * normalX - normTangentX * normalZ
      const binormalZ = normTangentX * 0 - normTangentY * normalX
      
      // Posizione finale sulla circonferenza del tubo
      const tubeOffsetX = tubeRadius * (Math.cos(tubeAngle) * normalX + Math.sin(tubeAngle) * binormalX)
      const tubeOffsetY = tubeRadius * (Math.sin(tubeAngle) * binormalY)
      const tubeOffsetZ = tubeRadius * (Math.cos(tubeAngle) * normalZ + Math.sin(tubeAngle) * binormalZ)
      
      positions[i * 3] = helixCenterX + tubeOffsetX
      positions[i * 3 + 1] = y + tubeOffsetY
      positions[i * 3 + 2] = helixCenterZ + tubeOffsetZ
    }
  }
}

// FUNZIONI COLORI (IDENTICHE ALL'ORIGINALE)
function generateBlueColors(colors: Float32Array, count: number) {
  for (let i = 0; i < count; i++) {
    colors[i * 3] = 0.2 + Math.random() * 0.3     // R
    colors[i * 3 + 1] = 0.5 + Math.random() * 0.3 // G
    colors[i * 3 + 2] = 0.8 + Math.random() * 0.2 // B
  }
}

function generatePurpleColors(colors: Float32Array, count: number) {
  for (let i = 0; i < count; i++) {
    colors[i * 3] = 0.6 + Math.random() * 0.3     // R
    colors[i * 3 + 1] = 0.2 + Math.random() * 0.3 // G
    colors[i * 3 + 2] = 0.8 + Math.random() * 0.2 // B
  }
}

function generateCyanColors(colors: Float32Array, count: number) {
  for (let i = 0; i < count; i++) {
    colors[i * 3] = 0.1 + Math.random() * 0.2     // R
    colors[i * 3 + 1] = 0.7 + Math.random() * 0.3 // G
    colors[i * 3 + 2] = 0.8 + Math.random() * 0.2 // B
  }
}

function generateGreenColors(colors: Float32Array, count: number) {
  for (let i = 0; i < count; i++) {
    colors[i * 3] = 0.1 + Math.random() * 0.3     // R
    colors[i * 3 + 1] = 0.7 + Math.random() * 0.3 // G
    colors[i * 3 + 2] = 0.2 + Math.random() * 0.3 // B
  }
}

// 🧬 NUOVA! Colori DNA (verde-blu bio-tech)
function generateDNAColors(colors: Float32Array, count: number) {
  for (let i = 0; i < count; i++) {
    // Alterna tra due colori per le due eliche
    const isFirstHelix = i % 2 === 0
    
    if (isFirstHelix) {
      // Prima elica: Verde bio
      colors[i * 3] = 0.1 + Math.random() * 0.2     // R (poco rosso)
      colors[i * 3 + 1] = 0.8 + Math.random() * 0.2 // G (molto verde)
      colors[i * 3 + 2] = 0.3 + Math.random() * 0.2 // B (medio blu)
    } else {
      // Seconda elica: Blu tech
      colors[i * 3] = 0.1 + Math.random() * 0.2     // R (poco rosso)
      colors[i * 3 + 1] = 0.4 + Math.random() * 0.3 // G (medio verde)
      colors[i * 3 + 2] = 0.9 + Math.random() * 0.1 // B (molto blu)
    }
  }
}

function generateOrangeColors(colors: Float32Array, count: number) {
  for (let i = 0; i < count; i++) {
    colors[i * 3] = 0.9 + Math.random() * 0.1     // R
    colors[i * 3 + 1] = 0.5 + Math.random() * 0.3 // G
    colors[i * 3 + 2] = 0.1 + Math.random() * 0.2 // B
  }
}

// 🌈 COLORI ARCOBALENO per la figura morfante (IDENTICI ALL'ORIGINALE)
function generateRainbowColors(colors: Float32Array, count: number) {
  for (let i = 0; i < count; i++) {
    const hue = (i / count) * 6.28
    const saturation = 0.8 + Math.random() * 0.2
    const value = 0.9 + Math.random() * 0.1
    
    const h = (hue * 180 / Math.PI) / 60
    const c = value * saturation
    const x = c * (1 - Math.abs((h % 2) - 1))
    const m = value - c
    
    let r = 0, g = 0, b = 0
    
    if (h >= 0 && h < 1) { r = c; g = x; b = 0 }
    else if (h >= 1 && h < 2) { r = x; g = c; b = 0 }
    else if (h >= 2 && h < 3) { r = 0; g = c; b = x }
    else if (h >= 3 && h < 4) { r = 0; g = x; b = c }
    else if (h >= 4 && h < 5) { r = x; g = 0; b = c }
    else if (h >= 5 && h < 6) { r = c; g = 0; b = x }
    
    colors[i * 3] = r + m      // R
    colors[i * 3 + 1] = g + m  // G  
    colors[i * 3 + 2] = b + m  // B
  }
}

// DIMENSIONI ORIGINALI (leggermente casuali come nell'originale)
function generateOriginalSizes(sizes: Float32Array, count: number) {
  for (let i = 0; i < count; i++) {
    sizes[i] = 0.5 + Math.random() * 1.5 // IDENTICO ALL'ORIGINALE
  }
}

// Scroll triggers setup (AGGIORNATO per passare scene)
function setupScrollTriggers(particleSystem: ParticleSystem, scene: THREE.Scene) {
  if (typeof window === 'undefined') return
  
  const initScrollTriggers = () => {
    if (!ScrollTrigger) {
      setTimeout(initScrollTriggers, 100)
      return
    }
    
    console.log('🎬 Inizializzazione ScrollTriggers per morphing...')
    
    const sections = ['hero', 'features', 'packages', 'pricing', 'demo']
    
    sections.forEach((section, index) => {
      ScrollTrigger.create({
        trigger: `#${section}`,
        start: "top center",
        end: "bottom center",
        onEnter: () => {
          console.log(`🔄 Morphing to ${section}`)
          morphToShape(particleSystem, section, scene)
        },
        onEnterBack: () => {
          console.log(`🔄 Morphing back to ${section}`)
          morphToShape(particleSystem, section, scene)
        }
      })
    })
  }
  
  initScrollTriggers()
}

// Morphing function (AGGIORNATO per includere DNA)
function morphToShape(particleSystem: ParticleSystem, shape: string, scene: THREE.Scene, skipAnimation: boolean = false) {
  if (particleSystem.currentShape === shape && !skipAnimation) return
  
  console.log(`✨ Morphing da ${particleSystem.currentShape} a ${shape}`)
  
  // 🎯 CALCOLA NUMERO OTTIMALE PER QUESTA FORMA
  const getOptimalParticleCount = (targetShape: string) => {
    const baseMultiplier = Math.min(window.devicePixelRatio || 1, 2)
    
    switch(targetShape) {
      case 'hero': // Sfera - numeri che danno buona distribuzione Fibonacci
        return Math.floor(1800 * baseMultiplier)
      
      case 'features': // Toro - numero che si divide bene in griglia 2D
        const torusGrid = Math.floor(45 * baseMultiplier) // 45x45 = 2025
        return torusGrid * torusGrid
      
      case 'packages': // Cubo - divisibile per 6 facce, griglia quadrata per faccia
        const faceGrid = Math.floor(18 * baseMultiplier) // 18x18 per faccia
        return faceGrid * faceGrid * 6 // 6 facce = 1944 particelle
      
      case 'pricing': // Blob morfante - numero flessibile ma abbondante per dettagli
        return Math.floor(2200 * baseMultiplier)
      
      case 'demo': // 🧬 DNA Doppia Elica - numero ottimale per distribuzione
        return Math.floor(1800 * baseMultiplier)
      
      default:
        return Math.floor(1800 * baseMultiplier)
    }
  }
  
  const optimalCount = getOptimalParticleCount(shape)
  console.log(`🔢 Forma ${shape}: ${optimalCount} particelle ottimali`)
  
  // 🔄 RICREA GEOMETRIA SE SERVE UN NUMERO DIVERSO
  let positions: Float32Array
  let colors: Float32Array
  
  if (optimalCount !== particleSystem.currentParticleCount) {
    console.log(`🔄 Ricreando geometria: ${particleSystem.currentParticleCount} → ${optimalCount}`)
    
    // 🎨 SALVA I COLORI CORRENTI prima di ricreare la geometria
    const currentColors = particleSystem.geometry.attributes.color.array as Float32Array
    
    // Ricrea geometria con nuovo numero di particelle  
    const oldPoints = particleSystem.points
    const oldGeometry = particleSystem.geometry
    
    // Crea nuova geometria
    const newGeometry = new THREE.BufferGeometry()
    const newPositions = new Float32Array(optimalCount * 3)
    const newColors = new Float32Array(optimalCount * 3)
    const newSizes = new Float32Array(optimalCount)
    
    // 🎨 INIZIALIZZA I NUOVI COLORI con i colori correnti (non lasciarli neri!)
    // Prendi la forma corrente e genera i suoi colori
    switch(particleSystem.currentShape) {
      case 'hero':
        generateBlueColors(newColors, optimalCount)
        break
      case 'features':
        generatePurpleColors(newColors, optimalCount)
        break
      case 'packages':
        generateCyanColors(newColors, optimalCount)
        break
      case 'pricing':
        generateRainbowColors(newColors, optimalCount)
        break
      case 'demo':
        generateDNAColors(newColors, optimalCount)
        break
      default:
        generateBlueColors(newColors, optimalCount)
    }
    
    console.log(`🎨 Colori inizializzati per forma corrente: ${particleSystem.currentShape}`)
    
    // Genera dimensioni e posizioni per le nuove particelle
    generateOriginalSizes(newSizes, optimalCount)
    
    // Inizializza posizioni con la forma corrente
    switch(particleSystem.currentShape) {
      case 'hero':
        generateUniformSpherePositions(newPositions, optimalCount)
        break
      case 'features':
        generateUniformTorusPositions(newPositions, optimalCount)
        break
      case 'packages':
        generateUniformCubePositions(newPositions, optimalCount)
        break
      case 'pricing':
        generateMorphingBlobPositions(newPositions, optimalCount, 0)
        break
      case 'demo':
        generateDoubleHelixPositions(newPositions, optimalCount, 0)
        break
      default:
        generateUniformSpherePositions(newPositions, optimalCount)
    }
    
    // Aggiorna attributi con colori CORRETTI
    newGeometry.setAttribute('position', new THREE.BufferAttribute(newPositions, 3))
    newGeometry.setAttribute('color', new THREE.BufferAttribute(newColors, 3))
    newGeometry.setAttribute('size', new THREE.BufferAttribute(newSizes, 1))
    
    // Crea nuovo oggetto Points
    const newPoints = new THREE.Points(newGeometry, particleSystem.material)
    newPoints.rotation.copy(oldPoints.rotation) // Mantieni rotazione
    newPoints.scale.copy(oldPoints.scale) // Mantieni scala
    
    // Sostituisci nella scena (CORREZIONE: usa il parametro scene)
    scene.remove(oldPoints)
    scene.add(newPoints)
    
    // Aggiorna riferimenti nel sistema
    particleSystem.geometry = newGeometry
    particleSystem.points = newPoints
    particleSystem.targetPositions = new Float32Array(optimalCount * 3)
    particleSystem.colors = new Float32Array(optimalCount * 3)
    particleSystem.currentParticleCount = optimalCount
    
    // Cleanup vecchia geometria
    oldGeometry.dispose()
    
    positions = newPositions
    colors = newColors
    
    console.log(`✅ Geometria ricreata con ${optimalCount} particelle e colori corretti!`)
  } else {
    // Usa geometria esistente
    positions = particleSystem.geometry.attributes.position.array as Float32Array
    colors = particleSystem.geometry.attributes.color.array as Float32Array
  }

  const count = particleSystem.currentParticleCount

  // Generate new target positions and colors (CON NUMERI OTTIMALI)
  switch(shape) {
    case 'hero':
      generateUniformSpherePositions(particleSystem.targetPositions, count)
      generateBlueColors(particleSystem.colors, count)
      break
    case 'features':
      generateUniformTorusPositions(particleSystem.targetPositions, count)
      generatePurpleColors(particleSystem.colors, count)
      break
    case 'packages':
      generateUniformCubePositions(particleSystem.targetPositions, count)
      generateCyanColors(particleSystem.colors, count)
      break
    case 'pricing':
      generateMorphingBlobPositions(particleSystem.targetPositions, count, 0)
      generateRainbowColors(particleSystem.colors, count)
      particleSystem.startTime = Date.now()
      break
    case 'demo':
      generateDoubleHelixPositions(particleSystem.targetPositions, count, 0)
      generateDNAColors(particleSystem.colors, count) // 🧬 NUOVI COLORI DNA!
      particleSystem.startTime = Date.now()
      break
  }
  
  if (skipAnimation) {
    // Update immediato senza animazione (per resize)
    for (let i = 0; i < positions.length; i++) {
      positions[i] = particleSystem.targetPositions[i]
    }
    for (let i = 0; i < colors.length; i++) {
      colors[i] = particleSystem.colors[i]
    }
    
    particleSystem.geometry.attributes.position.needsUpdate = true
    particleSystem.geometry.attributes.color.needsUpdate = true
    particleSystem.currentShape = shape
    return
  }
  
  // 🚀🚀🚀 ESPLOSIONE RAPIDA E CONTROLLATA! - Durata ottimizzata a 4.0s
  
  console.log(`💥 INIZIANDO ESPLOSIONE RAPIDA per ${shape}!`)
  
  // 🎨 SALVA I COLORI ORIGINALI per mantenerli durante l'esplosione
  const originalColors = new Float32Array(colors)
  
  // 💡 AUMENTA TEMPORANEAMENTE LA LUMINOSITÀ durante l'esplosione
  gsap.to(particleSystem.material, {
    opacity: 1.0, // Aumenta opacità da 0.9 a 1.0 durante esplosione
    duration: 0.9, // Ridotto da 1.2s a 0.9s (-0.3s)
    ease: "power2.out"
  })
  
  // Fase 1: ESPLOSIONE RAPIDA - Le particelle esplodono verso l'esterno
  gsap.to(particleSystem.points.scale, {
    x: 4.0,  // Mantieni scala drammatica
    y: 4.0,
    z: 4.0,
    duration: 0.9, // Ridotto da 1.2s a 0.9s (-0.3s)
    ease: "power3.out",
    onStart: () => console.log('🚀 ESPLOSIONE INIZIATA!'),
    onComplete: () => console.log('💥 ESPLOSIONE COMPLETATA!')
  })
  
  // Fase 2: ROTAZIONE CONTROLLATA durante l'esplosione
  gsap.to(particleSystem.points.rotation, {
    x: particleSystem.points.rotation.x + Math.PI * 2, // Mantieni 2 giri
    y: particleSystem.points.rotation.y + Math.PI * 3, // Mantieni 3 giri  
    z: particleSystem.points.rotation.z + Math.PI * 1, // Mantieni 1 giro
    duration: 1.5, // Ridotto da 2.0s a 1.5s (-0.5s)
    ease: "power2.inOut"
  })
  
  // Fase 2.5: SHAKE VELOCE durante l'esplosione
  gsap.to(particleSystem.points.position, {
    x: "+=0.3", 
    y: "+=0.2", 
    z: "+=0.25",
    duration: 0.1, // Mantieni velocità shake
    repeat: 6, // Ridotto da 8 a 6 ripetizioni
    yoyo: true,
    ease: "power2.inOut"
  })
  
  // Fase 3: DISPERSIONE CASUALE CONTROLLATA
  const originalPositions = [...positions] // Salva posizioni originali
  
  // Aggiungi dispersione casuale controllata
  for (let i = 0; i < positions.length; i += 3) {
    const explosionStrength = 25 // Mantieni 25 per dispersione controllata
    positions[i] += (Math.random() - 0.5) * explosionStrength     
    positions[i + 1] += (Math.random() - 0.5) * explosionStrength   
    positions[i + 2] += (Math.random() - 0.5) * explosionStrength 
  }
  particleSystem.geometry.attributes.position.needsUpdate = true
  
  console.log('🌪️ DISPERSIONE RAPIDA APPLICATA!')
  
  // Fase 4: PAUSA BREVE e poi RICOMPOSIZIONE nella nuova forma
  gsap.delayedCall(0.6, () => { // Ridotto da 1.1s a 0.6s (-0.5s) 
    console.log(`🎨 INIZIANDO RICOMPOSIZIONE in ${shape}...`)
    
    // 📍 AGGIORNA SOLO LE POSIZIONI (non i colori ancora!)
    for (let i = 0; i < positions.length; i++) {
      positions[i] = particleSystem.targetPositions[i]
    }
    particleSystem.geometry.attributes.position.needsUpdate = true
    
    // Fase 5: RICOMPOSIZIONE FLUIDA - ritorno alla scala normale
    gsap.to(particleSystem.points.scale, {
      x: 1,
      y: 1, 
      z: 1,
      duration: 1.8, // Ridotto da 2.0s a 1.8s (-0.2s) ma mantieni fluidità
      ease: "elastic.out(1, 0.4)",
      onComplete: () => {
        console.log(`✅ RICOMPOSIZIONE COMPLETATA! Ora in forma: ${shape}`)
        // Reset posizione dopo shake
        gsap.set(particleSystem.points.position, { x: 0, y: 0, z: 0 })
      }
    })
    
    // 🎨 TRANSIZIONE GRADUALE DEI COLORI durante la ricomposizione
    gsap.to({}, {
      duration: 1.8, // Ridotto da 2.0s a 1.8s per sincronizzare
      ease: "power2.inOut",
      onUpdate: function() {
        const progress = this.progress()
        // Interpola gradualmente dai colori originali ai nuovi colori
        for (let i = 0; i < colors.length; i++) {
          colors[i] = originalColors[i] + (particleSystem.colors[i] - originalColors[i]) * progress
        }
        particleSystem.geometry.attributes.color.needsUpdate = true
      },
      onComplete: () => {
        // Assicurati che i colori finali siano corretti
        for (let i = 0; i < colors.length; i++) {
          colors[i] = particleSystem.colors[i]
        }
        particleSystem.geometry.attributes.color.needsUpdate = true
        console.log(`🌈 TRANSIZIONE COLORI COMPLETATA per ${shape}!`)
      }
    })
    
    // 💡 RITORNA OPACITÀ NORMALE
    gsap.to(particleSystem.material, {
      opacity: 0.9, // Ritorna all'opacità normale
      duration: 1.8, // Sincronizzato con ricomposizione
      ease: "power2.inOut"
    })
  })
  
  particleSystem.currentShape = shape
}
