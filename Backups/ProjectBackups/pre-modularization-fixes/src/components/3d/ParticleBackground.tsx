'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { gsap } from 'gsap'

// Dynamic import for ScrollTrigger to avoid SSR issues
let ScrollTrigger: any
if (typeof window !== 'undefined') {
  import('gsap/ScrollTrigger').then(({ ScrollTrigger: ST }) => {
    ScrollTrigger = ST
    gsap.registerPlugin(ScrollTrigger)
  })
}

interface ParticleSystem {
  geometry: THREE.BufferGeometry
  material: THREE.PointsMaterial
  points: THREE.Points
  targetPositions: Float32Array
  colors: Float32Array
  currentShape: string
  startTime: number
  currentParticleCount: number
  // 🧬 DNA ULTRA-ADVANCED FEATURES
  dnaEnhanced?: DNAEnhancedSystem
}

// 🧬 **MEGA-SYSTEM: DNA ENHANCED** - Modularizzazione completa
class DNAEnhancedSystem {
  scene: THREE.Scene
  particleSystem: ParticleSystem
  
  // ⚡ Effetti elettrici
  electricEffects: ElectricEffects
  
  // 🌈 Colori dinamici
  dynamicColors: DynamicColors
  
  // 🎭 Materiali avanzati
  advancedMaterials: AdvancedMaterials
  
  // 🌊 Movimenti organici
  organicMovements: OrganicMovements
  
  // 🎬 Sequenze di attivazione
  activationSequences: ActivationSequences
  
  // 👆 Controlli interattivi
  interactiveControls: InteractiveControls
  
  // 📱 Sistema responsive
  responsiveSystem: ResponsiveSystem
  
  // 🎵 Audio sistema (preparato)
  audioSystem: AudioSystem
  
  // ⚡ Performance manager
  performanceManager: PerformanceManager
  
  // 🌟 Effects layers
  effectsLayers: EffectsLayers
  
  constructor(scene: THREE.Scene, particleSystem: ParticleSystem) {
    this.scene = scene
    this.particleSystem = particleSystem
    
    // Initialize all modules
    this.electricEffects = new ElectricEffects(scene, particleSystem)
    this.dynamicColors = new DynamicColors(particleSystem)
    this.advancedMaterials = new AdvancedMaterials(scene, particleSystem)
    this.organicMovements = new OrganicMovements(particleSystem)
    this.activationSequences = new ActivationSequences(scene, particleSystem)
    this.interactiveControls = new InteractiveControls(particleSystem)
    this.responsiveSystem = new ResponsiveSystem(particleSystem)
    this.audioSystem = new AudioSystem(particleSystem)
    this.performanceManager = new PerformanceManager(scene, particleSystem)
    this.effectsLayers = new EffectsLayers(scene, particleSystem)
    
    console.log('🧬✨ DNA ENHANCED SYSTEM INITIALIZED - ALL MODULES LOADED!')
  }
  
  update(time: number) {
    // Update all modules
    this.electricEffects.update(time)
    this.dynamicColors.update(time)
    this.advancedMaterials.update(time)
    this.organicMovements.update(time)
    this.activationSequences.update(time)
    this.interactiveControls.update(time)
    this.responsiveSystem.update(time)
    this.audioSystem.update(time)
    this.performanceManager.update(time)
    this.effectsLayers.update(time)
  }
  
  dispose() {
    this.electricEffects.dispose()
    this.dynamicColors.dispose()
    this.advancedMaterials.dispose()
    this.organicMovements.dispose()
    this.activationSequences.dispose()
    this.interactiveControls.dispose()
    this.responsiveSystem.dispose()
    this.audioSystem.dispose()
    this.performanceManager.dispose()
    this.effectsLayers.dispose()
  }
}

// ⚡ **MODULE 1: EFFETTI ELETTRICI BIO-TECH**
class ElectricEffects {
  scene: THREE.Scene
  particleSystem: ParticleSystem
  lightningBolts: THREE.Line[] = []
  energyPulses: THREE.Points[] = []
  dataStreams: THREE.Points[] = []
  lastLightningTime: number = 0
  pulseStartTime: number = 0
  
  constructor(scene: THREE.Scene, particleSystem: ParticleSystem) {
    this.scene = scene
    this.particleSystem = particleSystem
    this.initializeElectricEffects()
  }
  
  initializeElectricEffects() {
    console.log('⚡ Initializing Electric Effects...')
    
    // Create lightning bolt materials
    this.createLightningBolts()
    this.createEnergyPulses()
    this.createDataStreams()
  }
  
  createLightningBolts() {
    // Create 5 lightning connections between helixes
    for (let i = 0; i < 5; i++) {
      const points = []
      // Random points between the two helixes
      const y = (Math.random() - 0.5) * 40
      points.push(new THREE.Vector3(12, y, 2))  // First helix
      points.push(new THREE.Vector3(-12, y, -2)) // Second helix
      
      const geometry = new THREE.BufferGeometry().setFromPoints(points)
      const material = new THREE.LineBasicMaterial({ 
        color: 0x00ffff, 
        opacity: 0,
        transparent: true,
        linewidth: 3
      })
      
      const lightning = new THREE.Line(geometry, material)
      this.lightningBolts.push(lightning)
      this.scene.add(lightning)
    }
  }
  
  createEnergyPulses() {
    // Create energy pulse particles that travel along helixes
    for (let i = 0; i < 3; i++) {
      const geometry = new THREE.BufferGeometry()
      const positions = new Float32Array(50 * 3) // 50 particles per pulse
      const colors = new Float32Array(50 * 3)
      
      // Initialize with bright energy colors
      for (let j = 0; j < 50; j++) {
        colors[j * 3] = 0.1 + Math.random() * 0.9     // R
        colors[j * 3 + 1] = 0.8 + Math.random() * 0.2 // G
        colors[j * 3 + 2] = 1.0                       // B
      }
      
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
      
      const material = new THREE.PointsMaterial({
        size: 1.5,
        vertexColors: true,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending
      })
      
      const pulse = new THREE.Points(geometry, material)
      this.energyPulses.push(pulse)
      this.scene.add(pulse)
    }
  }
  
  createDataStreams() {
    // Create Matrix-style data streams
    for (let i = 0; i < 8; i++) {
      const geometry = new THREE.BufferGeometry()
      const positions = new Float32Array(20 * 3) // 20 particles per stream
      const colors = new Float32Array(20 * 3)
      
      // Green matrix colors
      for (let j = 0; j < 20; j++) {
        colors[j * 3] = 0.0                           // R
        colors[j * 3 + 1] = 0.5 + Math.random() * 0.5 // G
        colors[j * 3 + 2] = 0.2                       // B
      }
      
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
      
      const material = new THREE.PointsMaterial({
        size: 0.8,
        vertexColors: true,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending
      })
      
      const stream = new THREE.Points(geometry, material)
      this.dataStreams.push(stream)
      this.scene.add(stream)
    }
  }
  
  update(time: number) {
    // ⚡ Lightning bolts every 3-4 seconds
    if (time - this.lastLightningTime > 3000 + Math.random() * 1000) {
      this.triggerLightning()
      this.lastLightningTime = time
    }
    
    // 💫 Energy pulses continuous
    this.updateEnergyPulses(time)
    
    // 📊 Data streams continuous  
    this.updateDataStreams(time)
  }
  
  triggerLightning() {
    console.log('⚡ LIGHTNING STRIKE!')
    
    // Animate random lightning bolts
    const activeCount = Math.floor(Math.random() * 3) + 1
    for (let i = 0; i < activeCount; i++) {
      const bolt = this.lightningBolts[Math.floor(Math.random() * this.lightningBolts.length)]
      
      // Flash effect
      gsap.timeline()
        .to(bolt.material, { opacity: 0.8, duration: 0.05 })
        .to(bolt.material, { opacity: 0.4, duration: 0.1 })
        .to(bolt.material, { opacity: 0.9, duration: 0.03 })
        .to(bolt.material, { opacity: 0, duration: 0.2 })
    }
  }
  
