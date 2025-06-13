import { SHAPE_DIMENSIONS } from './constants'

// 🌐 GENERATORI DI GEOMETRIE - VERSIONE SEMPLIFICATA (STESSO ASPETTO VISIVO)

// 🌐 DISTRIBUZIONE UNIFORME PER SFERA - Spirale di Fibonacci
export function generateUniformSpherePositions(positions: Float32Array, count: number) {
  const radius = SHAPE_DIMENSIONS.sphere.radius
  
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

// 🍩 DISTRIBUZIONE UNIFORME PER TORO
export function generateUniformTorusPositions(positions: Float32Array, count: number) {
  const { majorRadius, minorRadius } = SHAPE_DIMENSIONS.torus
  
  const gridSize = Math.floor(Math.sqrt(count))
  let index = 0
  
  for (let i = 0; i < gridSize && index < count; i++) {
    for (let j = 0; j < gridSize && index < count; j++) {
      const u = (i / gridSize) * 2 * Math.PI
      const v = (j / gridSize) * 2 * Math.PI
      
      const x = (majorRadius + minorRadius * Math.cos(v)) * Math.cos(u)
      const y = (majorRadius + minorRadius * Math.cos(v)) * Math.sin(u)
      const z = minorRadius * Math.sin(v)
      
      positions[index * 3] = x
      positions[index * 3 + 1] = y
      positions[index * 3 + 2] = z
      index++
    }
  }
}

// 📦 DISTRIBUZIONE UNIFORME PER CUBO - ORIGINALE
export function generateUniformCubePositions(positions: Float32Array, count: number) {
  const size = SHAPE_DIMENSIONS.cube.size
  const particlesPerFace = Math.floor(count / 6)
  const gridSize = Math.ceil(Math.sqrt(particlesPerFace))
  let index = 0
  
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
    const targetParticlesForFace = faceIndex < 5 ? particlesPerFace : count - index
    
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
}

// 🌊 BLOB MORFANTE SEMPLIFICATO
export function generateMorphingBlobPositions(positions: Float32Array, count: number, time: number) {
  const baseRadius = SHAPE_DIMENSIONS.blob.baseRadius
  const timeScale = time * 0.0006
  
  for (let i = 0; i < count; i++) {
    // Base sferica uniforme
    const y = 1 - (i / (count - 1)) * 2
    const radiusAtY = Math.sqrt(1 - y * y)
    const theta = 2 * Math.PI * i / 1.618033988749
    
    let x = Math.cos(theta) * radiusAtY * baseRadius
    let yPos = y * baseRadius
    let z = Math.sin(theta) * radiusAtY * baseRadius
    
    // Onde di deformazione semplici
    const wave1 = Math.sin(2 * Math.atan2(yPos, x) + timeScale * 2) * 
                  Math.cos(1.5 * Math.atan2(z, Math.sqrt(x*x + yPos*yPos)) + timeScale * 1.5)
    
    const wave2 = Math.sin(3 * Math.atan2(z, x) + timeScale * 2.5) * 
                  Math.cos(2.5 * Math.atan2(yPos, Math.sqrt(x*x + z*z)) + timeScale * 2)
    
    const morphScale = 1 + 0.15 * wave1 + 0.08 * wave2
    
    positions[i * 3] = x * morphScale
    positions[i * 3 + 1] = yPos * morphScale
    positions[i * 3 + 2] = z * morphScale
  }
}

// 🧬 DNA DOPPIA ELICA SEMPLIFICATA
export function generateDoubleHelixPositions(positions: Float32Array, count: number, time: number = 0) {
  const { radius, height, turns, helixSeparation, tubeRadius } = SHAPE_DIMENSIONS.dna
  const timeScale = time * 0.0008
  const rotationOffset = timeScale * Math.PI * 0.5
  
  // Numero di punti per spirale e per file
  const particlesPerHelix = Math.floor(count / 2)
  const particlesPerTube = Math.floor(particlesPerHelix / 6)
  
  let particleIndex = 0
  
  // Prima spirale (6 file tubolari)
  for (let tubeIndex = 0; tubeIndex < 6; tubeIndex++) {
    const tubeAngle = (tubeIndex / 6) * Math.PI * 2
    
    for (let i = 0; i < particlesPerTube && particleIndex < count; i++) {
      const progress = i / particlesPerTube
      const t = progress * turns * 2 * Math.PI
      const y = (progress - 0.5) * height
      
      // Posizione centrale della spirale
      const centralX = radius * Math.cos(t + rotationOffset)
      const centralZ = radius * Math.sin(t + rotationOffset) + helixSeparation/2
      
      // Offset per creare il tubo
      const tubeOffsetX = tubeRadius * Math.cos(tubeAngle)
      const tubeOffsetZ = tubeRadius * Math.sin(tubeAngle)
      
      positions[particleIndex * 3] = centralX + tubeOffsetX
      positions[particleIndex * 3 + 1] = y
      positions[particleIndex * 3 + 2] = centralZ + tubeOffsetZ
      
      particleIndex++
    }
  }
  
  // Seconda spirale (senso opposto)
  for (let tubeIndex = 0; tubeIndex < 6; tubeIndex++) {
    const tubeAngle = (tubeIndex / 6) * Math.PI * 2
    
    for (let i = 0; i < particlesPerTube && particleIndex < count; i++) {
      const progress = i / particlesPerTube  
      const t = progress * turns * 2 * Math.PI
      const y = (progress - 0.5) * height
      
      const centralX = radius * Math.cos(-t - rotationOffset + Math.PI)
      const centralZ = radius * Math.sin(-t - rotationOffset + Math.PI) - helixSeparation/2
      
      const tubeOffsetX = tubeRadius * Math.cos(tubeAngle)
      const tubeOffsetZ = tubeRadius * Math.sin(tubeAngle)
      
      positions[particleIndex * 3] = centralX + tubeOffsetX
      positions[particleIndex * 3 + 1] = y
      positions[particleIndex * 3 + 2] = centralZ + tubeOffsetZ
      
      particleIndex++
    }
  }
  
  // Riempi particelle rimanenti
  while (particleIndex < count) {
    const isFirstHelix = Math.random() > 0.5
    const progress = Math.random()
    const t = progress * turns * 2 * Math.PI
    const y = (progress - 0.5) * height
    const randomAngle = Math.random() * Math.PI * 2
    
    let centralX, centralZ
    if (isFirstHelix) {
      centralX = radius * Math.cos(t + rotationOffset)
      centralZ = radius * Math.sin(t + rotationOffset) + helixSeparation/2
    } else {
      centralX = radius * Math.cos(-t - rotationOffset + Math.PI)
      centralZ = radius * Math.sin(-t - rotationOffset + Math.PI) - helixSeparation/2
    }
    
    positions[particleIndex * 3] = centralX + tubeRadius * Math.cos(randomAngle)
    positions[particleIndex * 3 + 1] = y
    positions[particleIndex * 3 + 2] = centralZ + tubeRadius * Math.sin(randomAngle)
    
    particleIndex++
  }
}