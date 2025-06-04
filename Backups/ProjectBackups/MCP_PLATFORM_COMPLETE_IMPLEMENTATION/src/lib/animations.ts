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

  // Now we can safely use ScrollTrigger
  ScrollTrigger.refresh()

  console.log('✅ GSAP animations inizializzate (solo ScrollTrigger per particelle 3D)')

  /* 
  🚧 ANIMAZIONI DOM TEMPORANEAMENTE DISABILITATE
  Queste animazioni cercano elementi CSS che non esistono nei componenti attuali
  Saranno riabilitate quando aggiungeremo le classi CSS corrette
  
  // Hero section animations
  gsap.fromTo('.hero-title', 
    { 
      opacity: 0, 
      y: 50,
      scale: 0.8
    },
    {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 1.2,
      ease: "power3.out",
      delay: 0.2
    }
  )

  gsap.fromTo('.hero-subtitle', 
    { 
      opacity: 0, 
      y: 30 
    },
    {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: "power2.out",
      delay: 0.6
    }
  )

  gsap.fromTo('.hero-cta', 
    { 
      opacity: 0, 
      y: 30,
      scale: 0.9
    },
    {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.8,
      ease: "back.out(1.7)",
      delay: 1
    }
  )

  gsap.fromTo('.hero-stats', 
    { 
      opacity: 0, 
      y: 40
    },
    {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: "power2.out",
      delay: 1.2,
      stagger: 0.1
    }
  )

  // Section fade-in animations
  gsap.utils.toArray('.section-container').forEach((section: any) => {
    gsap.fromTo(section.querySelectorAll('.fade-in'), 
      {
        opacity: 0,
        y: 60
      },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power2.out",
        stagger: 0.2,
        scrollTrigger: {
          trigger: section,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse"
        }
      }
    )
  })

  // Cards stagger animation
  gsap.utils.toArray('.card-container').forEach((container: any) => {
    gsap.fromTo(container.querySelectorAll('.card-item'), 
      {
        opacity: 0,
        y: 50,
        scale: 0.9
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        ease: "back.out(1.7)",
        stagger: 0.15,
        scrollTrigger: {
          trigger: container,
          start: "top 75%",
          end: "bottom 25%",
          toggleActions: "play none none reverse"
        }
      }
    )
  })

  // Feature icons animation
  gsap.utils.toArray('.feature-icon').forEach((icon: any) => {
    gsap.fromTo(icon, 
      {
        scale: 0,
        rotation: -180
      },
      {
        scale: 1,
        rotation: 0,
        duration: 0.8,
        ease: "back.out(2.7)",
        scrollTrigger: {
          trigger: icon,
          start: "top 85%",
          end: "bottom 15%",
          toggleActions: "play none none reverse"
        }
      }
    )
  })

  // Pricing cards special animation
  gsap.utils.toArray('.pricing-card').forEach((card: any, index: number) => {
    gsap.fromTo(card, 
      {
        opacity: 0,
        y: 80,
        rotationY: index % 2 === 0 ? -45 : 45
      },
      {
        opacity: 1,
        y: 0,
        rotationY: 0,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: card,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse"
        }
      }
    )
  })

  // Typewriter effect for demo section
  gsap.utils.toArray('.typewriter-text').forEach((element: any) => {
    const text = element.textContent
    element.textContent = ''
    
    ScrollTrigger.create({
      trigger: element,
      start: "top 80%",
      onEnter: () => {
        gsap.to(element, {
          duration: text.length * 0.05,
          ease: "none",
          onUpdate: function() {
            const progress = this.progress()
            const currentLength = Math.floor(progress * text.length)
            element.textContent = text.slice(0, currentLength)
          }
        })
      }
    })
  })

  // Parallax effects for sections
  gsap.utils.toArray('.parallax-element').forEach((element: any) => {
    gsap.to(element, {
      yPercent: -50,
      ease: "none",
      scrollTrigger: {
        trigger: element,
        start: "top bottom",
        end: "bottom top",
        scrub: true
      }
    })
  })

  // Counter animations
  gsap.utils.toArray('.counter').forEach((counter: any) => {
    const target = parseInt(counter.dataset.target)
    const suffix = counter.dataset.suffix || ''
    
    ScrollTrigger.create({
      trigger: counter,
      start: "top 80%",
      onEnter: () => {
        gsap.from(counter, {
          duration: 2,
          ease: "power2.out",
          onUpdate: function() {
            const current = Math.floor(this.progress() * target)
            counter.textContent = current + suffix
          }
        })
      }
    })
  })

  // Magnetic effect for buttons
  gsap.utils.toArray('.magnetic-button').forEach((button: any) => {
    const magnetStrength = 0.3

    button.addEventListener('mousemove', (e: MouseEvent) => {
      const rect = button.getBoundingClientRect()
      const x = e.clientX - rect.left - rect.width / 2
      const y = e.clientY - rect.top - rect.height / 2
      
      gsap.to(button, {
        x: x * magnetStrength,
        y: y * magnetStrength,
        duration: 0.3,
        ease: "power2.out"
      })
    })

    button.addEventListener('mouseleave', () => {
      gsap.to(button, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: "power2.out"
      })
    })
  })

  // Scroll progress indicator
  gsap.to('.scroll-progress', {
    scaleX: 1,
    ease: "none",
    scrollTrigger: {
      trigger: "body",
      start: "top top",
      end: "bottom bottom",
      scrub: true
    }
  })

  // Text reveal animations
  gsap.utils.toArray('.text-reveal').forEach((text: any) => {
    gsap.fromTo(text, 
      {
        clipPath: "inset(0 100% 0 0)"
      },
      {
        clipPath: "inset(0 0% 0 0)",
        duration: 1.5,
        ease: "power2.inOut",
        scrollTrigger: {
          trigger: text,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse"
        }
      }
    )
  })
  */
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