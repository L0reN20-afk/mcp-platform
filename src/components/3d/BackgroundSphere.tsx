'use client'

import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { gsap } from 'gsap'
import { loggers } from '@/utils/logger'

// Dynamic import for ScrollTrigger to avoid SSR issues
let ScrollTrigger: any
if (typeof window !== 'undefined') {
  import('gsap/ScrollTrigger').then(({ ScrollTrigger: ST }) => {
    ScrollTrigger = ST
    gsap.registerPlugin(ScrollTrigger)
  })
}

export default function BackgroundSphere() {
  const mountRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const sphereRef = useRef<THREE.Mesh | null>(null)
  const animationIdRef = useRef<number>()
  const scrollTriggersRef = useRef<any[]>([])
  const [isMobile, setIsMobile] = useState(false)
  const [currentSection, setCurrentSection] = useState('hero')

  // ⏱️ DELTA TIME & REFRESH RATE TRACKING
  const lastTimeRef = useRef<number>(performance.now())
  const frameCountRef = useRef<number>(0)
  const fpsStartTimeRef = useRef<number>(performance.now())
  const detectedFPSRef = useRef<number>(60)
  const deltaTimeRef = useRef<number>(16.67) // 60 FPS baseline

  // 📊 HELPER FUNCTIONS
  const detectRefreshRate = () => {
    frameCountRef.current++
    
    if (frameCountRef.current === 120) { // Sample over 2 seconds at 60fps
      const elapsed = performance.now() - fpsStartTimeRef.current
      const actualFPS = (120 * 1000) / elapsed
      detectedFPSRef.current = Math.round(actualFPS)
      
      // ✅ ANTI-SPAM: Log solo una volta
      loggers.sphere.once('INFO', 'fps', `BackgroundSphere: ${actualFPS} FPS`)
      
      // Reset for continuous monitoring
      frameCountRef.current = 0
      fpsStartTimeRef.current = performance.now()
      
      return detectedFPSRef.current
    }
    return detectedFPSRef.current
  }

  const calculateDeltaTime = () => {
    const currentTime = performance.now()
    const rawDelta = currentTime - lastTimeRef.current
    lastTimeRef.current = currentTime
    
    // Smooth delta time to avoid spikes
    deltaTimeRef.current = Math.min(rawDelta, 33.33) // Cap at 30 FPS minimum
    
    return deltaTimeRef.current
  }

  const getTimeMultiplier = () => {
    // Normalize to 60 FPS baseline (16.67ms per frame)
    return deltaTimeRef.current / 16.67
  }

  // Detect mobile
  useEffect(() => {
    setIsMobile(window.innerWidth < 768)
  }, [])

  // 🎨 FUNZIONE PER OTTENERE I COLORI DI OGNI SEZIONE
  const getSectionColors = (section: string) => {
    switch (section) {
      case 'hero':
        // Brand colors
        return {
          color1: new THREE.Vector3(0.894, 0.220, 0.220), // #e43838
          color2: new THREE.Vector3(0.125, 0.369, 0.369)  // #205e5e
        }
      case 'features':
        // Gradiente "Professionali" colors - secondary-400 → accent-400
        return {
          color1: new THREE.Vector3(0.910, 0.475, 0.976), // #e879f9 (secondary-400) viola magenta
          color2: new THREE.Vector3(0.133, 0.827, 0.933)  // #22d3ee (accent-400) cyan brillante
        }
      case 'packages':
        // Gradiente "Piano Perfetto" colors - orange-400 → rosso puro del cubo
        return {
          color1: new THREE.Vector3(0.984, 0.573, 0.235), // #fb923c (orange-400) arancione brillante
          color2: new THREE.Vector3(0.8, 0.175, 0.175)    // Rosso puro del cubo (medio range)
        }
      case 'pricing':
        // Rainbow colors (cycling through spectrum)
        const time = Date.now() * 0.001
        return {
          color1: new THREE.Vector3(
            Math.sin(time * 0.5 + 0) * 0.5 + 0.5,
            Math.sin(time * 0.5 + 2) * 0.5 + 0.5,
            Math.sin(time * 0.5 + 4) * 0.5 + 0.5
          ),
          color2: new THREE.Vector3(
            Math.sin(time * 0.5 + 1) * 0.5 + 0.5,
            Math.sin(time * 0.5 + 3) * 0.5 + 0.5,
            Math.sin(time * 0.5 + 5) * 0.5 + 0.5
          )
        }
      case 'demo':
        // Warning to Primary colors - matching new Demo section theme
        return {
          color1: new THREE.Vector3(0.984, 0.710, 0.235), // #fbb565 (warning-400) giallo-arancione
          color2: new THREE.Vector3(0.463, 0.710, 0.984)  // #76b5f7 (primary-400) blu brillante
        }
      default:
        return {
          color1: new THREE.Vector3(0.894, 0.220, 0.220),
          color2: new THREE.Vector3(0.125, 0.369, 0.369)
        }
    }
  }

  useEffect(() => {
    if (!mountRef.current) return

    loggers.sphere.info('Inizializzazione BackgroundSphere con DELTA TIME + REFRESH RATE')

    // Scene setup
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    )
    
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true, 
      antialias: !isMobile // Disable antialiasing on mobile for performance
    })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setClearColor(0x000000, 0)
    
    // Create sphere geometry
    const geometry = new THREE.SphereGeometry(
      isMobile ? 1 : 1.5, // Much smaller - was 2:3
      isMobile ? 32 : 64, // Lower quality on mobile
      isMobile ? 16 : 32
    )
    
    // 🎯 SHADER CON COLORI DINAMICI
    const vertexShader = `
      varying vec3 vPosition;
      varying vec3 vNormal;
      
      void main() {
        vPosition = position;
        vNormal = normalize(normalMatrix * normal);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `
    
    const fragmentShader = `
      uniform float time;
      uniform vec3 color1;
      uniform vec3 color2;
      varying vec3 vPosition;
      varying vec3 vNormal;
      
      void main() {
        // Create gradient based on position and time
        float gradient = (sin(vPosition.y * 2.0 + time * 0.5) + 1.0) * 0.5;
        vec3 finalColor = mix(color1, color2, gradient);
        
        // Add some glow effect
        float fresnel = pow(1.0 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
        finalColor += fresnel * 0.3;
        
        gl_FragColor = vec4(finalColor, 0.8);
      }
    `
    
    // 🎨 MATERIALE CON UNIFORMS DINAMICI
    const initialColors = getSectionColors('hero')
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        time: { value: 0 },
        color1: { value: initialColors.color1 },
        color2: { value: initialColors.color2 }
      },
      transparent: true,
      side: THREE.DoubleSide
    })
    
    // Create sphere mesh
    const sphere = new THREE.Mesh(geometry, material)
    sphere.position.set(0, 0, -8) // Further back - was -5
    scene.add(sphere)
    
    // Position camera
    camera.position.z = 5
    
    // Add canvas to DOM
    mountRef.current.appendChild(renderer.domElement)
    
    // Store refs
    sceneRef.current = scene
    rendererRef.current = renderer
    sphereRef.current = sphere
    
    // 🔄 SETUP SCROLL TRIGGERS PER CAMBIARE COLORI
    setTimeout(() => {
      setupSectionColorTriggers(material)
    }, 1000)
    
    // ⚡ ANIMATION LOOP CON DELTA TIME
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate)
      
      // 📊 CALCOLA DELTA TIME E RILEVA REFRESH RATE
      const deltaTime = calculateDeltaTime()
      const timeMultiplier = getTimeMultiplier()
      detectRefreshRate()
      
      if (sphere && material.uniforms) {
        // ✅ ROTAZIONE ADATTIVA CON DELTA TIME
        const rotationSpeedX = 0.005 * timeMultiplier
        const rotationSpeedY = 0.01 * timeMultiplier
        
        sphere.rotation.x += rotationSpeedX
        sphere.rotation.y += rotationSpeedY
        
        // ✅ UPDATE TIME UNIFORM CON DELTA TIME (NORMALIZZATO)
        const timeIncrement = (deltaTime / 1000) * 0.5 // Normalizzato per essere indipendente dal FPS
        material.uniforms.time.value += timeIncrement
        
        // 🌈 AGGIORNA COLORI ARCOBALENO per pricing section
        if (currentSection === 'pricing') {
          const rainbowColors = getSectionColors('pricing')
          material.uniforms.color1.value.copy(rainbowColors.color1)
          material.uniforms.color2.value.copy(rainbowColors.color2)
        }
      }
      
      renderer.render(scene, camera)
    }
    animate()
    
    // Handle resize
    const handleResize = () => {
      if (!camera || !renderer) return
      
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
    
    window.addEventListener('resize', handleResize)
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize)
      
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current)
      }
      
      // Cleanup scroll triggers
      if (ScrollTrigger) {
        scrollTriggersRef.current.forEach(trigger => trigger.kill())
        scrollTriggersRef.current = []
      }
      
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement)
      }
      
      // Dispose resources
      geometry.dispose()
      material.dispose()
      renderer.dispose()
    }
  }, [isMobile])

  // 🔄 SETUP SCROLL TRIGGERS per cambiare colori in base alla sezione
  const setupSectionColorTriggers = (material: THREE.ShaderMaterial) => {
    if (!ScrollTrigger || typeof window === 'undefined') {
      setTimeout(() => setupSectionColorTriggers(material), 500)
      return
    }

    loggers.sphere.debug('Setup scroll triggers per colori BackgroundSphere')

    const sections = [
      { id: 'hero', name: 'hero' },
      { id: 'features', name: 'features' },
      { id: 'packages', name: 'packages' },
      { id: 'pricing', name: 'pricing' },
      { id: 'demo', name: 'demo' }
    ]

    sections.forEach((section, index) => {
      // ⬇️ SCROLL DOWN: Entri nella sezione al 20%
      const downTrigger = ScrollTrigger.create({
        trigger: `#${section.id}`,
        start: "top 20%",
        end: "bottom 100%",
        onEnter: () => {
          loggers.sphere.debug(`Cambiando colori per ${section.name}`)
          changeColors(material, section.name)
          setCurrentSection(section.name)
        },
        id: `sphere-${section.id}-down`
      })

      // ⬆️ SCROLL UP: Esci dalla sezione al 60% → sezione precedente
      if (index > 0) {
        const prevSection = sections[index - 1]
        const upTrigger = ScrollTrigger.create({
          trigger: `#${section.id}`,
          start: "top 60%",
          end: "top 20%",
          onLeaveBack: () => {
            loggers.sphere.debug(`Ritornando a colori ${prevSection.name}`)
            changeColors(material, prevSection.name)
            setCurrentSection(prevSection.name)
          },
          id: `sphere-${section.id}-up`
        })
        
        scrollTriggersRef.current.push(upTrigger)
      }

      scrollTriggersRef.current.push(downTrigger)
    })

    loggers.sphere.info(`${scrollTriggersRef.current.length} color triggers creati`)
  }

  // 🎨 FUNZIONE PER CAMBIARE COLORI CON TRANSIZIONE FLUIDA
  const changeColors = (material: THREE.ShaderMaterial, section: string) => {
    const newColors = getSectionColors(section)
    
    // 🎭 TRANSIZIONE FLUIDA CON GSAP
    gsap.to(material.uniforms.color1.value, {
      duration: 1.5,
      x: newColors.color1.x,
      y: newColors.color1.y,
      z: newColors.color1.z,
      ease: "power3.inOut"
    })
    
    gsap.to(material.uniforms.color2.value, {
      duration: 1.5,
      x: newColors.color2.x,
      y: newColors.color2.y,
      z: newColors.color2.z,
      ease: "power3.inOut"
    })
  }

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 pointer-events-none"
      style={{
        zIndex: -2, // Behind particles but above background
        opacity: 0.3 // Much more subtle - was 0.6
      }}
    />
  )
}