  updateEnergyPulses(time: number) {
    this.energyPulses.forEach((pulse, index) => {
      const progress = ((time * 0.001) + index * 0.3) % 2 // 2 second cycle
      const positions = pulse.geometry.attributes.position.array as Float32Array
      
      // Energy travels along helix path
      for (let i = 0; i < 50; i++) {
        const t = (progress + i * 0.02) % 2
        const helixProgress = t * Math.PI * 4 // 4 turns
        const y = (t - 1) * 25 // Height along helix
        
        const isFirstHelix = index % 2 === 0
        if (isFirstHelix) {
          positions[i * 3] = 12 * Math.cos(helixProgress)
          positions[i * 3 + 1] = y
          positions[i * 3 + 2] = 12 * Math.sin(helixProgress) + 2
        } else {
          positions[i * 3] = 12 * Math.cos(-helixProgress + Math.PI)
          positions[i * 3 + 1] = y
          positions[i * 3 + 2] = 12 * Math.sin(-helixProgress + Math.PI) - 2
        }
      }
      
      pulse.geometry.attributes.position.needsUpdate = true
      
      // Fade in/out effect
      const opacity = Math.sin(progress * Math.PI) * 0.6
      pulse.material.opacity = Math.max(0, opacity)
    })
  }
  
  updateDataStreams(time: number) {
    this.dataStreams.forEach((stream, index) => {
      const positions = stream.geometry.attributes.position.array as Float32Array
      const speed = 0.002 + index * 0.0005
      
      for (let i = 0; i < 20; i++) {
        const t = ((time * speed) + index * 0.1 + i * 0.05) % 1
        const radius = 20 + Math.sin(time * 0.001 + index) * 5
        const angle = index * Math.PI * 0.25
        
        positions[i * 3] = radius * Math.cos(angle)
        positions[i * 3 + 1] = (t - 0.5) * 60 + Math.sin(t * Math.PI * 4) * 3
        positions[i * 3 + 2] = radius * Math.sin(angle)
      }
      
      stream.geometry.attributes.position.needsUpdate = true
      stream.material.opacity = 0.3 + Math.sin(time * 0.002 + index) * 0.2
    })
  }
  
  dispose() {
    this.lightningBolts.forEach(bolt => {
      this.scene.remove(bolt)
      bolt.geometry.dispose()
      bolt.material.dispose()
    })
    
    this.energyPulses.forEach(pulse => {
      this.scene.remove(pulse)
      pulse.geometry.dispose()
      pulse.material.dispose()
    })
    
    this.dataStreams.forEach(stream => {
      this.scene.remove(stream)
      stream.geometry.dispose()
      stream.material.dispose()
    })
  }
}

// 🌈 **MODULE 2: COLORI DINAMICI SCIENTIFICI**
class DynamicColors {
  particleSystem: ParticleSystem
  nucleotideSequence: string[] = []
  temperatureWave: number = 0
  scanningPosition: number = 0
  
  constructor(particleSystem: ParticleSystem) {
    this.particleSystem = particleSystem
    this.generateNucleotideSequence()
  }
  
  generateNucleotideSequence() {
    // Generate realistic DNA sequence
    const bases = ['A', 'T', 'G', 'C']
    const count = this.particleSystem.currentParticleCount / 2 // Half for each helix
    
    for (let i = 0; i < count; i++) {
      const randomBase = bases[Math.floor(Math.random() * 4)]
      this.nucleotideSequence.push(randomBase)
    }
    
    console.log('🧬 Generated nucleotide sequence:', this.nucleotideSequence.slice(0, 20).join(''))
  }
  
  update(time: number) {
    this.updateNucleotideColors(time)
    this.updateTemperatureGradient(time)
    this.updateScanningEffect(time)
  }
  
  updateNucleotideColors(time: number) {
    const colors = this.particleSystem.geometry.attributes.color.array as Float32Array
    
    for (let i = 0; i < this.particleSystem.currentParticleCount; i++) {
      const baseIndex = Math.floor(i / 2) % this.nucleotideSequence.length
      const base = this.nucleotideSequence[baseIndex]
      const isFirstHelix = i % 2 === 0
      
      let r, g, b
      
      // Realistic nucleotide colors
      switch(base) {
        case 'A': // Adenine - Red
          r = isFirstHelix ? 0.9 : 0.6
          g = isFirstHelix ? 0.2 : 0.4
          b = isFirstHelix ? 0.2 : 0.7
          break
        case 'T': // Thymine - Blue  
          r = isFirstHelix ? 0.2 : 0.9
          g = isFirstHelix ? 0.4 : 0.2
          b = isFirstHelix ? 0.9 : 0.2
          break
        case 'G': // Guanine - Green
          r = isFirstHelix ? 0.2 : 0.8
          g = isFirstHelix ? 0.8 : 0.8
          b = isFirstHelix ? 0.2 : 0.2
          break
        case 'C': // Cytosine - Yellow
          r = isFirstHelix ? 0.9 : 0.9
          g = isFirstHelix ? 0.9 : 0.2
          b = isFirstHelix ? 0.2 : 0.8
          break
        default:
          r = g = b = 0.5
      }
      
      colors[i * 3] = r
      colors[i * 3 + 1] = g
      colors[i * 3 + 2] = b
    }
    
    this.particleSystem.geometry.attributes.color.needsUpdate = true
  }
  
  updateTemperatureGradient(time: number) {
    this.temperatureWave = (time * 0.001) % (Math.PI * 2)
    
    // Apply temperature effect to colors
    const colors = this.particleSystem.geometry.attributes.color.array as Float32Array
    const positions = this.particleSystem.geometry.attributes.position.array as Float32Array
    
    for (let i = 0; i < this.particleSystem.currentParticleCount; i++) {
      const y = positions[i * 3 + 1]
      const normalizedY = (y + 25) / 50 // Normalize to 0-1
      
      // Temperature intensity based on position and time
      const tempIntensity = 0.5 + 0.5 * Math.sin(this.temperatureWave + normalizedY * Math.PI * 2)
      
      // Multiply colors by temperature
      colors[i * 3] *= (0.7 + tempIntensity * 0.3)
      colors[i * 3 + 1] *= (0.7 + tempIntensity * 0.3)
      colors[i * 3 + 2] *= (0.7 + tempIntensity * 0.3)
    }
  }
  
  updateScanningEffect(time: number) {
    this.scanningPosition = ((time * 0.002) % 1) * 50 - 25 // Move from -25 to 25
    
    const colors = this.particleSystem.geometry.attributes.color.array as Float32Array
    const positions = this.particleSystem.geometry.attributes.position.array as Float32Array
    
    for (let i = 0; i < this.particleSystem.currentParticleCount; i++) {
      const y = positions[i * 3 + 1]
      const distance = Math.abs(y - this.scanningPosition)
      
      if (distance < 3) {
        // Bright scanning beam effect
        const intensity = 1 - (distance / 3)
        colors[i * 3] += intensity * 0.5
        colors[i * 3 + 1] += intensity * 0.8
        colors[i * 3 + 2] += intensity * 1.0
      }
    }
  }
  
  dispose() {
    // No cleanup needed for this module
  }
}

// 🎭 **MODULE 3: MATERIALI AVANZATI**
class AdvancedMaterials {
  scene: THREE.Scene
  particleSystem: ParticleSystem
  glowEffect: THREE.Mesh | null = null
  hologramLines: THREE.LineSegments[] = []
  reflectionCube: THREE.CubeTexture | null = null
  
  constructor(scene: THREE.Scene, particleSystem: ParticleSystem) {
    this.scene = scene
    this.particleSystem = particleSystem
    this.initializeAdvancedMaterials()
  }
  
  initializeAdvancedMaterials() {
    this.createGlowEffect()
    this.createHologramLines()
    this.createReflectionEnvironment()
  }
  
