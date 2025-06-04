import * as THREE from 'three'

// 🎯 TIPI E INTERFACCE DEL SISTEMA PARTICELLARE

export interface ParticleSystem {
  geometry: THREE.BufferGeometry
  material: THREE.PointsMaterial
  points: THREE.Points
  targetPositions: Float32Array
  colors: Float32Array
  currentShape: string
  startTime: number
  currentParticleCount: number
  isMorphing?: boolean // Flag per evitare morphing multipli
  // 🧬 DNA ENHANCEMENTS
  dnaConnections?: DNAConnections
  dnaGlow?: DNAGlow
}

// 🔗 **DNA CONNECTIONS SYSTEM** - Ponti idrogeno tra eliche
export interface DNAConnections {
  lines: THREE.Line[]
  lineMaterials: THREE.LineBasicMaterial[]
  lastUpdateTime: number
  activeConnections: number
  maxConnections: number
}

// 🌟 **DNA GLOW SYSTEM** - Effetto luminoso
export interface DNAGlow {
  glowMesh: THREE.Mesh
  glowMaterial: THREE.MeshBasicMaterial
  innerGlow: THREE.Points
  outerGlow: THREE.Points
}

// 📊 CONFIGURAZIONI FORME
export interface ShapeConfig {
  particleCount: number
  radius?: number
  majorRadius?: number
  minorRadius?: number
  size?: number
  height?: number
  turns?: number
}

// 🎨 CONFIGURAZIONI COLORI
export interface ColorConfig {
  primary: [number, number, number]
  secondary: [number, number, number]
  variance: number
}

// ⚙️ OPZIONI PERFORMANCE
export interface PerformanceOptions {
  devicePixelRatio: number
  isHighPerformance: boolean
  particleMultiplier: number
  animationSpeed: number
}
