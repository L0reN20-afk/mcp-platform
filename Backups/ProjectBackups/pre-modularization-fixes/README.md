# 🚀 MCP Platform - Sito Web Moderno

Un sito web moderno e accattivante per la MCP Platform con animazioni 3D avanzate, background particellari e design professionale.

## ✨ Caratteristiche Principali

### 🎨 Design Moderno
- **Background 3D Interattivo**: Sistema particellare Three.js con 5 forme geometriche complesse
- **Animazioni Fluide**: GSAP + Framer Motion con easings dedicati
- **Design Responsive**: Ottimizzato per desktop, tablet e mobile
- **Glassmorphism & Gradients**: Effetti visivi moderni e accattivanti

### 🌟 Sezioni del Sito

1. **Hero Section** - Sfera rotante 3D con typewriter effect
2. **Features Section** - Toro 3D con presentazione server MCP
3. **Packages Section** - Cubo 3D con sistema di selezione interattivo  
4. **Pricing Section** - Dodecaedro 3D con piani di abbonamento
5. **Demo Section** - Icosaedro 3D con editor di codice simulato
6. **CTA Section** - Call-to-action con elementi di urgency
7. **Footer** - Footer completo con newsletter e link social

### 🔧 Stack Tecnologico

- **Framework**: Next.js 14 + TypeScript + App Router
- **Styling**: Tailwind CSS con colori personalizzati
- **Animazioni**: GSAP (scroll-triggered) + Framer Motion (React)
- **3D Graphics**: Three.js per background particellari
- **Icons**: Lucide React
- **Performance**: SSR ottimizzato con Next.js

### 🎯 Background 3D Particellare

Ogni sezione ha un background 3D unico con particelle che formano geometrie complesse:

- **HOME**: Sfera (2000+ particelle blu) - Distribuzione Fibonacci
- **FEATURES**: Toro (3000+ particelle viola) - Wave animation  
- **PACKAGES**: Cubo (2500+ particelle cyan) - Spiral effect
- **PRICING**: Dodecaedro (1800+ particelle verdi) - Breathing effect
- **DEMO**: Icosaedro (2200+ particelle arancioni) - Float animation

**Effetti di Transizione:**
- Esplosione: Forma attuale scala a 0.1 con rotazione
- Implosione: Nuova forma da 0.1 a 1 con bounce
- Morphing: Cambio coordinate particelle in real-time

## 📦 Installazione e Setup

### 1. Installa le dipendenze:
```bash
npm install
```

### 2. Avvia il server di sviluppo:
```bash
npm run dev
```

### 3. Apri il browser su:
```
http://localhost:3000
```

## 🚀 Comandi Disponibili

```bash
# Sviluppo
npm run dev

# Build di produzione
npm run build

# Avvia build di produzione
npm run start

# Linting
npm run lint
```

## 🎨 Personalizzazione

### Colori del Brand
I colori sono definiti in `tailwind.config.ts`:

```typescript
colors: {
  primary: { ... },    // Blu - per VS Code Server
  secondary: { ... },  // Viola - per Visual Studio
  accent: { ... },     // Cyan - per Word Server  
  success: { ... },    // Verde - per Filesystem
  warning: { ... }     // Arancione - per Demo
}
```

### Animazioni
- **GSAP**: Usato per animazioni scroll-triggered, morphing 3D
- **Framer Motion**: Usato per transizioni React, hover effects
- **Three.js**: Sistema particellare e forme 3D

### Background 3D
Modifica le forme in `ParticleBackground.tsx`:
- `generateSpherePositions()` - Per la sfera HOME
- `generateTorusPositions()` - Per il toro FEATURES  
- `generateCubePositions()` - Per il cubo PACKAGES
- E così via...

## 📱 Responsività

Il sito è completamente responsive con breakpoints:
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px  
- **Desktop**: > 1024px

## ⚡ Performance

- **SSR**: Server-Side Rendering con Next.js
- **Code Splitting**: Caricamento lazy dei componenti
- **Image Optimization**: Next.js Image component
- **3D Optimization**: Gestione efficiente delle particelle Three.js

## 🔒 Best Practices

- **TypeScript**: Type safety completo
- **ESLint**: Linting automatico
- **Accessibility**: ARIA labels e semantic HTML
- **SEO**: Meta tags ottimizzati

## 📝 Struttura Progetto

```
src/
├── app/                 # Next.js App Router
├── components/          
│   ├── 3d/             # Componenti Three.js
│   ├── sections/       # Sezioni del sito
│   └── ui/             # Componenti UI riutilizzabili
└── lib/                # Utilities e configurazioni
    └── animations.ts   # Setup animazioni GSAP
```

## 🤝 Contributi

Il progetto è stato sviluppato seguendo le specifiche esatte del prompt:
- ✅ Background 3D particellare con 5 forme geometriche
- ✅ Animazioni GSAP + Framer Motion separate  
- ✅ Design moderno con contrasto ottimizzato
- ✅ Performance elevate e controllo totale del codice
- ✅ Stack tecnologico richiesto (Next.js 14 + TypeScript + Tailwind)

## 📞 Supporto

Per assistenza tecnica o personalizzazioni:
- Email: support@mcpplatform.com
- Discord: [MCP Platform Community]
- Documentazione: [docs.mcpplatform.com]

---

**Sviluppato con ❤️ per MCP Platform**

*Automazione professionale per sviluppatori moderni*