  createGlowEffect() {
    // Create outer glow around DNA
    const glowGeometry = new THREE.SphereGeometry(35, 32, 32)
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: 0x0099ff,
      transparent: true,
      opacity: 0.05,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending
    })
    
    this.glowEffect = new THREE.Mesh(glowGeometry, glowMaterial)
    this.scene.add(this.glowEffect)
  }
  
  createHologramLines() {
    // Create horizontal scanning lines for hologram effect
    for (let i = 0; i < 20; i++) {
      const points = []
      const y = (i - 10) * 3
      
      for (let x = -30; x <= 30; x += 2) {
        points.push(new THREE.Vector3(x, y, -20))
        points.push(new THREE.Vector3(x, y, 20))
      }
      
      const geometry = new THREE.BufferGeometry().setFromPoints(points)
      const material = new THREE.LineBasicMaterial({
        color: 0x00ffaa,
        transparent: true,
        opacity: 0.1,
        blending: THREE.AdditiveBlending
      })
      
      const lines = new THREE.LineSegments(geometry, material)
      this.hologramLines.push(lines)
      this.scene.add(lines)
    }
  }
  
  createReflectionEnvironment() {
    // Create environment cube map for reflections
    const urls = [
      '', '', '', '', '', '' // Would normally load actual cube map textures
    ]
    
    // For now, create a simple procedural environment
    console.log('🔮 Environment reflections prepared')
  }
  
  update(time: number) {
    // Animate glow effect
    if (this.glowEffect) {
      this.glowEffect.material.opacity = 0.03 + 0.02 * Math.sin(time * 0.003)
      this.glowEffect.rotation.y = time * 0.0005
    }
    
    // Animate hologram lines
    this.hologramLines.forEach((line, index) => {
      const offset = (time * 0.01 + index * 0.1) % (Math.PI * 2)
      line.material.opacity = 0.05 + 0.05 * Math.sin(offset)
      line.position.z = Math.sin(offset) * 2
    })
    
    // Update particle material properties
    if (this.particleSystem.material) {
      this.particleSystem.material.opacity = 0.85 + 0.1 * Math.sin(time * 0.002)
    }
  }
  
  dispose() {
    if (this.glowEffect) {
      this.scene.remove(this.glowEffect)
      this.glowEffect.geometry.dispose()
      this.glowEffect.material.dispose()
    }
    
    this.hologramLines.forEach(line => {
      this.scene.remove(line)
      line.geometry.dispose()
      line.material.dispose()
    })
  }
}

// 🌊 **MODULE 4: MOVIMENTI ORGANICI**
class OrganicMovements {
  particleSystem: ParticleSystem
  heartbeatPhase: number = 0
  breathingPhase: number = 0
  pulseIntensity: number = 1
  
  constructor(particleSystem: ParticleSystem) {
    this.particleSystem = particleSystem
  }
  
  update(time: number) {
    this.updateHeartbeat(time)
    this.updateBreathing(time)
    this.updateOrganicTorsion(time)
  }
  
  updateHeartbeat(time: number) {
    // Simulate heartbeat: lub-dub rhythm
    this.heartbeatPhase = (time * 0.002) % (Math.PI * 2)
    
    // Create lub-dub pattern (two peaks per cycle)
    const beat1 = Math.max(0, Math.sin(this.heartbeatPhase * 2)) ** 8
    const beat2 = Math.max(0, Math.sin(this.heartbeatPhase * 2 + Math.PI * 0.3)) ** 12
    this.pulseIntensity = 1 + (beat1 + beat2) * 0.15
    
    // Apply to particle system scale
    if (this.particleSystem.points) {
      const currentScale = this.particleSystem.points.scale.x
      const targetScale = this.pulseIntensity
      this.particleSystem.points.scale.setScalar(currentScale + (targetScale - currentScale) * 0.3)
    }
  }
  
  updateBreathing(time: number) {
    // Slow breathing rhythm  
    this.breathingPhase = Math.sin(time * 0.0008) * 0.05 + 1
    
    // Apply subtle breathing to Y-scale
    if (this.particleSystem.points) {
      this.particleSystem.points.scale.y *= this.breathingPhase
    }
  }
  
  updateOrganicTorsion(time: number) {
    // Variable torsion along the helix
    const positions = this.particleSystem.geometry.attributes.position.array as Float32Array
    
    for (let i = 0; i < this.particleSystem.currentParticleCount; i += 3) {
      const y = positions[i * 3 + 1]
      const normalizedY = (y + 25) / 50 // 0 to 1
      
      // Different sections rotate at different speeds
      const torsionSpeed = 1 + Math.sin(normalizedY * Math.PI * 3) * 0.5
      const torsionOffset = time * 0.0005 * torsionSpeed
      
      // Apply organic torsion (this would be applied in generateDoubleHelixPositions)
    }
  }
  
  dispose() {
    // Reset scale to normal
    if (this.particleSystem.points) {
      this.particleSystem.points.scale.setScalar(1)
    }
  }
}

// 🎬 **MODULE 5: SEQUENZE DI ATTIVAZIONE**
class ActivationSequences {
  scene: THREE.Scene
  particleSystem: ParticleSystem
  bootSequenceActive: boolean = false
  lastDataUpload: number = 0
  replicationMode: boolean = false
  
  constructor(scene: THREE.Scene, particleSystem: ParticleSystem) {
    this.scene = scene
    this.particleSystem = particleSystem
  }
  
  triggerBootSequence() {
    if (this.bootSequenceActive) return
    
    console.log('🚀 DNA BOOT SEQUENCE INITIATED!')
    this.bootSequenceActive = true
    
    // Hide all particles initially
    this.particleSystem.material.opacity = 0
    
    // Animate assembly from bottom to top
    const positions = this.particleSystem.geometry.attributes.position.array as Float32Array
    const originalY: number[] = []
    
    // Store original Y positions and move all to bottom
    for (let i = 0; i < this.particleSystem.currentParticleCount; i++) {
      originalY[i] = positions[i * 3 + 1]
      positions[i * 3 + 1] = -30 // Move to bottom
    }
    this.particleSystem.geometry.attributes.position.needsUpdate = true
    
    // Animate assembly over 3 seconds
    gsap.timeline()
      .to(this.particleSystem.material, { opacity: 0.9, duration: 0.5 })
      .to({}, {
        duration: 2.5,
        ease: "power2.out",
        onUpdate: function() {
          const progress = this.progress()
          
          for (let i = 0; i < this.targets()[0].particleSystem.currentParticleCount; i++) {
            const targetY = originalY[i]
            const currentY = -30 + (targetY + 30) * progress
            positions[i * 3 + 1] = currentY
          }
          this.targets()[0].particleSystem.geometry.attributes.position.needsUpdate = true
        },
        onUpdateParams: [this]
      })
      .call(() => {
        this.bootSequenceActive = false
        console.log('✅ DNA BOOT SEQUENCE COMPLETE!')
      })
  }
  
  triggerDataUpload() {
    console.log('💥 DATA UPLOAD SEQUENCE!')
    
    // Create upward-moving data particles
    const uploadGeometry = new THREE.BufferGeometry()
    const uploadPositions = new Float32Array(100 * 3)
    const uploadColors = new Float32Array(100 * 3)
    
    // Initialize upload particles around DNA
    for (let i = 0; i < 100; i++) {
      const angle = (i / 100) * Math.PI * 2
      const radius = 15 + Math.random() * 10
      
      uploadPositions[i * 3] = Math.cos(angle) * radius
      uploadPositions[i * 3 + 1] = -25 - Math.random() * 10
      uploadPositions[i * 3 + 2] = Math.sin(angle) * radius
      
      // Bright upload colors
      uploadColors[i * 3] = 1.0
      uploadColors[i * 3 + 1] = 0.8 + Math.random() * 0.2
      uploadColors[i * 3 + 2] = 0.2
    }
    
    uploadGeometry.setAttribute('position', new THREE.BufferAttribute(uploadPositions, 3))
    uploadGeometry.setAttribute('color', new THREE.BufferAttribute(uploadColors, 3))
    
    const uploadMaterial = new THREE.PointsMaterial({
      size: 1.2,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    })
    
    const uploadPoints = new THREE.Points(uploadGeometry, uploadMaterial)
    this.scene.add(uploadPoints)
    
    // Animate upload movement
    gsap.timeline()
      .to(uploadPoints.position, { y: 60, duration: 2, ease: "power2.in" })
      .to(uploadMaterial, { opacity: 0, duration: 0.5 }, "-=0.5")
      .call(() => {
        this.scene.remove(uploadPoints)
        uploadGeometry.dispose()
        uploadMaterial.dispose()
      })
  }
  
