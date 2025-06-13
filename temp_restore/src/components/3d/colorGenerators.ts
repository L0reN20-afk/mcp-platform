import { COLOR_PALETTES } from './constants'
import { getColorVividnessBoost, getColorSaturationBoost, getColorBrightnessBoost } from './utils'

// 🌈 GENERATORI DI COLORI - Sistema di colorazione dinamica con correzione Windows (vividezza +15%, saturazione +15%)

// 🔴🟢 COLORI BRAND BUILDMYTH (Hero Section) - Rosso #e43838 e Verde #205e5e
export function generateBrandColors(colors: Float32Array, count: number) {
  const vividnessBoost = getColorVividnessBoost()
  const saturationBoost = getColorSaturationBoost() 
  const brightnessBoost = getColorBrightnessBoost()
  
  // Colori del brand in RGB normalizzato
  const brandRed = { r: 0.894, g: 0.220, b: 0.220 }    // #e43838
  const brandGreen = { r: 0.125, g: 0.369, b: 0.369 }  // #205e5e
  
  for (let i = 0; i < count; i++) {
    // 50% rosso, 50% verde scuro con variazioni casuali
    const useBrandRed = Math.random() > 0.5
    const variation = 0.85 + Math.random() * 0.3 // Variazione 85%-115%
    
    let r, g, b
    if (useBrandRed) {
      r = brandRed.r * variation
      g = brandRed.g * variation 
      b = brandRed.b * variation
    } else {
      r = brandGreen.r * variation
      g = brandGreen.g * variation
      b = brandGreen.b * variation
    }
    
    // Applicazione correzione Windows
    r = Math.min(1.0, r * brightnessBoost * saturationBoost * vividnessBoost)
    g = Math.min(1.0, g * brightnessBoost * saturationBoost * vividnessBoost) 
    b = Math.min(1.0, b * brightnessBoost * saturationBoost * vividnessBoost)
    
    colors[i * 3] = r      // R
    colors[i * 3 + 1] = g  // G
    colors[i * 3 + 2] = b  // B
  }
}

// 🔵 COLORI BLU (Hero Section) - con correzione Windows (vividezza +15%, saturazione +15%)
export function generateBlueColors(colors: Float32Array, count: number) {
  const palette = COLOR_PALETTES.hero
  const vividnessBoost = getColorVividnessBoost() // +15% su Windows
  const saturationBoost = getColorSaturationBoost() // +15% su Windows
  const brightnessBoost = getColorBrightnessBoost() // Nessun boost (sempre 1.0)
  
  for (let i = 0; i < count; i++) {
    let r = palette.r[0] + Math.random() * (palette.r[1] - palette.r[0])
    let g = palette.g[0] + Math.random() * (palette.g[1] - palette.g[0]) 
    let b = palette.b[0] + Math.random() * (palette.b[1] - palette.b[0])
    
    // Applicazione correzione Windows (solo vividezza e saturazione)
    r = Math.min(1.0, r * brightnessBoost * saturationBoost * vividnessBoost)
    g = Math.min(1.0, g * brightnessBoost * saturationBoost * vividnessBoost) 
    b = Math.min(1.0, b * brightnessBoost * saturationBoost * vividnessBoost)
    
    colors[i * 3] = r      // R
    colors[i * 3 + 1] = g  // G
    colors[i * 3 + 2] = b  // B
  }
}

// 🟣 COLORI VIOLA-CYAN (Features Section) - GRADIENTE "Professionali" - con correzione Windows (vividezza +15%, saturazione +15%)
export function generatePurpleColors(colors: Float32Array, count: number) {
  const vividnessBoost = getColorVividnessBoost() // +15% su Windows
  const saturationBoost = getColorSaturationBoost() // +15% su Windows
  const brightnessBoost = getColorBrightnessBoost() // Nessun boost (sempre 1.0)
  
  // 🎨 SOLO VIOLA INTENSO ORIGINALE per massima spettacolarità
  const violaIntenso = { 
    r: [0.6, 0.9],    // R: 0.6-0.9 (originale)
    g: [0.2, 0.5],    // G: 0.2-0.5 (originale)
    b: [0.8, 1.0]     // B: 0.8-1.0 (originale)
  }
  
  for (let i = 0; i < count; i++) {
    const variation = 0.85 + Math.random() * 0.3 // Variazione 85%-115%
    
    // Solo viola intenso originale con range completo
    let r = (violaIntenso.r[0] + Math.random() * (violaIntenso.r[1] - violaIntenso.r[0])) * variation
    let g = (violaIntenso.g[0] + Math.random() * (violaIntenso.g[1] - violaIntenso.g[0])) * variation
    let b = (violaIntenso.b[0] + Math.random() * (violaIntenso.b[1] - violaIntenso.b[0])) * variation
    
    // Applicazione correzione Windows (solo vividezza e saturazione)
    r = Math.min(1.0, r * brightnessBoost * saturationBoost * vividnessBoost)
    g = Math.min(1.0, g * brightnessBoost * saturationBoost * vividnessBoost) 
    b = Math.min(1.0, b * brightnessBoost * saturationBoost * vividnessBoost)
    
    colors[i * 3] = r      // R
    colors[i * 3 + 1] = g  // G
    colors[i * 3 + 2] = b  // B
  }
}

