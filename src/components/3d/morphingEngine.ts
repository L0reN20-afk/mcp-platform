import * as THREE from 'three'
import { gsap } from 'gsap'
import { ParticleSystem } from './types'
import { ANIMATION_CONFIG } from './constants'
import { 
  generateUniformSpherePositions, 
  generateUniformTorusPositions, 
  generateUniformCubePositions, 
  generateMorphingBlobPositions, 
  generateDoubleHelixPositions 
} from './geometryGenerators'
import { generateColorsForShapeWithMobile } from './colorGenerators'
import { getOptimalParticleCountWithMobile, generateOriginalSizes } from './utils'

// 🔄 ENGINE DI MORPHING - Gestisce tutte le transizioni tra forme

// 🎯 MORPHING PRINCIPALE
export function morphToShape(
  particleSystem: ParticleSystem, 
  shape: string, 
  scene: THREE.Scene, 
  skipAnimation: boolean = false
) {
  if (particleSystem.currentShape === shape && !skipAnimation) return
  
  console.log(`✨ Morphing da ${particleSystem.currentShape} a ${shape}`)
  
  // Calcola numero ottimale per questa forma
  const optimalCount = getOptimalParticleCountWithMobile(shape)
  console.log(`🔢 Forma ${shape}: ${optimalCount} particelle ottimali`)
  
  // Ricrea geometria se serve un numero diverso
  let positions: Float32Array
  let colors: Float32Array
  
  if (optimalCount !== particleSystem.currentParticleCount) {
    console.log(`🔄 Ricreando geometria: ${particleSystem.currentParticleCount} → ${optimalCount}`)
    
    const result = recreateGeometry(particleSystem, optimalCount, scene)
    positions = result.positions
    colors = result.colors
  } else {
    // Usa geometria esistente
    positions = particleSystem.geometry.attributes.position.array as Float32Array
    colors = particleSystem.geometry.attributes.color.array as Float32Array
  }

  const count = particleSystem.currentParticleCount

  // Genera nuove posizioni target e colori
  generateTargetPositionsAndColors(particleSystem, shape, count)
  
  if (skipAnimation) {
    // Update immediato senza animazione (per resize)
    applyImmediateTransform(particleSystem, positions, colors)
    return
  }
  
  // Esegui animazione di esplosione completa
  executeExplosionAnimation(particleSystem, positions, colors, shape)
}

// 🔄 RICREA GEOMETRIA CON NUOVO NUMERO DI PARTICELLE
function recreateGeometry(
  particleSystem: ParticleSystem, 
  optimalCount: number, 
  scene: THREE.Scene
): { positions: Float32Array, colors: Float32Array } {
  // Salva riferimenti vecchi
  const oldPoints = particleSystem.points
  const oldGeometry = particleSystem.geometry
  
  // Crea nuova geometria
  const newGeometry = new THREE.BufferGeometry()
  const newPositions = new Float32Array(optimalCount * 3)
  const newColors = new Float32Array(optimalCount * 3)
  const newSizes = new Float32Array(optimalCount)
  
  // Inizializza i nuovi colori con i colori correnti
  generateColorsForShapeWithMobile(particleSystem.currentShape, newColors, optimalCount)
  console.log(`🎨 Colori inizializzati per forma corrente: ${particleSystem.currentShape}`)
  
  // Genera dimensioni e posizioni per le nuove particelle
  generateOriginalSizes(newSizes, optimalCount)
  
  // Inizializza posizioni con la forma corrente
  generatePositionsForShape(particleSystem.currentShape, newPositions, optimalCount)
  
  // Aggiorna attributi
  newGeometry.setAttribute('position', new THREE.BufferAttribute(newPositions, 3))
  newGeometry.setAttribute('color', new THREE.BufferAttribute(newColors, 3))
  newGeometry.setAttribute('size', new THREE.BufferAttribute(newSizes, 1))
  
  // Crea nuovo oggetto Points
  const newPoints = new THREE.Points(newGeometry, particleSystem.material)
  newPoints.rotation.copy(oldPoints.rotation) // Mantieni rotazione
  newPoints.scale.copy(oldPoints.scale) // Mantieni scala
  
  // Sostituisci nella scena
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
  
  console.log(`✅ Geometria ricreata con ${optimalCount} particelle e colori corretti!`)
  
  return { positions: newPositions, colors: newColors }
}

// 🎯 GENERA POSIZIONI PER FORMA SPECIFICA
function generatePositionsForShape(shape: string, positions: Float32Array, count: number, time: number = 0) {
  switch(shape) {
    case 'hero':
      generateUniformSpherePositions(positions, count)
      break
    case 'features':
      generateUniformTorusPositions(positions, count)
      break
    case 'packages':
      generateUniformCubePositions(positions, count)
      break
    case 'pricing':
      generateMorphingBlobPositions(positions, count, time)
      break
    case 'demo':
      generateDoubleHelixPositions(positions, count, time)
      break
    default:
      generateUniformSpherePositions(positions, count)
  }
}

// 🎯 GENERA TARGET POSITIONS E COLORI
function generateTargetPositionsAndColors(particleSystem: ParticleSystem, shape: string, count: number) {
  generatePositionsForShape(shape, particleSystem.targetPositions, count)
  generateColorsForShapeWithMobile(shape, particleSystem.colors, count)
  
  // Aggiorna timestamp per forme dinamiche
  if (shape === 'pricing' || shape === 'demo') {
    particleSystem.startTime = Date.now()
  }
}