  triggerReplicationMode() {
    if (this.replicationMode) return
    
    console.log('🔄 DNA REPLICATION MODE ACTIVATED!')
    this.replicationMode = true
    
    // Duplicate the helix temporarily
    const cloneGeometry = this.particleSystem.geometry.clone()
    const cloneMaterial = this.particleSystem.material.clone()
    cloneMaterial.opacity *= 0.5
    
    const clonePoints = new THREE.Points(cloneGeometry, cloneMaterial)
    clonePoints.position.copy(this.particleSystem.points.position)
    clonePoints.rotation.copy(this.particleSystem.points.rotation)
    clonePoints.scale.copy(this.particleSystem.points.scale)
    
    this.scene.add(clonePoints)
    
    // Animate separation
    gsap.timeline()
      .to(clonePoints.position, { x: 40, duration: 2, ease: "power2.inOut" })
      .to(this.particleSystem.points.position, { x: -40, duration: 2, ease: "power2.inOut" }, 0)
      .to(cloneMaterial, { opacity: 0, duration: 1 }, "-=0.5")
      .to(this.particleSystem.points.position, { x: 0, duration: 1.5, ease: "power2.inOut" })
      .call(() => {
        this.scene.remove(clonePoints)
        cloneGeometry.dispose()
        cloneMaterial.dispose()
        this.replicationMode = false
        console.log('✅ DNA REPLICATION COMPLETE!')
      })
  }
  
  update(time: number) {
    // Trigger data upload every 8-12 seconds
    if (time - this.lastDataUpload > 8000 + Math.random() * 4000) {
      this.triggerDataUpload()
      this.lastDataUpload = time
    }
    
    // Trigger replication occasionally
    if (Math.random() < 0.0001) { // Very rare
      this.triggerReplicationMode()
    }
  }
  
  dispose() {
    // Cleanup would happen in individual sequence cleanup
  }
}

// 👆 **MODULE 6: CONTROLLI INTERATTIVI**
class InteractiveControls {
  particleSystem: ParticleSystem
  mouse: THREE.Vector2 = new THREE.Vector2()
  raycaster: THREE.Raycaster = new THREE.Raycaster()
  hoveredParticle: number = -1
  zoomLevel: number = 1
  
  constructor(particleSystem: ParticleSystem) {
    this.particleSystem = particleSystem
    this.setupEventListeners()
  }
  
  setupEventListeners() {
    if (typeof window === 'undefined') return
    
    window.addEventListener('mousemove', this.onMouseMove.bind(this))
    window.addEventListener('click', this.onClick.bind(this))
    window.addEventListener('wheel', this.onWheel.bind(this))
  }
  
  onMouseMove(event: MouseEvent) {
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1
    
    // Update hover detection would go here
    this.updateHoverDetection()
  }
  
  onClick(event: MouseEvent) {
    // Trigger zoom on click
    this.triggerZoom(this.mouse)
  }
  
  onWheel(event: WheelEvent) {
    // Control zoom level
    this.zoomLevel += event.deltaY * 0.001
    this.zoomLevel = Math.max(0.5, Math.min(3, this.zoomLevel))
    
    if (this.particleSystem.points) {
      gsap.to(this.particleSystem.points.scale, {
        x: this.zoomLevel,
        y: this.zoomLevel,
        z: this.zoomLevel,
        duration: 0.5,
        ease: "power2.out"
      })
    }
  }
  
  updateHoverDetection() {
    // This would implement raycasting to detect hovered particles
    // For performance, we'll keep it simple
  }
  
  triggerZoom(position: THREE.Vector2) {
    console.log('🔍 Zoom triggered at:', position.x, position.y)
    
    // Create zoom effect
    if (this.particleSystem.points) {
      gsap.timeline()
        .to(this.particleSystem.points.scale, {
          x: this.zoomLevel * 1.5,
          y: this.zoomLevel * 1.5,
          z: this.zoomLevel * 1.5,
          duration: 0.3,
          ease: "power2.out"
        })
        .to(this.particleSystem.points.scale, {
          x: this.zoomLevel,
          y: this.zoomLevel,
          z: this.zoomLevel,
          duration: 0.5,
          ease: "elastic.out(1, 0.3)"
        })
    }
  }
  
  update(time: number) {
    // Continuous updates for interactive features
  }
  
  dispose() {
    if (typeof window !== 'undefined') {
      window.removeEventListener('mousemove', this.onMouseMove.bind(this))
      window.removeEventListener('click', this.onClick.bind(this))
      window.removeEventListener('wheel', this.onWheel.bind(this))
    }
  }
}

// 📱 **MODULE 7: SISTEMA RESPONSIVE**
class ResponsiveSystem {
  particleSystem: ParticleSystem
  currentComplexity: number = 1
  performanceMode: boolean = false
  
  constructor(particleSystem: ParticleSystem) {
    this.particleSystem = particleSystem
    this.detectDeviceCapabilities()
  }
  
  detectDeviceCapabilities() {
    // Detect device performance capabilities
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    const pixelRatio = window.devicePixelRatio || 1
    const screenSize = window.innerWidth * window.innerHeight
    
    if (isMobile || pixelRatio < 2 || screenSize < 800000) {
      this.performanceMode = true
      this.currentComplexity = 0.5
    }
    
    console.log('📱 Device detected:', { isMobile, pixelRatio, screenSize, performanceMode: this.performanceMode })
  }
  
  adaptComplexity() {
    // Adjust particle count based on performance
    if (this.performanceMode) {
      // Reduce particle count for better performance
      const targetCount = Math.floor(this.particleSystem.currentParticleCount * 0.7)
      console.log('📱 Reducing complexity for performance:', targetCount)
    }
  }
  
  update(time: number) {
    // Monitor performance and adjust if needed
    this.monitorPerformance()
  }
  
  monitorPerformance() {
    // Simple performance monitoring
    // In a real implementation, this would monitor FPS and adjust accordingly
  }
  
  dispose() {
    // No cleanup needed
  }
}

// 🎵 **MODULE 8: SISTEMA AUDIO (PREPARATO)**
class AudioSystem {
  particleSystem: ParticleSystem
  audioContext: AudioContext | null = null
  analyser: AnalyserNode | null = null
  frequencyData: Uint8Array | null = null
  audioEnabled: boolean = false
  
  constructor(particleSystem: ParticleSystem) {
    this.particleSystem = particleSystem
    // Audio system prepared but not initialized (to avoid autoplay issues)
  }
  
  initializeAudio() {
    if (typeof window === 'undefined') return
    
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      this.analyser = this.audioContext.createAnalyser()
      this.analyser.fftSize = 256
      this.frequencyData = new Uint8Array(this.analyser.frequencyBinCount)
      this.audioEnabled = true
      
      console.log('🎵 Audio system initialized')
    } catch (error) {
      console.log('🎵 Audio not available:', error)
    }
  }
  
  connectAudioSource(source: MediaStreamAudioSourceNode) {
    if (this.analyser) {
      source.connect(this.analyser)
      console.log('🎵 Audio source connected')
    }
  }
  
  update(time: number) {
    if (!this.audioEnabled || !this.analyser || !this.frequencyData) return
    
    this.analyser.getByteFrequencyData(this.frequencyData)
    
    // Apply audio reactive effects
    this.applyAudioReactiveEffects()
  }
  
  applyAudioReactiveEffects() {
    if (!this.frequencyData) return
    
    // Use audio data to influence particle behavior
    const averageFreq = this.frequencyData.reduce((a, b) => a + b) / this.frequencyData.length
    const normalizedFreq = averageFreq / 255
    
    // Apply to particle scale
    if (this.particleSystem.points) {
      const scaleMultiplier = 1 + normalizedFreq * 0.3
      this.particleSystem.points.scale.setScalar(scaleMultiplier)
    }
    
    // Apply to material opacity
    this.particleSystem.material.opacity = 0.7 + normalizedFreq * 0.3
  }
  
  dispose() {
    if (this.audioContext) {
      this.audioContext.close()
    }
  }
}