// 🔷 COLORI ARANCIONE-ROSSO (Packages Section) - GRADIENTE "Piano Perfetto" - con correzione Windows (vividezza +15%, saturazione +15%)
export function generateCyanColors(colors: Float32Array, count: number) {
  const vividnessBoost = getColorVividnessBoost() // +15% su Windows
  const saturationBoost = getColorSaturationBoost() // +15% su Windows
  const brightnessBoost = getColorBrightnessBoost() // Nessun boost (sempre 1.0)
  
  // 🎨 ROSSO PURO MENO INTENSO - equilibrato e naturale
  const rossoPuro = { 
    r: [0.7, 0.9],    // R: 0.7-0.9 (alto ma non estremo)
    g: [0.1, 0.25],   // G: 0.1-0.25 (molto basso per purezza)
    b: [0.1, 0.25]    // B: 0.1-0.25 (molto basso per purezza)
  }
  
  for (let i = 0; i < count; i++) {
    const variation = 0.95 + Math.random() * 0.1 // Variazione 95%-105% (più sottile)
    
    // Rosso puro con range completo
    let r = (rossoPuro.r[0] + Math.random() * (rossoPuro.r[1] - rossoPuro.r[0])) * variation
    let g = (rossoPuro.g[0] + Math.random() * (rossoPuro.g[1] - rossoPuro.g[0])) * variation
    let b = (rossoPuro.b[0] + Math.random() * (rossoPuro.b[1] - rossoPuro.b[0])) * variation
    
    // Applicazione correzione Windows (solo vividezza e saturazione)
    r = Math.min(1.0, r * brightnessBoost * saturationBoost * vividnessBoost)
    g = Math.min(1.0, g * brightnessBoost * saturationBoost * vividnessBoost) 
    b = Math.min(1.0, b * brightnessBoost * saturationBoost * vividnessBoost)
    
    colors[i * 3] = r      // R
    colors[i * 3 + 1] = g  // G
    colors[i * 3 + 2] = b  // B
  }
}

// 🟢 COLORI VERDI (Success/General) - con correzione Windows (vividezza +15%, saturazione +15%)
export function generateGreenColors(colors: Float32Array, count: number) {
  const vividnessBoost = getColorVividnessBoost() // +15% su Windows
  const saturationBoost = getColorSaturationBoost() // +15% su Windows
  const brightnessBoost = getColorBrightnessBoost() // Nessun boost (sempre 1.0)
  
  for (let i = 0; i < count; i++) {
    let r = 0.1 + Math.random() * 0.3     // R
    let g = 0.7 + Math.random() * 0.3     // G
    let b = 0.2 + Math.random() * 0.3     // B
    
    // Applicazione correzione Windows (solo vividezza e saturazione)
    r = Math.min(1.0, r * brightnessBoost * saturationBoost * vividnessBoost)
    g = Math.min(1.0, g * brightnessBoost * saturationBoost * vividnessBoost) 
    b = Math.min(1.0, b * brightnessBoost * saturationBoost * vividnessBoost)
    
    colors[i * 3] = r      // R
    colors[i * 3 + 1] = g  // G
    colors[i * 3 + 2] = b  // B
  }
}

