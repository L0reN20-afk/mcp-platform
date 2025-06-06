import * as THREE from 'three'
import { OPTIMAL_PARTICLE_COUNTS, MATERIAL_CONFIG, QUALITY_THRESHOLDS } from './constants'

// 🛠️ UTILITY E HELPERS DEL SISTEMA PARTICELLARE

// 🎨 TEXTURE CIRCOLARE per fare cerchi invece di quadratini
export function createCircleTexture(): THREE.CanvasTexture {
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

// 🖥️ DETECTION SISTEMA OPERATIVO per correzioni colore (SSR Safe)
export function isWindowsOS(): boolean {
  // 🔒 SSR Safety Check
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return false // Assume non-Windows su server
  }
  
  // Detection multipla per massima accuratezza
  const platform = navigator.platform?.toLowerCase() || ''
  const userAgent = navigator.userAgent?.toLowerCase() || ''
  
  return (
    platform.includes('win') ||
    userAgent.includes('windows') ||
    userAgent.includes('win32') ||
    userAgent.includes('win64')
  )
}

// 🎨 CORREZIONE SATURAZIONE COLORE per Windows
export function getColorSaturationBoost(): number {
  return isWindowsOS() ? 1.25 : 1.0 // +25% saturazione su Windows
}

// 🌈 CORREZIONE LUMINOSITÀ per Windows  
export function getColorBrightnessBoost(): number {
  return isWindowsOS() ? 1.15 : 1.0 // +15% luminosità su Windows
}

// 🎯 CALCOLO NUMERO OTTIMALE DI PARTICELLE (SSR Safe)
export function getOptimalParticleCount(shape: string): number {
  // 🔒 SSR Safety Check
  if (typeof window === 'undefined') {
    return OPTIMAL_PARTICLE_COUNTS.hero // Fallback sicuro per server
  }
  
  const baseMultiplier = Math.min(window.devicePixelRatio || 1, 2)
  
  switch(shape) {
    case 'hero': // Sfera - numeri che danno buona distribuzione Fibonacci
      return Math.floor(OPTIMAL_PARTICLE_COUNTS.hero * baseMultiplier)
    
    case 'features': // Toro - numero che si divide bene in griglia 2D
      const torusGrid = Math.floor(45 * baseMultiplier) // 45x45 = 2025
      return torusGrid * torusGrid
    
    case 'packages': // Cubo - divisibile per 6 facce, griglia quadrata per faccia
      const faceGrid = Math.floor(18 * baseMultiplier) // 18x18 per faccia
      return faceGrid * faceGrid * 6 // 6 facce = 1944 particelle
    
    case 'pricing': // Blob morfante - numero flessibile ma abbondante per dettagli
      return Math.floor(OPTIMAL_PARTICLE_COUNTS.pricing * baseMultiplier)
    
    case 'demo': // DNA Doppia Elica - numero ottimale per due spirali
      return Math.floor(OPTIMAL_PARTICLE_COUNTS.demo * baseMultiplier)
    
    default:
      return Math.floor(OPTIMAL_PARTICLE_COUNTS.hero * baseMultiplier)
  }
}

// 📐 GENERATORE DI DIMENSIONI ORIGINALI
export function generateOriginalSizes(sizes: Float32Array, count: number) {
  for (let i = 0; i < count; i++) {
    sizes[i] = 0.5 + Math.random() * 1.5 // Dimensioni casuali
  }
}

// 🔧 CREAZIONE MATERIALE PARTICELLE (SSR Safe) - con correzione Windows
export function createParticleMaterial(circleTexture: THREE.CanvasTexture): THREE.PointsMaterial {
  // 🔒 SSR Safety Check
  const pixelRatio = typeof window !== 'undefined' 
    ? Math.min(window.devicePixelRatio || 1, 2)
    : 1 // Fallback per server
  
  const adjustedSize = MATERIAL_CONFIG.baseSize * pixelRatio
  
  // 🖥️ Correzione opacità per Windows
  const windowsOpacityBoost = isWindowsOS() ? 1.0 : MATERIAL_CONFIG.opacity // Opacità massima su Windows
  
  return new THREE.PointsMaterial({
    size: adjustedSize,
    sizeAttenuation: MATERIAL_CONFIG.sizeAttenuation,
    vertexColors: true,
    transparent: MATERIAL_CONFIG.transparent,
    opacity: windowsOpacityBoost,
    blending: THREE.AdditiveBlending,
    map: circleTexture
  })
}