// ⚡ **MODULE 9: PERFORMANCE MANAGER**
class PerformanceManager {
  scene: THREE.Scene
  particleSystem: ParticleSystem
  frameCount: number = 0
  lastFpsCheck: number = 0
  currentFps: number = 60
  lodLevel: number = 1
  
  constructor(scene: THREE.Scene, particleSystem: ParticleSystem) {
    this.scene = scene
    this.particleSystem = particleSystem
  }
  
  update(time: number) {
    this.frameCount++
    
    // Check FPS every second
    if (time - this.lastFpsCheck > 1000) {
      this.currentFps = this.frameCount
      this.frameCount = 0
      this.lastFpsCheck = time
      
      this.adjustLOD()
    }
  }
  
  adjustLOD() {
    // Adjust Level of Detail based on performance
    if (this.currentFps < 30) {
      this.lodLevel = Math.max(0.3, this.lodLevel - 0.1)
    } else if (this.currentFps > 50) {
      this.lodLevel = Math.min(1.0, this.lodLevel + 0.05)
    }
    
    // Apply LOD adjustments
    this.applyLODSettings()
  }
  
  applyLODSettings() {
    // Adjust particle size based on LOD
    this.particleSystem.material.size = 0.4 * this.lodLevel
    
    // Adjust material quality
    if (this.lodLevel < 0.7) {
      this.particleSystem.material.blending = THREE.NormalBlending
    } else {
      this.particleSystem.material.blending = THREE.AdditiveBlending
    }
    
    console.log('⚡ LOD adjusted:', this.lodLevel, 'FPS:', this.currentFps)
  }
  
  dispose() {
    // Reset to normal settings
    this.particleSystem.material.size = 0.4
    this.particleSystem.material.blending = THREE.AdditiveBlending
  }
}

// 🌟 **MODULE 10: EFFECTS LAYERS**
class EffectsLayers {
  scene: THREE.Scene
  particleSystem: ParticleSystem
  backgroundParticles: THREE.Points[] = []
  trailEffects: THREE.Points[] = []
  environmentParticles: THREE.Points | null = null
  
  constructor(scene: THREE.Scene, particleSystem: ParticleSystem) {
    this.scene = scene
    this.particleSystem = particleSystem
    this.initializeEffectsLayers()
  }
  
  initializeEffectsLayers() {
    this.createBackgroundParticles()
    this.createTrailEffects()
    this.createEnvironmentParticles()
  }
  
  createBackgroundParticles() {
    // Create subtle background particles (cosmic dust)
    for (let i = 0; i < 3; i++) {
      const geometry = new THREE.BufferGeometry()
      const count = 200
      const positions = new Float32Array(count * 3)
      const colors = new Float32Array(count * 3)
      
      for (let j = 0; j < count; j++) {
        // Random positions in a larger sphere
        const radius = 60 + Math.random() * 40
        const phi = Math.acos(2 * Math.random() - 1)
        const theta = 2 * Math.PI * Math.random()
        
        positions[j * 3] = radius * Math.sin(phi) * Math.cos(theta)
        positions[j * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
        positions[j * 3 + 2] = radius * Math.cos(phi)
        
        // Subtle colors
        colors[j * 3] = 0.1 + Math.random() * 0.2
        colors[j * 3 + 1] = 0.1 + Math.random() * 0.3
        colors[j * 3 + 2] = 0.2 + Math.random() * 0.4
      }
      
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
      
      const material = new THREE.PointsMaterial({
        size: 0.2,
        vertexColors: true,
        transparent: true,
        opacity: 0.3,
        blending: THREE.AdditiveBlending
      })
      
      const points = new THREE.Points(geometry, material)
      this.backgroundParticles.push(points)
      this.scene.add(points)
    }
  }
  
  createTrailEffects() {
    // Create trail effects for main particles
    // This would track particle movements and create trails
    console.log('🌟 Trail effects prepared')
  }
  
  createEnvironmentParticles() {
    // Create ambient environment particles
    const geometry = new THREE.BufferGeometry()
    const count = 500
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    
    for (let i = 0; i < count; i++) {
      // Distribute around the DNA
      positions[i * 3] = (Math.random() - 0.5) * 200
      positions[i * 3 + 1] = (Math.random() - 0.5) * 100
      positions[i * 3 + 2] = (Math.random() - 0.5) * 200
      
      // Very subtle colors
      colors[i * 3] = 0.05
      colors[i * 3 + 1] = 0.1
      colors[i * 3 + 2] = 0.15
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    
    const material = new THREE.PointsMaterial({
      size: 0.1,
      vertexColors: true,
      transparent: true,
      opacity: 0.2,
      blending: THREE.AdditiveBlending
    })
    
    this.environmentParticles = new THREE.Points(geometry, material)
    this.scene.add(this.environmentParticles)
  }
  
  update(time: number) {
    // Animate background particles
    this.backgroundParticles.forEach((particles, index) => {
      particles.rotation.y = time * 0.0001 * (index + 1)
      particles.rotation.x = time * 0.0002 * (index + 1)
    })
    
    // Animate environment particles
    if (this.environmentParticles) {
      this.environmentParticles.rotation.y = time * 0.00005
      
      const positions = this.environmentParticles.geometry.attributes.position.array as Float32Array
      for (let i = 0; i < positions.length; i += 3) {
        positions[i + 1] += Math.sin(time * 0.0005 + i * 0.01) * 0.02
      }
      this.environmentParticles.geometry.attributes.position.needsUpdate = true
    }
  }
  
  dispose() {
    this.backgroundParticles.forEach(particles => {
      this.scene.remove(particles)
      particles.geometry.dispose()
      particles.material.dispose()
    })
    
    if (this.environmentParticles) {
      this.scene.remove(this.environmentParticles)
      this.environmentParticles.geometry.dispose()
      this.environmentParticles.material.dispose()
    }
  }
}

// 🎨 TEXTURE CIRCOLARE per fare cerchi invece di quadratini (UNCHANGED)
function createCircleTexture() {
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

export default function ParticleBackground() {
  const mountRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const particleSystemRef = useRef<ParticleSystem | null>(null)
  const animationIdRef = useRef<number>()

  useEffect(() => {
    if (!mountRef.current) return

    console.log('🧬✨ Inizializzazione DNA ULTRA-SYSTEM...')

    // Scene setup (IDENTICO ALL'ORIGINALE)
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false })
    
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0) // BACKGROUND ORIGINALE TRASPARENTE
    mountRef.current.appendChild(renderer.domElement)

    // CORREZIONE: Forzare stili del canvas per visibilità (IDENTICO ALL'ORIGINALE)
    const canvas = renderer.domElement
    canvas.style.position = 'fixed'
    canvas.style.top = '0'
    canvas.style.left = '0'
    canvas.style.zIndex = '-1'
    canvas.style.pointerEvents = 'none'

    // Camera position - FISSO come originale, più vicino per figure più grandi
    camera.position.z = 45 // Era 50, ora 45 per vedere meglio

    // 🎯 NUMERI OTTIMALI DI PARTICELLE PER OGNI FORMA (UNCHANGED)
    const getOptimalParticleCount = (shape: string) => {
      const baseMultiplier = Math.min(window.devicePixelRatio || 1, 2)
      
      switch(shape) {
        case 'hero': return Math.floor(1800 * baseMultiplier)
        case 'features': 
          const torusGrid = Math.floor(45 * baseMultiplier)
          return torusGrid * torusGrid
        case 'packages': 
          const faceGrid = Math.floor(18 * baseMultiplier)
          return faceGrid * faceGrid * 6
        case 'pricing': return Math.floor(2200 * baseMultiplier)
        case 'demo': return Math.floor(1800 * baseMultiplier) // DNA
        default: return Math.floor(1800 * baseMultiplier)
      }
    }

    // Inizia con la forma hero (sfera)
    let currentParticleCount = getOptimalParticleCount('hero')

    // Particle system setup (RITORNO AL POINTSMATERIAL ORIGINALE)
    const geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(currentParticleCount * 3)
    const colors = new Float32Array(currentParticleCount * 3)
    const sizes = new Float32Array(currentParticleCount)

    // Initialize particles in sphere formation (DISTRIBUZIONE UNIFORME)
    generateUniformSpherePositions(positions, currentParticleCount)
    generateBlueColors(colors, currentParticleCount)
    generateOriginalSizes(sizes, currentParticleCount)

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))

