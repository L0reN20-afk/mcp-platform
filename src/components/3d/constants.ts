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
    tubeRadius: 0.8
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
  hero: { r: [0.125, 0.894], g: [0.220, 0.369], b: [0.220, 0.369] },    // BRAND COLORS: da #205e5e a #e43838
  features: { r: [0.133, 0.910], g: [0.475, 0.827], b: [0.933, 0.976] },    // GRADIENTE "Professionali": da #22d3ee a #e879f9  
  packages: { r: [0.7, 0.9], g: [0.1, 0.25], b: [0.1, 0.25] },    // ROSSO PURO MENO INTENSO: equilibrato
  pricing: { rainbow: true },                                     // Mantenuto per varietà
  demo: { 
    helix1: { r: [0.8, 1.0], g: [0.2, 0.4], b: [0.4, 0.6] },    // DNA Rosa/Rosso - come emoji 🧬
    helix2: { r: [0.1, 0.3], g: [0.4, 0.6], b: [0.8, 1.0] }     // DNA Blu - come emoji 🧬
  }
} as const
