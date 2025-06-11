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
  specialAnimationTimer?: number // 🔧 Timer separato per animazioni speciali (blob/DNA)
  pausedSpecialTime?: number // 🔧 Tempo pausato delle animazioni speciali durante morphing
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