    // 🎨 MATERIAL ORIGINALE + TEXTURE CIRCOLARE
    const circleTexture = createCircleTexture()
    
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2)
    const adjustedSize = 0.4 * pixelRatio
    
    const material = new THREE.PointsMaterial({
      size: adjustedSize,
      sizeAttenuation: true,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      map: circleTexture
    })

    const points = new THREE.Points(geometry, material)
    scene.add(points)

    const particleSystem: ParticleSystem = {
      geometry,
      material,
      points,
      targetPositions: new Float32Array(currentParticleCount * 3),
      colors: new Float32Array(currentParticleCount * 3),
      currentShape: 'hero',
      startTime: Date.now(),
      currentParticleCount
    }

    // 🧬✨ INITIALIZE DNA ENHANCED SYSTEM
    particleSystem.dnaEnhanced = new DNAEnhancedSystem(scene, particleSystem)

    sceneRef.current = scene
    rendererRef.current = renderer
    particleSystemRef.current = particleSystem

    // Animation loop (ENHANCED)
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate)
      
      if (particleSystem.points) {
        // Continuous rotation per tutte le forme - LEGGERMENTE AUMENTATA
        particleSystem.points.rotation.y += 0.0015
        particleSystem.points.rotation.x += 0.0008
        
        // 🌊 MORPHING CONTINUO per la figura dinamica nella sezione PRICING
        if (particleSystem.currentShape === 'pricing') {
          const currentTime = Date.now() - particleSystem.startTime
          const positions = particleSystem.geometry.attributes.position.array as Float32Array
          const count = particleSystem.currentParticleCount
          
          generateMorphingBlobPositions(positions, count, currentTime)
          particleSystem.geometry.attributes.position.needsUpdate = true
        }
        
        // 🧬 ANIMAZIONE CONTINUA per DNA Doppia Elica nella sezione DEMO (ENHANCED)
        if (particleSystem.currentShape === 'demo') {
          const currentTime = Date.now() - particleSystem.startTime
          const positions = particleSystem.geometry.attributes.position.array as Float32Array
          const count = particleSystem.currentParticleCount
          
          generateEnhancedDoubleHelixPositions(positions, count, currentTime)
          particleSystem.geometry.attributes.position.needsUpdate = true
          
          // 🧬✨ UPDATE DNA ENHANCED SYSTEM
          if (particleSystem.dnaEnhanced) {
            particleSystem.dnaEnhanced.update(currentTime)
          }
        }
      }

      renderer.render(scene, camera)
    }
    animate()

    // Scroll-triggered morphing
    setupScrollTriggers(particleSystem, scene)

    // Handle resize
    const handleResize = () => {
      if (!camera || !renderer || !particleSystem) return
      
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
      
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2)
      const adjustedSize = 0.4 * pixelRatio
      particleSystem.material.size = adjustedSize
      
      const newOptimalCount = getOptimalParticleCount(particleSystem.currentShape)
      
      if (newOptimalCount !== particleSystem.currentParticleCount) {
        console.log(`📱 Resize: Aggiornamento particelle ${particleSystem.currentParticleCount} → ${newOptimalCount}`)
        morphToShape(particleSystem, particleSystem.currentShape, scene, true)
      }
    }
    window.addEventListener('resize', handleResize)

    console.log('🧬✨ DNA ULTRA-SYSTEM INIZIALIZZATO!')

    return () => {
      window.removeEventListener('resize', handleResize)
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current)
      }
      
      // 🧬✨ CLEANUP DNA ENHANCED SYSTEM
      if (particleSystem.dnaEnhanced) {
        particleSystem.dnaEnhanced.dispose()
      }
      
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement)
      }
      renderer.dispose()
      geometry.dispose()
      material.dispose()
      circleTexture.dispose()
    }
  }, [])

  return <div ref={mountRef} className="particles-container" style={{
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: -1,
    pointerEvents: 'none'
  }} />
}

// 🧬 **ENHANCED DNA HELIX GENERATION** - Con tutti i miglioramenti organici
function generateEnhancedDoubleHelixPositions(positions: Float32Array, count: number, time: number = 0) {
  const radius = 12        // Raggio delle eliche
  const height = 50        // Altezza totale della doppia elica  
  const turns = 4          // Numero di giri completi
  const helixSeparation = 4 // Distanza tra le due eliche
  
  // 🕰️ ROTAZIONE DINAMICA per animazione fluida
  const timeScale = time * 0.001
  const rotationOffset = timeScale * Math.PI
  
  // 🌊 ORGANIC MOVEMENTS - Torsione variabile e pulsazione
  const heartbeatPhase = (time * 0.002) % (Math.PI * 2)
  const beat1 = Math.max(0, Math.sin(heartbeatPhase * 2)) ** 8
  const beat2 = Math.max(0, Math.sin(heartbeatPhase * 2 + Math.PI * 0.3)) ** 12
  const pulseIntensity = 1 + (beat1 + beat2) * 0.1
  
  const breathingPhase = Math.sin(time * 0.0008) * 0.03 + 1
  
  for (let i = 0; i < count; i++) {
    // Distribuisci le particelle su entrambe le eliche
    const progress = i / count // 0 to 1
    const t = progress * turns * 2 * Math.PI // Parametro per spirale
    
    // Altezza lungo l'asse Y con breathing
    const y = (progress - 0.5) * height * breathingPhase
    
    // 🌊 Torsione variabile lungo l'altezza
    const normalizedY = (y + height/2) / height // 0 to 1
    const torsionSpeed = 1 + Math.sin(normalizedY * Math.PI * 3) * 0.3
    const organicRotation = rotationOffset * torsionSpeed
    
    // 💓 Raggio con pulsazione cardiaca
    const organicRadius = radius * pulseIntensity
    
    // Alterna tra elica 1 e elica 2
    const isFirstHelix = i % 2 === 0
    
    if (isFirstHelix) {
      // 🧬 PRIMA ELICA (senso orario + organic movement)
      const x = organicRadius * Math.cos(t + organicRotation)
      const z = organicRadius * Math.sin(t + organicRotation) + helixSeparation/2
      
      positions[i * 3] = x
      positions[i * 3 + 1] = y
      positions[i * 3 + 2] = z
    } else {
      // 🧬 SECONDA ELICA (senso antiorario + organic movement + offset π)
      const x = organicRadius * Math.cos(-t - organicRotation + Math.PI)
      const z = organicRadius * Math.sin(-t - organicRotation + Math.PI) - helixSeparation/2
      
      positions[i * 3] = x
      positions[i * 3 + 1] = y
      positions[i * 3 + 2] = z
    }
  }
}

// 🌐 DISTRIBUZIONE UNIFORME PER SFERA - Spirale di Fibonacci (UNCHANGED)
function generateUniformSpherePositions(positions: Float32Array, count: number) {
  const radius = 25
  
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2
    const radiusAtY = Math.sqrt(1 - y * y)
    const theta = 2 * Math.PI * i / 1.618033988749
    
    const x = Math.cos(theta) * radiusAtY
    const z = Math.sin(theta) * radiusAtY
    
    positions[i * 3] = x * radius
    positions[i * 3 + 1] = y * radius
    positions[i * 3 + 2] = z * radius
  }
}