// 📱 DETECTION PERFORMANCE DISPOSITIVO (SSR Safe)
export function detectDevicePerformance(): {
  isHighPerformance: boolean
  pixelRatio: number
  memoryGb: number | null
  cores: number
} {
  // 🔒 SSR Safety Check
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return {
      isHighPerformance: true, // Assume high performance on server
      pixelRatio: 1,
      memoryGb: null,
      cores: 1
    }
  }

  const canvas = document.createElement('canvas')
  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
  
  if (!gl) {
    return {
      isHighPerformance: false,
      pixelRatio: 1,
      memoryGb: null,
      cores: 1
    }
  }

  // Check device specs
  const memory = (navigator as any).deviceMemory || null
  const cores = navigator.hardwareConcurrency || 1
  const pixelRatio = window.devicePixelRatio || 1
  
  // Performance thresholds
  const { lowEnd } = QUALITY_THRESHOLDS
  const isLowEnd = (memory && memory < lowEnd.memory) || 
                   cores < lowEnd.cores || 
                   pixelRatio > lowEnd.pixelRatio
  
  return {
    isHighPerformance: !isLowEnd,
    pixelRatio,
    memoryGb: memory,
    cores
  }
}

// 🎮 SETUP CAMERA (SSR Safe)
export function setupCamera(): THREE.PerspectiveCamera {
  // 🔒 SSR Safety Check - Default dimensions se window non disponibile
  const width = typeof window !== 'undefined' ? window.innerWidth : 1920
  const height = typeof window !== 'undefined' ? window.innerHeight : 1080
  
  const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
  camera.position.z = 45 // Posizione ottimale per vedere le forme
  return camera
}

// 🖥️ SETUP RENDERER (SSR Safe)
export function setupRenderer(): THREE.WebGLRenderer {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  
  // 🔒 SSR Safety Check
  if (typeof window !== 'undefined') {
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    
    // 🎨 BACKGROUND DINAMICO in base al tema del sistema
    const isLightTheme = window.matchMedia('(prefers-color-scheme: light)').matches
    if (isLightTheme) {
      // Tema chiaro → Background opaco nero per contrasto
      renderer.setClearColor(0x000000, 1)
    } else {
      // Tema scuro → Background trasparente per mostrare particelle
      renderer.setClearColor(0x000000, 0)
    }
  } else {
    renderer.setSize(1920, 1080) // Fallback dimensions
    renderer.setPixelRatio(1)
    renderer.setClearColor(0x000000, 0) // Default trasparente
  }
  
  return renderer
}

// 🎨 SETUP CANVAS STYLES
export function setupCanvasStyles(canvas: HTMLCanvasElement) {
  canvas.style.position = 'fixed'
  canvas.style.top = '0'
  canvas.style.left = '0'
  canvas.style.zIndex = '-1'
  canvas.style.pointerEvents = 'none'
}

// 📊 RESIZE HANDLER (SSR Safe)
export function handleResize(
  camera: THREE.PerspectiveCamera, 
  renderer: THREE.WebGLRenderer, 
  material: THREE.PointsMaterial
) {
  // 🔒 SSR Safety Check
  if (typeof window === 'undefined') return
  
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
  
  // Mantieni dimensioni particelle fisse per devicePixelRatio
  const pixelRatio = Math.min(window.devicePixelRatio || 1, 2)
  const adjustedSize = MATERIAL_CONFIG.baseSize * pixelRatio
  material.size = adjustedSize
}

// 🧹 CLEANUP RESOURCES
export function cleanupResources(
  renderer: THREE.WebGLRenderer,
  geometry: THREE.BufferGeometry,
  material: THREE.PointsMaterial,
  texture: THREE.CanvasTexture
) {
  renderer.dispose()
  geometry.dispose()
  material.dispose()
  texture.dispose()
}

