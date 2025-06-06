// 🎯 COSTANTI E CONFIGURAZIONI DEL SISTEMA PARTICELLARE

// 📊 NUMERI OTTIMALI DI PARTICELLE PER OGNI FORMA
export const OPTIMAL_PARTICLE_COUNTS = {
  hero: 1800,      // Sfera - distribuzione Fibonacci
  features: 2025,  // Toro - griglia 45x45
  packages: 1944,  // Cubo - 6 facce con griglia 18x18
  pricing: 2200,   // Blob morfante - flessibile per dettagli
  demo: 1800       // DNA Doppia Elica - distribuzione elica
} as const

// 📐 DIMENSIONI FISSE DELLE FORME
export const SHAPE_DIMENSIONS = {
  sphere: { radius: 25 },
  torus: { majorRadius: 28, minorRadius: 10 },
  cube: { size: 32 },
  blob: { baseRadius: 22 },
  dna: { 
    radius: 12, 
    height: 50, 
    turns: 4, 
    helixSeparation: 3, 
    tubeRadius: 1.8 
  }
} as const

// 🎨 CONFIGURAZIONI MATERIALI
export const MATERIAL_CONFIG = {
  baseSize: 0.4,
  opacity: 0.9,
  sizeAttenuation: true,
  transparent: true,
  blending: 'additive' as const
} as const

// ⚡ CONFIGURAZIONI ANIMAZIONI
export const ANIMATION_CONFIG = {
  rotationSpeed: {
    y: 0.0015,
    x: 0.0008
  },
  morphingSpeed: 0.0008,
  explosionDuration: 0.9,
  pauseDuration: 0.6,
  recompositionDuration: 1.8,
  explosionScale: 4.0,
  explosionStrength: 25
} as const

// 🎯 QUALITÀ E PERFORMANCE
export const QUALITY_THRESHOLDS = {
  lowEnd: {
    memory: 4,
    cores: 4,
    pixelRatio: 2
  },
  performanceMultipliers: {
    high: 1.0,
    medium: 0.7,
    low: 0.5
  }
} as const

// 📱 IMPOSTAZIONI MOBILE
export const MOBILE_CONFIG = {
  maxParticles: 800,
  simpleForms: true,
  reducedAnimations: true,
  staticColors: true,
  pixelRatioLimit: 1
} as const

// 🌈 DEFINIZIONI COLORI BASE - LUMINOSITÀ ALTA per particelle spettacolari
export const COLOR_PALETTES = {
  hero: { r: [0.2, 0.5], g: [0.5, 0.8], b: [0.8, 1.0] },        // BLU - luminosità alta
  features: { r: [0.6, 0.9], g: [0.2, 0.5], b: [0.8, 1.0] },    // VIOLA - luminosità alta  
  packages: { r: [0.1, 0.3], g: [0.7, 1.0], b: [0.8, 1.0] },    // CYAN - luminosità alta
  pricing: { rainbow: true },                                     // Mantenuto per varietà
  demo: { 
    helix1: { r: [0.1, 0.3], g: [0.8, 1.0], b: [0.3, 0.5] },    // DNA Verde - luminosità alta
    helix2: { r: [0.1, 0.25], g: [0.4, 0.6], b: [0.8, 1.0] }    // DNA Blu - mantiene intensità
  }
} as const
