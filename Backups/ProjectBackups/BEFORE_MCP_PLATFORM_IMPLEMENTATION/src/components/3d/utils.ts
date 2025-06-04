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

// 🎯 CALCOLO NUMERO OTTIMALE DI PARTICELLE
export function getOptimalParticleCount(shape: string): number {
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

// 🔧 CREAZIONE MATERIALE PARTICELLE
export function createParticleMaterial(circleTexture: THREE.CanvasTexture): THREE.PointsMaterial {
  // Correzione critica: devicePixelRatio per dimensioni corrette su retina
  const pixelRatio = Math.min(window.devicePixelRatio || 1, 2)
  const adjustedSize = MATERIAL_CONFIG.baseSize * pixelRatio
  
  return new THREE.PointsMaterial({
    size: adjustedSize,
    sizeAttenuation: MATERIAL_CONFIG.sizeAttenuation,
    vertexColors: true,
    transparent: MATERIAL_CONFIG.transparent,
    opacity: MATERIAL_CONFIG.opacity,
    blending: THREE.AdditiveBlending,
    map: circleTexture
  })
}

// 📱 DETECTION PERFORMANCE DISPOSITIVO
export function detectDevicePerformance(): {
  isHighPerformance: boolean
  pixelRatio: number
  memoryGb: number | null
  cores: number
} {
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

// 🎮 SETUP CAMERA
export function setupCamera(): THREE.PerspectiveCamera {
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
  camera.position.z = 45 // Posizione ottimale per vedere le forme
  return camera
}

// 🖥️ SETUP RENDERER
export function setupRenderer(): THREE.WebGLRenderer {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false })
  
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setClearColor(0x000000, 0) // Background trasparente
  
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

// 📊 RESIZE HANDLER
export function handleResize(
  camera: THREE.PerspectiveCamera, 
  renderer: THREE.WebGLRenderer, 
  material: THREE.PointsMaterial
) {
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
