import { SHAPE_DIMENSIONS } from './constants'

// 🌐 GENERATORI DI GEOMETRIE - Tutte le forme del sistema particellare

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
  
  // Calcola la griglia quadrata esatta dal numero di particelle
  const gridSize = Math.floor(Math.sqrt(count))
  const actualCount = gridSize * gridSize
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

// 📦 DISTRIBUZIONE UNIFORME PER CUBO
export function generateUniformCubePositions(positions: Float32Array, count: number) {
  const size = SHAPE_DIMENSIONS.cube.size
  
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

// 🌊 FIGURA DINAMICA MORFANTE - DEFORMAZIONI MOLTO PIÙ SOTTILI!
export function generateMorphingBlobPositions(positions: Float32Array, count: number, time: number) {
  const baseRadius = SHAPE_DIMENSIONS.blob.baseRadius
  
  for (let i = 0; i < count; i++) {
    // Base sferica uniforme (distribuzione uniforme)
    const y = 1 - (i / (count - 1)) * 2
    const radiusAtY = Math.sqrt(1 - y * y)
    const theta = 2 * Math.PI * i / 1.618033988749
    
    let x = Math.cos(theta) * radiusAtY * baseRadius
    let yPos = y * baseRadius
    let z = Math.sin(theta) * radiusAtY * baseRadius
    
    // 🌊 DEFORMAZIONI DINAMICHE - MOLTO PIÙ SOTTILI!
    const timeScale = time * 0.0008
    
    const wave1 = Math.sin(3 * Math.atan2(yPos, x) + timeScale * 2) * 
                  Math.cos(2 * Math.atan2(z, Math.sqrt(x*x + yPos*yPos)) + timeScale * 1.5)
    
    const wave2 = Math.sin(5 * Math.atan2(z, x) + timeScale * 3) * 
                  Math.cos(4 * Math.atan2(yPos, Math.sqrt(x*x + z*z)) + timeScale * 2.5)
    
    const wave3 = Math.sin(7 * Math.atan2(x, z) + timeScale * 4) * 
                  Math.cos(6 * Math.atan2(yPos, x) + timeScale * 3.5)
    
    // 🎯 DEFORMAZIONI MOLTO PIÙ SOTTILI
    const morphScale = 1 + 0.2 * wave1 + 0.1 * wave2 + 0.05 * wave3
    
    positions[i * 3] = x * morphScale
    positions[i * 3 + 1] = yPos * morphScale
    positions[i * 3 + 2] = z * morphScale
  }
}

// 🧬 DNA DOPPIA ELICA **TUBOLARE** - Ogni elica è un TUBO!
export function generateDoubleHelixPositions(positions: Float32Array, count: number, time: number = 0) {
  const { radius, height, turns, helixSeparation, tubeRadius } = SHAPE_DIMENSIONS.dna
  
  // 🕰️ ROTAZIONE DINAMICA per animazione fluida
  const timeScale = time * 0.001
  const rotationOffset = timeScale * Math.PI
  
  console.log(`🧬 DNA TUBOLARE: Generando ${count} particelle in tubi (4 fili per elica = 8 fili totali)`)
  
  for (let i = 0; i < count; i++) {
    // 🧬 8 FILI TOTALI: 4 per ogni elica che formano la circonferenza del tubo
    const filamentIndex = i % 8
    const isFirstHelix = filamentIndex < 4
    const tubeFilamentIndex = filamentIndex % 4
    
    // Progresso lungo l'altezza dell'elica
    const helixProgress = Math.floor(i / 8) / Math.floor(count / 8)
    const t = helixProgress * turns * 2 * Math.PI
    
    // Altezza lungo l'asse Y
    const y = (helixProgress - 0.5) * height
    
    // 🎯 POSIZIONE SULLA CIRCONFERENZA DEL TUBO
    const tubeAngle = (tubeFilamentIndex / 4) * Math.PI * 2
    
    if (isFirstHelix) {
      // 🧬 PRIMA ELICA TUBOLARE (senso orario)
      const helixCenterX = radius * Math.cos(t + rotationOffset)
      const helixCenterZ = radius * Math.sin(t + rotationOffset) + helixSeparation/2
      
      // Calcola i vettori tangente e normale per orientare il tubo
      const tangentX = -radius * Math.sin(t + rotationOffset)
      const tangentZ = radius * Math.cos(t + rotationOffset)
      const tangentY = height / (turns * 2 * Math.PI)
      
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
