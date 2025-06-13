import * as THREE from 'three'
import { OPTIMAL_PARTICLE_COUNTS, MATERIAL_CONFIG } from './constants'

// 🛠️ UTILITY E HELPERS DEL SISTEMA PARTICELLARE

// 🎨 TEXTURE CIRCOLARE PERFETTA - SENZA QUADRATO NERO
export function createCircleTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = 128
  canvas.height = 128
  const context = canvas.getContext('2d')!
  
  // 🧹 PULISCE COMPLETAMENTE IL CANVAS (trasparente totale)
  context.clearRect(0, 0, canvas.width, canvas.height)
  
  const centerX = canvas.width / 2
  const centerY = canvas.height / 2
  const radius = 64  // ← AUMENTATO: Copre TUTTO il canvas (era 60)
  
  // 🌟 GRADIENTE RADIALE PERFETTO - Dal centro fino ai bordi
  const gradient = context.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius)
  gradient.addColorStop(0, 'rgba(255, 255, 255, 1.0)')      // Centro: Bianco opaco
  gradient.addColorStop(0.6, 'rgba(255, 255, 255, 1.0)')    // 60%: Ancora opaco
  gradient.addColorStop(0.85, 'rgba(255, 255, 255, 0.6)')   // 85%: Inizia fade
  gradient.addColorStop(0.95, 'rgba(255, 255, 255, 0.1)')   // 95%: Quasi trasparente
  gradient.addColorStop(1.0, 'rgba(255, 255, 255, 0.0)')    // 100%: Trasparente totale
  
  context.fillStyle = gradient
  context.beginPath()
  context.arc(centerX, centerY, radius, 0, Math.PI * 2)
  context.fill()
  
  const texture = new THREE.CanvasTexture(canvas)
  
  // ✨ FILTRI TEXTURE per anti-aliasing perfetto
  texture.minFilter = THREE.LinearFilter
  texture.magFilter = THREE.LinearFilter
  texture.wrapS = THREE.ClampToEdgeWrapping
  texture.wrapT = THREE.ClampToEdgeWrapping
  
  texture.needsUpdate = true
  
  return texture
}

// 🖥️ DETECTION SISTEMA OPERATIVO per correzioni colore (SSR Safe)
export function isWindowsOS(): boolean {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return false
  }
  
  const platform = navigator.platform?.toLowerCase() || ''
  const userAgent = navigator.userAgent?.toLowerCase() || ''
  
  return (
    platform.includes('win') ||
    userAgent.includes('windows') ||
    userAgent.includes('win32') ||
    userAgent.includes('win64')
  )
}

// 🎨 CORREZIONE VIVIDEZZA COLORE per Windows (+15%)
export function getColorVividnessBoost(): number {
  return isWindowsOS() ? 1.15 : 1.0
}

// 🎨 CORREZIONE SATURAZIONE COLORE per Windows (+15%)
export function getColorSaturationBoost(): number {
  return isWindowsOS() ? 1.15 : 1.0
}

// 🌈 CORREZIONE LUMINOSITÀ per Windows
export function getColorBrightnessBoost(): number {
  return 1.0
}

// 🎯 CALCOLO NUMERO OTTIMALE DI PARTICELLE - VALORI FISSI (SSR Safe)
export function getOptimalParticleCount(shape: string): number {
  if (typeof window === 'undefined') {
    return OPTIMAL_PARTICLE_COUNTS.hero
  }
  
  switch(shape) {
    case 'hero':
      return OPTIMAL_PARTICLE_COUNTS.hero
    case 'features':
      return OPTIMAL_PARTICLE_COUNTS.features
    case 'packages':
      return OPTIMAL_PARTICLE_COUNTS.packages
    case 'pricing':
      return OPTIMAL_PARTICLE_COUNTS.pricing
    case 'demo':
      return OPTIMAL_PARTICLE_COUNTS.demo
    default:
      return OPTIMAL_PARTICLE_COUNTS.hero
  }
}

// 📐 GENERATORE DI DIMENSIONI ORIGINALI
export function generateOriginalSizes(sizes: Float32Array, count: number) {
  for (let i = 0; i < count; i++) {
    sizes[i] = 0.5 + Math.random() * 1.5
  }
}