// 🍩 DISTRIBUZIONE UNIFORME PER TORO (UNCHANGED)
function generateUniformTorusPositions(positions: Float32Array, count: number) {
  const majorRadius = 28
  const minorRadius = 10
  
  const gridSize = Math.floor(Math.sqrt(count))
  const actualCount = gridSize * gridSize
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

// 📦 DISTRIBUZIONE UNIFORME PER CUBO (UNCHANGED)
function generateUniformCubePositions(positions: Float32Array, count: number) {
  const size = 32
  
  const particlesPerFace = Math.floor(count / 6)
  const gridSize = Math.ceil(Math.sqrt(particlesPerFace))
  let index = 0
  
  const faces = [
    { normal: [0, 0, 1], u: [1, 0, 0], v: [0, 1, 0] },
    { normal: [0, 0, -1], u: [-1, 0, 0], v: [0, 1, 0] },
    { normal: [1, 0, 0], u: [0, 0, -1], v: [0, 1, 0] },
    { normal: [-1, 0, 0], u: [0, 0, 1], v: [0, 1, 0] },
    { normal: [0, 1, 0], u: [1, 0, 0], v: [0, 0, -1] },
    { normal: [0, -1, 0], u: [1, 0, 0], v: [0, 0, 1] }
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

// 🌊 FIGURA DINAMICA MORFANTE (UNCHANGED)
function generateMorphingBlobPositions(positions: Float32Array, count: number, time: number) {
  const baseRadius = 22
  
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2
    const radiusAtY = Math.sqrt(1 - y * y)
    const theta = 2 * Math.PI * i / 1.618033988749
    
    let x = Math.cos(theta) * radiusAtY * baseRadius
    let yPos = y * baseRadius
    let z = Math.sin(theta) * radiusAtY * baseRadius
    
    const timeScale = time * 0.0008
    
    const wave1 = Math.sin(3 * Math.atan2(yPos, x) + timeScale * 2) * 
                  Math.cos(2 * Math.atan2(z, Math.sqrt(x*x + yPos*yPos)) + timeScale * 1.5)
    
    const wave2 = Math.sin(5 * Math.atan2(z, x) + timeScale * 3) * 
                  Math.cos(4 * Math.atan2(yPos, Math.sqrt(x*x + z*z)) + timeScale * 2.5)
    
    const wave3 = Math.sin(7 * Math.atan2(x, z) + timeScale * 4) * 
                  Math.cos(6 * Math.atan2(yPos, x) + timeScale * 3.5)
    
    const morphScale = 1 + 0.2 * wave1 + 0.1 * wave2 + 0.05 * wave3
    
    positions[i * 3] = x * morphScale
    positions[i * 3 + 1] = yPos * morphScale
    positions[i * 3 + 2] = z * morphScale
  }
}

// FUNZIONI COLORI (ENHANCED DNA COLORS + ORIGINALI)
function generateBlueColors(colors: Float32Array, count: number) {
  for (let i = 0; i < count; i++) {
    colors[i * 3] = 0.2 + Math.random() * 0.3
    colors[i * 3 + 1] = 0.5 + Math.random() * 0.3
    colors[i * 3 + 2] = 0.8 + Math.random() * 0.2
  }
}

function generatePurpleColors(colors: Float32Array, count: number) {
  for (let i = 0; i < count; i++) {
    colors[i * 3] = 0.6 + Math.random() * 0.3
    colors[i * 3 + 1] = 0.2 + Math.random() * 0.3
    colors[i * 3 + 2] = 0.8 + Math.random() * 0.2
  }
}

function generateCyanColors(colors: Float32Array, count: number) {
  for (let i = 0; i < count; i++) {
    colors[i * 3] = 0.1 + Math.random() * 0.2
    colors[i * 3 + 1] = 0.7 + Math.random() * 0.3
    colors[i * 3 + 2] = 0.8 + Math.random() * 0.2
  }
}

function generateGreenColors(colors: Float32Array, count: number) {
  for (let i = 0; i < count; i++) {
    colors[i * 3] = 0.1 + Math.random() * 0.3
    colors[i * 3 + 1] = 0.7 + Math.random() * 0.3
    colors[i * 3 + 2] = 0.2 + Math.random() * 0.3
  }
}

// 🧬 **ENHANCED DNA COLORS** - Colori nucleotidi realistici (NUOVO!)
function generateEnhancedDNAColors(colors: Float32Array, count: number, nucleotideSequence?: string[]) {
  for (let i = 0; i < count; i++) {
    const isFirstHelix = i % 2 === 0
    const baseIndex = Math.floor(i / 2) % (nucleotideSequence?.length || 4)
    const base = nucleotideSequence?.[baseIndex] || ['A', 'T', 'G', 'C'][baseIndex % 4]
    
    let r, g, b
    
    // Realistic nucleotide colors
    switch(base) {
      case 'A': // Adenine - Red/Blue pair
        r = isFirstHelix ? 0.9 : 0.3
        g = isFirstHelix ? 0.2 : 0.4
        b = isFirstHelix ? 0.2 : 0.9
        break
      case 'T': // Thymine - Blue/Red pair  
        r = isFirstHelix ? 0.3 : 0.9
        g = isFirstHelix ? 0.4 : 0.2
        b = isFirstHelix ? 0.9 : 0.2
        break
      case 'G': // Guanine - Green/Yellow pair
        r = isFirstHelix ? 0.2 : 0.9
        g = isFirstHelix ? 0.8 : 0.9
        b = isFirstHelix ? 0.2 : 0.2
        break
      case 'C': // Cytosine - Yellow/Green pair
        r = isFirstHelix ? 0.9 : 0.2
        g = isFirstHelix ? 0.9 : 0.8
        b = isFirstHelix ? 0.2 : 0.2
        break
      default:
        r = g = b = 0.5
    }
    
    colors[i * 3] = r
    colors[i * 3 + 1] = g
    colors[i * 3 + 2] = b
  }
}

function generateOrangeColors(colors: Float32Array, count: number) {
  for (let i = 0; i < count; i++) {
    colors[i * 3] = 0.9 + Math.random() * 0.1
    colors[i * 3 + 1] = 0.5 + Math.random() * 0.3
    colors[i * 3 + 2] = 0.1 + Math.random() * 0.2
  }
}

function generateRainbowColors(colors: Float32Array, count: number) {
  for (let i = 0; i < count; i++) {
    const hue = (i / count) * 6.28
    const saturation = 0.8 + Math.random() * 0.2
    const value = 0.9 + Math.random() * 0.1
    
    const h = (hue * 180 / Math.PI) / 60
    const c = value * saturation
    const x = c * (1 - Math.abs((h % 2) - 1))
    const m = value - c
    
    let r = 0, g = 0, b = 0
    
    if (h >= 0 && h < 1) { r = c; g = x; b = 0 }
    else if (h >= 1 && h < 2) { r = x; g = c; b = 0 }
    else if (h >= 2 && h < 3) { r = 0; g = c; b = x }
    else if (h >= 3 && h < 4) { r = 0; g = x; b = c }
    else if (h >= 4 && h < 5) { r = x; g = 0; b = c }
    else if (h >= 5 && h < 6) { r = c; g = 0; b = x }
    
    colors[i * 3] = r + m
    colors[i * 3 + 1] = g + m
    colors[i * 3 + 2] = b + m
  }
}

function generateOriginalSizes(sizes: Float32Array, count: number) {
  for (let i = 0; i < count; i++) {
    sizes[i] = 0.5 + Math.random() * 1.5
  }
}

// Scroll triggers setup (ENHANCED)
function setupScrollTriggers(particleSystem: ParticleSystem, scene: THREE.Scene) {
  if (typeof window === 'undefined') return
  
  const initScrollTriggers = () => {
    if (!ScrollTrigger) {
      setTimeout(initScrollTriggers, 100)
      return
    }
    
    console.log('🎬 Inizializzazione ScrollTriggers per morphing...')
    
    const sections = ['hero', 'features', 'packages', 'pricing', 'demo']
    
    sections.forEach((section, index) => {
      ScrollTrigger.create({
        trigger: `#${section}`,
        start: "top center",
        end: "bottom center",
        onEnter: () => {
          console.log(`🔄 Morphing to ${section}`)
          morphToShape(particleSystem, section, scene)
          
          // 🧬 Trigger special DNA sequences
          if (section === 'demo' && particleSystem.dnaEnhanced) {
            particleSystem.dnaEnhanced.activationSequences.triggerBootSequence()
          }
        },
        onEnterBack: () => {
          console.log(`🔄 Morphing back to ${section}`)
          morphToShape(particleSystem, section, scene)
        }
      })
    })
  }
  
  initScrollTriggers()
}

// Morphing function (ENHANCED FOR DNA)
function morphToShape(particleSystem: ParticleSystem, shape: string, scene: THREE.Scene, skipAnimation: boolean = false) {
  if (particleSystem.currentShape === shape && !skipAnimation) return
  
  console.log(`✨ Morphing da ${particleSystem.currentShape} a ${shape}`)
  
  // ... (rest of the morphing function remains the same but with enhanced DNA colors)
  const getOptimalParticleCount = (targetShape: string) => {
    const baseMultiplier = Math.min(window.devicePixelRatio || 1, 2)
    
    switch(targetShape) {
      case 'hero': return Math.floor(1800 * baseMultiplier)
      case 'features': 
        const torusGrid = Math.floor(45 * baseMultiplier)
        return torusGrid * torusGrid
      case 'packages': 
        const faceGrid = Math.floor(18 * baseMultiplier)
        return faceGrid * faceGrid * 6
      case 'pricing': return Math.floor(2200 * baseMultiplier)
      case 'demo': return Math.floor(1800 * baseMultiplier)
      default: return Math.floor(1800 * baseMultiplier)
    }
  }
  
  const optimalCount = getOptimalParticleCount(shape)
  
  // ... (handling geometry recreation same as before)
  let positions: Float32Array
  let colors: Float32Array
  
  if (optimalCount !== particleSystem.currentParticleCount) {
    // ... (geometry recreation logic same as before)
    const oldPoints = particleSystem.points
    const oldGeometry = particleSystem.geometry
    
    const newGeometry = new THREE.BufferGeometry()
    const newPositions = new Float32Array(optimalCount * 3)
    const newColors = new Float32Array(optimalCount * 3)
    const newSizes = new Float32Array(optimalCount)
    
    // Initialize colors for current shape
    switch(particleSystem.currentShape) {
      case 'hero':
        generateBlueColors(newColors, optimalCount)
        break
      case 'features':
        generatePurpleColors(newColors, optimalCount)
        break
      case 'packages':
        generateCyanColors(newColors, optimalCount)
        break
      case 'pricing':
        generateRainbowColors(newColors, optimalCount)
        break
      case 'demo':
        generateEnhancedDNAColors(newColors, optimalCount) // 🧬 ENHANCED!
        break
      default:
        generateBlueColors(newColors, optimalCount)
    }
    
    generateOriginalSizes(newSizes, optimalCount)
    
    // Initialize positions
    switch(particleSystem.currentShape) {
      case 'hero':
        generateUniformSpherePositions(newPositions, optimalCount)
        break
      case 'features':
        generateUniformTorusPositions(newPositions, optimalCount)
        break
      case 'packages':
        generateUniformCubePositions(newPositions, optimalCount)
        break
      case 'pricing':
        generateMorphingBlobPositions(newPositions, optimalCount, 0)
        break
      case 'demo':
        generateEnhancedDoubleHelixPositions(newPositions, optimalCount, 0) // 🧬 ENHANCED!
        break
      default:
        generateUniformSpherePositions(newPositions, optimalCount)
    }
    
    newGeometry.setAttribute('position', new THREE.BufferAttribute(newPositions, 3))
    newGeometry.setAttribute('color', new THREE.BufferAttribute(newColors, 3))
    newGeometry.setAttribute('size', new THREE.BufferAttribute(newSizes, 1))
    
    const newPoints = new THREE.Points(newGeometry, particleSystem.material)
    newPoints.rotation.copy(oldPoints.rotation)
    newPoints.scale.copy(oldPoints.scale)
    
    scene.remove(oldPoints)
    scene.add(newPoints)
    
    particleSystem.geometry = newGeometry
    particleSystem.points = newPoints
    particleSystem.targetPositions = new Float32Array(optimalCount * 3)
    particleSystem.colors = new Float32Array(optimalCount * 3)
    particleSystem.currentParticleCount = optimalCount
    
    oldGeometry.dispose()
    
    positions = newPositions
    colors = newColors
  } else {
    positions = particleSystem.geometry.attributes.position.array as Float32Array
    colors = particleSystem.geometry.attributes.color.array as Float32Array
  }

  const count = particleSystem.currentParticleCount

  // Generate new target positions and colors
  switch(shape) {
    case 'hero':
      generateUniformSpherePositions(particleSystem.targetPositions, count)
      generateBlueColors(particleSystem.colors, count)
      break
    case 'features':
      generateUniformTorusPositions(particleSystem.targetPositions, count)
      generatePurpleColors(particleSystem.colors, count)
      break
    case 'packages':
      generateUniformCubePositions(particleSystem.targetPositions, count)
      generateCyanColors(particleSystem.colors, count)
      break
    case 'pricing':
      generateMorphingBlobPositions(particleSystem.targetPositions, count, 0)
      generateRainbowColors(particleSystem.colors, count)
      particleSystem.startTime = Date.now()
      break
    case 'demo':
      generateEnhancedDoubleHelixPositions(particleSystem.targetPositions, count, 0) // 🧬 ENHANCED!
      generateEnhancedDNAColors(particleSystem.colors, count) // 🧬 ENHANCED!
      particleSystem.startTime = Date.now()
      break
  }
  
  if (skipAnimation) {
    for (let i = 0; i < positions.length; i++) {
      positions[i] = particleSystem.targetPositions[i]
    }
    for (let i = 0; i < colors.length; i++) {
      colors[i] = particleSystem.colors[i]
    }
    
    particleSystem.geometry.attributes.position.needsUpdate = true
    particleSystem.geometry.attributes.color.needsUpdate = true
    particleSystem.currentShape = shape
    return
  }
  
  // Explosion animation (same as before but enhanced for DNA)
  console.log(`💥 INIZIANDO ESPLOSIONE RAPIDA per ${shape}!`)
  
  const originalColors = new Float32Array(colors)
  
  gsap.to(particleSystem.material, {
    opacity: 1.0,
    duration: 0.9,
    ease: "power2.out"
  })
  
  gsap.to(particleSystem.points.scale, {
    x: 4.0,
    y: 4.0,
    z: 4.0,
    duration: 0.9,
    ease: "power3.out"
  })
  
  gsap.to(particleSystem.points.rotation, {
    x: particleSystem.points.rotation.x + Math.PI * 2,
    y: particleSystem.points.rotation.y + Math.PI * 3,
    z: particleSystem.points.rotation.z + Math.PI * 1,
    duration: 1.5,
    ease: "power2.inOut"
  })
  
  gsap.to(particleSystem.points.position, {
    x: "+=0.3", 
    y: "+=0.2", 
    z: "+=0.25",
    duration: 0.1,
    repeat: 6,
    yoyo: true,
    ease: "power2.inOut"
  })
  
  // Dispersione casuale
  for (let i = 0; i < positions.length; i += 3) {
    const explosionStrength = 25
    positions[i] += (Math.random() - 0.5) * explosionStrength     
    positions[i + 1] += (Math.random() - 0.5) * explosionStrength   
    positions[i + 2] += (Math.random() - 0.5) * explosionStrength 
  }
  particleSystem.geometry.attributes.position.needsUpdate = true
  
  gsap.delayedCall(0.6, () => {
    console.log(`🎨 INIZIANDO RICOMPOSIZIONE in ${shape}...`)
    
    for (let i = 0; i < positions.length; i++) {
      positions[i] = particleSystem.targetPositions[i]
    }
    particleSystem.geometry.attributes.position.needsUpdate = true
    
    gsap.to(particleSystem.points.scale, {
      x: 1,
      y: 1, 
      z: 1,
      duration: 1.8,
      ease: "elastic.out(1, 0.4)",
      onComplete: () => {
        gsap.set(particleSystem.points.position, { x: 0, y: 0, z: 0 })
      }
    })
    
    gsap.to({}, {
      duration: 1.8,
      ease: "power2.inOut",
      onUpdate: function() {
        const progress = this.progress()
        for (let i = 0; i < colors.length; i++) {
          colors[i] = originalColors[i] + (particleSystem.colors[i] - originalColors[i]) * progress
        }
        particleSystem.geometry.attributes.color.needsUpdate = true
      }
    })
    
    gsap.to(particleSystem.material, {
      opacity: 0.9,
      duration: 1.8,
      ease: "power2.inOut"
    })
  })
  
  particleSystem.currentShape = shape
}