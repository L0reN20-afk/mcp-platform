import { COLOR_PALETTES } from './constants'
import { getColorSaturationBoost, getColorBrightnessBoost } from './utils'

// 🌈 GENERATORI DI COLORI - Sistema di colorazione dinamica con correzione Windows

// 🔵 COLORI BLU (Hero Section) - con correzione Windows
export function generateBlueColors(colors: Float32Array, count: number) {
  const palette = COLOR_PALETTES.hero
  const saturationBoost = getColorSaturationBoost() // +25% su Windows
  const brightnessBoost = getColorBrightnessBoost() // +15% su Windows
  
  for (let i = 0; i < count; i++) {
    let r = palette.r[0] + Math.random() * (palette.r[1] - palette.r[0])
    let g = palette.g[0] + Math.random() * (palette.g[1] - palette.g[0]) 
    let b = palette.b[0] + Math.random() * (palette.b[1] - palette.b[0])
    
    // Applicazione correzione Windows
    r = Math.min(1.0, r * brightnessBoost * saturationBoost)
    g = Math.min(1.0, g * brightnessBoost * saturationBoost) 
    b = Math.min(1.0, b * brightnessBoost * saturationBoost)
    
    colors[i * 3] = r      // R
    colors[i * 3 + 1] = g  // G
    colors[i * 3 + 2] = b  // B
  }
}

// 🟣 COLORI VIOLA (Features Section) - con correzione Windows
export function generatePurpleColors(colors: Float32Array, count: number) {
  const palette = COLOR_PALETTES.features
  const saturationBoost = getColorSaturationBoost() // +25% su Windows
  const brightnessBoost = getColorBrightnessBoost() // +15% su Windows
  
  for (let i = 0; i < count; i++) {
    let r = palette.r[0] + Math.random() * (palette.r[1] - palette.r[0])
    let g = palette.g[0] + Math.random() * (palette.g[1] - palette.g[0]) 
    let b = palette.b[0] + Math.random() * (palette.b[1] - palette.b[0])
    
    // Applicazione correzione Windows
    r = Math.min(1.0, r * brightnessBoost * saturationBoost)
    g = Math.min(1.0, g * brightnessBoost * saturationBoost) 
    b = Math.min(1.0, b * brightnessBoost * saturationBoost)
    
    colors[i * 3] = r      // R
    colors[i * 3 + 1] = g  // G
    colors[i * 3 + 2] = b  // B
  }
}

// 🔷 COLORI CYAN (Packages Section) - con correzione Windows
export function generateCyanColors(colors: Float32Array, count: number) {
  const palette = COLOR_PALETTES.packages
  const saturationBoost = getColorSaturationBoost() // +25% su Windows
  const brightnessBoost = getColorBrightnessBoost() // +15% su Windows
  
  for (let i = 0; i < count; i++) {
    let r = palette.r[0] + Math.random() * (palette.r[1] - palette.r[0])
    let g = palette.g[0] + Math.random() * (palette.g[1] - palette.g[0]) 
    let b = palette.b[0] + Math.random() * (palette.b[1] - palette.b[0])
    
    // Applicazione correzione Windows
    r = Math.min(1.0, r * brightnessBoost * saturationBoost)
    g = Math.min(1.0, g * brightnessBoost * saturationBoost) 
    b = Math.min(1.0, b * brightnessBoost * saturationBoost)
    
    colors[i * 3] = r      // R
    colors[i * 3 + 1] = g  // G
    colors[i * 3 + 2] = b  // B
  }
}

// 🟢 COLORI VERDI (Success/General)
export function generateGreenColors(colors: Float32Array, count: number) {
  for (let i = 0; i < count; i++) {
    colors[i * 3] = 0.1 + Math.random() * 0.3     // R
    colors[i * 3 + 1] = 0.7 + Math.random() * 0.3 // G
    colors[i * 3 + 2] = 0.2 + Math.random() * 0.3 // B
  }
}