// ⚡ APPLICA TRASFORMAZIONE IMMEDIATA (senza animazione)
function applyImmediateTransform(
  particleSystem: ParticleSystem, 
  positions: Float32Array, 
  colors: Float32Array
) {
  for (let i = 0; i < positions.length; i++) {
    positions[i] = particleSystem.targetPositions[i]
  }
  for (let i = 0; i < colors.length; i++) {
    colors[i] = particleSystem.colors[i]
  }
  
  particleSystem.geometry.attributes.position.needsUpdate = true
  particleSystem.geometry.attributes.color.needsUpdate = true
}

// 💥 ESEGUI ANIMAZIONE DI ESPLOSIONE COMPLETA
function executeExplosionAnimation(
  particleSystem: ParticleSystem, 
  positions: Float32Array, 
  colors: Float32Array, 
  shape: string
) {
  console.log(`💥 INIZIANDO ESPLOSIONE RAPIDA per ${shape}!`)
  
  // Salva i colori originali per mantenerli durante l'esplosione
  const originalColors = new Float32Array(colors)
  
  // Aumenta temporaneamente la luminosità durante l'esplosione
  gsap.to(particleSystem.material, {
    opacity: 1.0,
    duration: ANIMATION_CONFIG.explosionDuration,
    ease: "power2.out"
  })
  
  // Fase 1: ESPLOSIONE RAPIDA
  gsap.to(particleSystem.points.scale, {
    x: ANIMATION_CONFIG.explosionScale,
    y: ANIMATION_CONFIG.explosionScale,
    z: ANIMATION_CONFIG.explosionScale,
    duration: ANIMATION_CONFIG.explosionDuration,
    ease: "power3.out",
    onStart: () => console.log('🚀 ESPLOSIONE INIZIATA!'),
    onComplete: () => console.log('💥 ESPLOSIONE COMPLETATA!')
  })
  
  // Fase 2: ROTAZIONE CONTROLLATA
  gsap.to(particleSystem.points.rotation, {
    x: particleSystem.points.rotation.x + Math.PI * 2,
    y: particleSystem.points.rotation.y + Math.PI * 3,
    z: particleSystem.points.rotation.z + Math.PI * 1,
    duration: 1.5,
    ease: "power2.inOut"
  })
  
  // Fase 2.5: SHAKE VELOCE
  gsap.to(particleSystem.points.position, {
    x: "+=0.3", 
    y: "+=0.2", 
    z: "+=0.25",
    duration: 0.1,
    repeat: 6,
    yoyo: true,
    ease: "power2.inOut"
  })
  
  // Fase 3: DISPERSIONE CASUALE
  applyRandomDispersion(positions, particleSystem)
  
  // Fase 4: RICOMPOSIZIONE
  gsap.delayedCall(ANIMATION_CONFIG.pauseDuration, () => {
    executeRecomposition(particleSystem, positions, colors, originalColors, shape)
  })
}

// 🌪️ APPLICA DISPERSIONE CASUALE
function applyRandomDispersion(positions: Float32Array, particleSystem: ParticleSystem) {
  for (let i = 0; i < positions.length; i += 3) {
    positions[i] += (Math.random() - 0.5) * ANIMATION_CONFIG.explosionStrength     
    positions[i + 1] += (Math.random() - 0.5) * ANIMATION_CONFIG.explosionStrength   
    positions[i + 2] += (Math.random() - 0.5) * ANIMATION_CONFIG.explosionStrength 
  }
  particleSystem.geometry.attributes.position.needsUpdate = true
  console.log('🌪️ DISPERSIONE RAPIDA APPLICATA!')
}

// 🎨 ESEGUI RICOMPOSIZIONE
function executeRecomposition(
  particleSystem: ParticleSystem, 
  positions: Float32Array, 
  colors: Float32Array, 
  originalColors: Float32Array, 
  shape: string
) {
  console.log(`🎨 INIZIANDO RICOMPOSIZIONE in ${shape}...`)
  
  // Aggiorna le posizioni
  for (let i = 0; i < positions.length; i++) {
    positions[i] = particleSystem.targetPositions[i]
  }
  particleSystem.geometry.attributes.position.needsUpdate = true
  
  // Ricomposizione fluida - ritorno alla scala normale
  gsap.to(particleSystem.points.scale, {
    x: 1,
    y: 1, 
    z: 1,
    duration: ANIMATION_CONFIG.recompositionDuration,
    ease: "elastic.out(1, 0.4)",
    onComplete: () => {
      console.log(`✅ RICOMPOSIZIONE COMPLETATA! Ora in forma: ${shape}`)
      // Reset posizione dopo shake
      gsap.set(particleSystem.points.position, { x: 0, y: 0, z: 0 })
    }
  })
  
  // Transizione graduale dei colori
  executeColorTransition(colors, originalColors, particleSystem)
  
  // Ritorna opacità normale
  gsap.to(particleSystem.material, {
    opacity: ANIMATION_CONFIG.recompositionDuration > 0 ? 0.9 : 1.0,
    duration: ANIMATION_CONFIG.recompositionDuration,
    ease: "power2.inOut"
  })
  
  particleSystem.currentShape = shape
  particleSystem.isMorphing = false // Reset flag per permettere morphing successivi
}

// 🌈 ESEGUI TRANSIZIONE COLORI
function executeColorTransition(
  colors: Float32Array, 
  originalColors: Float32Array, 
  particleSystem: ParticleSystem
) {
  gsap.to({}, {
    duration: ANIMATION_CONFIG.recompositionDuration,
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
      console.log(`🌈 TRANSIZIONE COLORI COMPLETATA!`)
    }
  })
}