// 🧬 COLORI DNA (Demo Section) - Verde-blu bio-tech con correzione Windows (vividezza +15%, saturazione +15%)
export function generateDNAColors(colors: Float32Array, count: number) {
  const { helix1, helix2 } = COLOR_PALETTES.demo
  const vividnessBoost = getColorVividnessBoost() // +15% su Windows
  const saturationBoost = getColorSaturationBoost() // +15% su Windows
  const brightnessBoost = getColorBrightnessBoost() // Nessun boost (sempre 1.0)
  
  // 🧬 NUOVA LOGICA: Prima metà = Spirale 1 (Verde), Seconda metà = Spirale 2 (Blu)
  const halfCount = Math.floor(count / 2)
  
  for (let i = 0; i < count; i++) {
    // ✅ Determinazione spirale basata su posizione nell'array (non modulo)
    const isFirstHelix = i < halfCount
    
    if (isFirstHelix) {
      // 🟢 PRIMA SPIRALE TUBOLARE: Verde Bio Brillante
      let r = helix1.r[0] + Math.random() * (helix1.r[1] - helix1.r[0])
      let g = helix1.g[0] + Math.random() * (helix1.g[1] - helix1.g[0]) 
      let b = helix1.b[0] + Math.random() * (helix1.b[1] - helix1.b[0])
      
      // Applicazione correzione Windows (solo vividezza e saturazione)
      r = Math.min(1.0, r * brightnessBoost * saturationBoost * vividnessBoost)
      g = Math.min(1.0, g * brightnessBoost * saturationBoost * vividnessBoost) 
      b = Math.min(1.0, b * brightnessBoost * saturationBoost * vividnessBoost)
      
      colors[i * 3] = r      // R
      colors[i * 3 + 1] = g  // G
      colors[i * 3 + 2] = b  // B
    } else {
      // 🔵 SECONDA SPIRALE TUBOLARE: Blu Tech Brillante
      let r = helix2.r[0] + Math.random() * (helix2.r[1] - helix2.r[0])
      let g = helix2.g[0] + Math.random() * (helix2.g[1] - helix2.g[0]) 
      let b = helix2.b[0] + Math.random() * (helix2.b[1] - helix2.b[0])
      
      // Applicazione correzione Windows (solo vividezza e saturazione)
      r = Math.min(1.0, r * brightnessBoost * saturationBoost * vividnessBoost)
      g = Math.min(1.0, g * brightnessBoost * saturationBoost * vividnessBoost) 
      b = Math.min(1.0, b * brightnessBoost * saturationBoost * vividnessBoost)
      
      colors[i * 3] = r      // R
      colors[i * 3 + 1] = g  // G
      colors[i * 3 + 2] = b  // B
    }
  }
}

// 🟠 COLORI ARANCIONI (Warning/Demo) - con correzione Windows (vividezza +15%, saturazione +15%)
export function generateOrangeColors(colors: Float32Array, count: number) {
  const vividnessBoost = getColorVividnessBoost() // +15% su Windows
  const saturationBoost = getColorSaturationBoost() // +15% su Windows
  const brightnessBoost = getColorBrightnessBoost() // Nessun boost (sempre 1.0)
  
  for (let i = 0; i < count; i++) {
    let r = 0.9 + Math.random() * 0.1     // R
    let g = 0.5 + Math.random() * 0.3     // G
    let b = 0.1 + Math.random() * 0.2     // B
    
    // Applicazione correzione Windows (solo vividezza e saturazione)
    r = Math.min(1.0, r * brightnessBoost * saturationBoost * vividnessBoost)
    g = Math.min(1.0, g * brightnessBoost * saturationBoost * vividnessBoost) 
    b = Math.min(1.0, b * brightnessBoost * saturationBoost * vividnessBoost)
    
    colors[i * 3] = r      // R
    colors[i * 3 + 1] = g  // G
    colors[i * 3 + 2] = b  // B
  }
}

// 🌈 COLORI ARCOBALENO (Pricing Section - Figura Morfante) - con correzione Windows (vividezza +15%, saturazione +15%)
export function generateRainbowColors(colors: Float32Array, count: number) {
  const vividnessBoost = getColorVividnessBoost() // +15% su Windows
  const saturationBoost = getColorSaturationBoost() // +15% su Windows
  const brightnessBoost = getColorBrightnessBoost() // Nessun boost (sempre 1.0)
  
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
    
    // Applicazione correzione Windows (solo vividezza e saturazione)
    r = Math.min(1.0, (r + m) * brightnessBoost * saturationBoost * vividnessBoost)
    g = Math.min(1.0, (g + m) * brightnessBoost * saturationBoost * vividnessBoost) 
    b = Math.min(1.0, (b + m) * brightnessBoost * saturationBoost * vividnessBoost)
    
    colors[i * 3] = r      // R
    colors[i * 3 + 1] = g  // G  
    colors[i * 3 + 2] = b  // B
  }
}

// 🎯 GENERATORE UNIVERSALE DI COLORI
export function generateColorsForShape(shape: string, colors: Float32Array, count: number) {
  switch(shape) {
    case 'hero':
      generateBrandColors(colors, count)  // Usa i colori del brand
      break
    case 'features':
      generatePurpleColors(colors, count)
      break
    case 'packages':
      generateCyanColors(colors, count)
      break
    case 'pricing':
      generateRainbowColors(colors, count)
      break
    case 'demo':
      generateDNAColors(colors, count)
      break
    default:
      generateBrandColors(colors, count)  // Default ai colori del brand
  }
}

// 🎯 GENERATORE UNIVERSALE CON SUPPORTO MOBILE - STESSI COLORI DESKTOP
export function generateColorsForShapeWithMobile(shape: string, colors: Float32Array, count: number) {
  // 🖥️📱 USA SEMPRE I COLORI DESKTOP per mantenere la coerenza visiva
  // Solo le ottimizzazioni del materiale particelle cambiano su mobile
  generateColorsForShape(shape, colors, count)
}