// 🧬 COLORI DNA (Demo Section) - Verde-blu bio-tech con correzione Windows
export function generateDNAColors(colors: Float32Array, count: number) {
  const { helix1, helix2 } = COLOR_PALETTES.demo
  const saturationBoost = getColorSaturationBoost() // +25% su Windows
  const brightnessBoost = getColorBrightnessBoost() // +15% su Windows
  
  for (let i = 0; i < count; i++) {
    // Alterna tra due colori per le due eliche
    const isFirstHelix = i % 2 === 0
    
    if (isFirstHelix) {
      // Prima elica: Verde bio
      let r = helix1.r[0] + Math.random() * (helix1.r[1] - helix1.r[0])
      let g = helix1.g[0] + Math.random() * (helix1.g[1] - helix1.g[0]) 
      let b = helix1.b[0] + Math.random() * (helix1.b[1] - helix1.b[0])
      
      // Applicazione correzione Windows
      r = Math.min(1.0, r * brightnessBoost * saturationBoost)
      g = Math.min(1.0, g * brightnessBoost * saturationBoost) 
      b = Math.min(1.0, b * brightnessBoost * saturationBoost)
      
      colors[i * 3] = r      // R
      colors[i * 3 + 1] = g  // G
      colors[i * 3 + 2] = b  // B
    } else {
      // Seconda elica: Blu tech
      let r = helix2.r[0] + Math.random() * (helix2.r[1] - helix2.r[0])
      let g = helix2.g[0] + Math.random() * (helix2.g[1] - helix2.g[0]) 
      let b = helix2.b[0] + Math.random() * (helix2.b[1] - helix2.b[0])
      
      // Applicazione correzione Windows
      r = Math.min(1.0, r * brightnessBoost * saturationBoost)
      g = Math.min(1.0, g * brightnessBoost * saturationBoost) 
      b = Math.min(1.0, b * brightnessBoost * saturationBoost)
      
      colors[i * 3] = r      // R
      colors[i * 3 + 1] = g  // G
      colors[i * 3 + 2] = b  // B
    }
  }
}

// 🟠 COLORI ARANCIONI (Warning/Demo)
export function generateOrangeColors(colors: Float32Array, count: number) {
  for (let i = 0; i < count; i++) {
    colors[i * 3] = 0.9 + Math.random() * 0.1     // R
    colors[i * 3 + 1] = 0.5 + Math.random() * 0.3 // G
    colors[i * 3 + 2] = 0.1 + Math.random() * 0.2 // B
  }
}

// 🌈 COLORI ARCOBALENO (Pricing Section - Figura Morfante) - con correzione Windows
export function generateRainbowColors(colors: Float32Array, count: number) {
  const saturationBoost = getColorSaturationBoost() // +25% su Windows
  const brightnessBoost = getColorBrightnessBoost() // +15% su Windows
  
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
    
    // Applicazione correzione Windows
    r = Math.min(1.0, (r + m) * brightnessBoost * saturationBoost)
    g = Math.min(1.0, (g + m) * brightnessBoost * saturationBoost) 
    b = Math.min(1.0, (b + m) * brightnessBoost * saturationBoost)
    
    colors[i * 3] = r      // R
    colors[i * 3 + 1] = g  // G  
    colors[i * 3 + 2] = b  // B
  }
}

// 🎯 GENERATORE UNIVERSALE DI COLORI
export function generateColorsForShape(shape: string, colors: Float32Array, count: number) {
  switch(shape) {
    case 'hero':
      generateBlueColors(colors, count)
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
      generateBlueColors(colors, count)
  }
}

// 🎯 GENERATORE UNIVERSALE CON SUPPORTO MOBILE - STESSI COLORI DESKTOP
export function generateColorsForShapeWithMobile(shape: string, colors: Float32Array, count: number) {
  // 🖥️📱 USA SEMPRE I COLORI DESKTOP per mantenere la coerenza visiva
  // Solo le ottimizzazioni del materiale particelle cambiano su mobile
  generateColorsForShape(shape, colors, count)
}