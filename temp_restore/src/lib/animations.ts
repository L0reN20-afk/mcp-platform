import { gsap } from 'gsap'

// Function to load and register ScrollTrigger
async function loadScrollTrigger() {
  if (typeof window !== 'undefined') {
    const { ScrollTrigger } = await import('gsap/ScrollTrigger')
    gsap.registerPlugin(ScrollTrigger)
    return ScrollTrigger
  }
  return null
}

export async function initializeScrollAnimations() {
  // Load ScrollTrigger first
  const ScrollTrigger = await loadScrollTrigger()
  
  if (!ScrollTrigger) {
    console.warn('ScrollTrigger not available on server side')
    return
  }

  // Refresh ScrollTrigger for 3D particle effects
  ScrollTrigger.refresh()

  console.log('✅ GSAP animations inizializzate (ScrollTrigger per particelle 3D)')
}

export function animatePageTransition() {
  const tl = gsap.timeline()
  
  tl.to('.page-transition', {
    scaleY: 1,
    duration: 0.5,
    ease: "power2.inOut",
    transformOrigin: "top"
  })
  .to('.page-transition', {
    scaleY: 0,
    duration: 0.5,
    ease: "power2.inOut",
    transformOrigin: "bottom",
    delay: 0.2
  })
  
  return tl
}

export function createHoverEffect(element: HTMLElement) {
  const hoverTl = gsap.timeline({ paused: true })
  
  hoverTl.to(element, {
    scale: 1.05,
    duration: 0.3,
    ease: "power2.out"
  })
  .to(element.querySelector('.hover-overlay'), {
    opacity: 1,
    duration: 0.3,
    ease: "power2.out"
  }, 0)
  
  element.addEventListener('mouseenter', () => hoverTl.play())
  element.addEventListener('mouseleave', () => hoverTl.reverse())
  
  return hoverTl
}

export function morphingShapeAnimation(element: HTMLElement, shapes: string[]) {
  const tl = gsap.timeline({ repeat: -1 })
  
  shapes.forEach((shape, index) => {
    tl.to(element, {
      clipPath: shape,
      duration: 2,
      ease: "power2.inOut",
      delay: index === 0 ? 0 : 1
    })
  })
  
  return tl
}