// 📱 MOBILE DEVICE DETECTION - Rilevamento intelligente dispositivi mobili (SSR Safe)
export function isMobileDevice(): boolean {
  // 🔒 SSR Safety Check - Se siamo lato server, ritorna false
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return false
  }
  
  // Check viewport width (primary indicator)
  const isMobileViewport = window.innerWidth <= 768
  
  // Check user agent (secondary confirmation)
  const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera
  const isMobileUA = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile/i.test(userAgent)
  
  // Check touch capability
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0
  
  // Combined detection
  return isMobileViewport || (isMobileUA && isTouchDevice)
}

// 🎯 CALCOLO PARTICELLE CON OTTIMIZZAZIONI MOBILE (SSR Safe) - STESSO NUMERO, SOLO OTTIMIZZAZIONI RENDERING
export function getOptimalParticleCountWithMobile(shape: string): number {
  // 🖥️📱 STESSO NUMERO DI PARTICELLE per desktop e mobile
  // Solo le ottimizzazioni di rendering cambiano (materiale, colori, etc.)
  return getOptimalParticleCount(shape)
}

// 🖥️ SETUP RENDERER CON FALLBACK MOBILE (SSR Safe)
export function setupRendererWithMobileFallback(): THREE.WebGLRenderer {
  const isMobile = isMobileDevice()
  
  // 🖥️ DESKTOP: Renderer con background dinamico
  if (!isMobile) {
    return setupRenderer()
  }
  
  // 📱 MOBILE: Ottimizzazioni specifiche + background dinamico
  const renderer = new THREE.WebGLRenderer({ 
    antialias: false,  // Disabilita antialiasing per performance
    alpha: true,       // Abilita trasparenza
    powerPreference: 'low-power'  // Ottimizzazione batteria
  })
  
  // 🔒 SSR Safety Check
  if (typeof window !== 'undefined') {
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(1) // Forza pixel ratio 1 su mobile
    
    // 🎨 BACKGROUND DINAMICO in base al tema del sistema (mobile)
    const isLightTheme = window.matchMedia('(prefers-color-scheme: light)').matches
    if (isLightTheme) {
      // Tema chiaro → Background opaco nero per contrasto
      renderer.setClearColor(0x000000, 1)
    } else {
      // Tema scuro → Background trasparente per mostrare particelle
      renderer.setClearColor(0x000000, 0)
    }
  } else {
    renderer.setSize(1920, 1080) // Fallback dimensions
    renderer.setPixelRatio(1)
    renderer.setClearColor(0x000000, 0) // Default trasparente
  }
  
  return renderer
}

// 🎨 MATERIALE PARTICELLE CON OTTIMIZZAZIONI MOBILE (SSR Safe) - con correzione Windows
export function createParticleMaterialWithMobileOptimizations(circleTexture: THREE.CanvasTexture): THREE.PointsMaterial {
  const isMobile = isMobileDevice()
  
  // 🖥️ DESKTOP: Materiale identico a prima con correzione Windows
  if (!isMobile) {
    return createParticleMaterial(circleTexture)
  }
  
  // 📱 MOBILE: Ottimizzazioni specifiche con correzione Windows
  const windowsOpacityBoost = isWindowsOS() ? 0.95 : 0.85 // Opacità equilibrata mobile Windows
  
  return new THREE.PointsMaterial({
    size: MATERIAL_CONFIG.baseSize * 1.1, // Particelle leggermente più grandi per visibilità
    sizeAttenuation: MATERIAL_CONFIG.sizeAttenuation,
    vertexColors: true,
    transparent: MATERIAL_CONFIG.transparent,
    opacity: windowsOpacityBoost,
    blending: THREE.AdditiveBlending,
    map: circleTexture
  })
}

// 📊 RESIZE HANDLER CON SUPPORTO MOBILE (SSR Safe)
export function handleResizeWithMobile(
  camera: THREE.PerspectiveCamera, 
  renderer: THREE.WebGLRenderer, 
  material: THREE.PointsMaterial
) {
  // 🔒 SSR Safety Check
  if (typeof window === 'undefined') return
  
  const isMobile = isMobileDevice()
  
  // 🖥️ DESKTOP: Resize identico a prima
  if (!isMobile) {
    return handleResize(camera, renderer, material)
  }
  
  // 📱 MOBILE: Resize ottimizzato
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
  
  // Mantieni pixel ratio fisso a 1 su mobile
  renderer.setPixelRatio(1)
  material.size = MATERIAL_CONFIG.baseSize * 1.1
}