// 🔧 CREAZIONE MATERIALE PARTICELLE con ALPHATEST (SSR Safe)
export function createParticleMaterial(circleTexture: THREE.CanvasTexture): THREE.PointsMaterial {
  return new THREE.PointsMaterial({
    size: MATERIAL_CONFIG.baseSize,
    sizeAttenuation: MATERIAL_CONFIG.sizeAttenuation,
    vertexColors: true,
    // 🎯 SOLUZIONE DEFINITIVA: alphaTest elimina quadrati neri
    alphaTest: 0.5,        // ← Scarta pixel con alpha < 50%
    transparent: false,    // ← Non serve più con alphaTest
    opacity: MATERIAL_CONFIG.opacity,
    blending: THREE.NormalBlending,
    map: circleTexture
  })
}

// 🎮 SETUP CAMERA (SSR Safe)
export function setupCamera(): THREE.PerspectiveCamera {
  const width = typeof window !== 'undefined' ? window.innerWidth : 1920
  const height = typeof window !== 'undefined' ? window.innerHeight : 1080
  
  const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
  camera.position.z = 45
  return camera
}

// 🖥️ SETUP RENDERER (SSR Safe)
export function setupRenderer(): THREE.WebGLRenderer {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  
  if (typeof window !== 'undefined') {
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0.5)
  } else {
    renderer.setSize(1920, 1080)
    renderer.setPixelRatio(1)
    renderer.setClearColor(0x000000, 0.5)
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
  if (typeof window === 'undefined') return
  
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
  
  material.size = MATERIAL_CONFIG.baseSize
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

// 📱 MOBILE DEVICE DETECTION (SSR Safe)
export function isMobileDevice(): boolean {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return false
  }
  
  const isMobileViewport = window.innerWidth <= 768
  const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera
  const isMobileUA = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile/i.test(userAgent)
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0
  
  return isMobileViewport || (isMobileUA && isTouchDevice)
}

// 🎯 CALCOLO PARTICELLE CON OTTIMIZZAZIONI MOBILE (SSR Safe)
export function getOptimalParticleCountWithMobile(shape: string): number {
  return getOptimalParticleCount(shape)
}

// 🖥️ SETUP RENDERER CON FALLBACK MOBILE (SSR Safe)
export function setupRendererWithMobileFallback(): THREE.WebGLRenderer {
  const isMobile = isMobileDevice()
  
  if (!isMobile) {
    return setupRenderer()
  }
  
  const renderer = new THREE.WebGLRenderer({ 
    antialias: false,
    alpha: true,
    powerPreference: 'low-power'
  })
  
  if (typeof window !== 'undefined') {
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(1)
    renderer.setClearColor(0x000000, 0.5)
  } else {
    renderer.setSize(1920, 1080)
    renderer.setPixelRatio(1)
    renderer.setClearColor(0x000000, 0.5)
  }
  
  return renderer
}

// 🎨 MATERIALE PARTICELLE MOBILE con ALPHATEST (SSR Safe)
export function createParticleMaterialWithMobileOptimizations(circleTexture: THREE.CanvasTexture): THREE.PointsMaterial {
  const isMobile = isMobileDevice()
  
  if (!isMobile) {
    return createParticleMaterial(circleTexture)
  }
  
  return new THREE.PointsMaterial({
    size: MATERIAL_CONFIG.baseSize * 1.1,
    sizeAttenuation: MATERIAL_CONFIG.sizeAttenuation,
    vertexColors: true,
    // 🎯 SOLUZIONE DEFINITIVA: alphaTest anche su mobile
    alphaTest: 0.5,        // ← Scarta pixel con alpha < 50%
    transparent: false,    // ← Non serve più con alphaTest
    opacity: MATERIAL_CONFIG.opacity,
    blending: THREE.NormalBlending,
    map: circleTexture
  })
}

// 📊 RESIZE HANDLER CON SUPPORTO MOBILE (SSR Safe)
export function handleResizeWithMobile(
  camera: THREE.PerspectiveCamera, 
  renderer: THREE.WebGLRenderer, 
  material: THREE.PointsMaterial
) {
  if (typeof window === 'undefined') return
  
  const isMobile = isMobileDevice()
  
  if (!isMobile) {
    return handleResize(camera, renderer, material)
  }
  
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
  
  renderer.setPixelRatio(1)
  material.size = MATERIAL_CONFIG.baseSize * 1.1
}