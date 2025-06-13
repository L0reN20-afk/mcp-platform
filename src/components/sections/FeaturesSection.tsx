'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Code2, 
  FileCode, 
  FileText, 
  FolderOpen, 
  Zap, 
  CheckCircle, 
  ArrowRight,
  Cpu,
  Database,
  Globe
} from 'lucide-react'

interface MCPServer {
  id: string
  name: string
  icon: React.ComponentType<any>
  description: string
  features: string[]
  colorClass: string
  gradientClass: string
  buttonActiveClass: string
  borderClass: string // Nuovo: bordo sempre attivo
  cardBorderClass: string // Nuovo: bordo per la card
  stats: { label: string; value: string }[]
}

export default function FeaturesSection() {
  const [activeServer, setActiveServer] = useState(0)

  const mcpServers: MCPServer[] = [
    {
      id: 'vscode',
      name: 'VS Code Server',
      icon: Code2,
      description: 'Automazione completa di Visual Studio Code con controllo avanzato di editor, terminale e estensioni.',
      features: [
        'Controllo completo editor e workspace',
        'Gestione terminale con output real-time',
        'Automazione estensioni e configurazioni',
        'Backup automatico con versioning',
        'Gestione progetti e debugging'
      ],
      colorClass: 'text-primary-400',
      gradientClass: 'from-primary-600 to-primary-800',
      buttonActiveClass: 'border-primary-400 bg-primary-400/10 text-primary-400 backdrop-blur-lg',
      borderClass: 'border-primary-400 bg-primary-400/5 text-white backdrop-blur-lg', // Sempre attivo
      cardBorderClass: 'border-primary-400/60', // Bordo card
      stats: [
        { label: 'Response Time', value: '<500ms' },
        { label: 'Uptime', value: '99.9%' },
        { label: 'Commands', value: '50+' }
      ]
    },
    {
      id: 'visual-studio',
      name: 'Visual Studio 2022',
      icon: FileCode,
      description: 'Integrazione avanzata con Visual Studio 2022 per progetti .NET e sviluppo enterprise.',
      features: [
        'Gestione soluzioni e progetti .NET',
        'Controllo avanzato build e debugging',
        'Integrazione NuGet e pacchetti',
        'Automazione refactoring e testing',
        'Gestione repository e versioning'
      ],
      colorClass: 'text-secondary-400',
      gradientClass: 'from-secondary-600 to-secondary-800',
      buttonActiveClass: 'border-secondary-400 bg-secondary-400/10 text-secondary-400 backdrop-blur-lg',
      borderClass: 'border-secondary-400 bg-secondary-400/5 text-white backdrop-blur-lg', // Sempre attivo
      cardBorderClass: 'border-secondary-400/60', // Bordo card
      stats: [
        { label: 'Build Speed', value: '3x faster' },
        { label: 'Reliability', value: '99.8%' },
        { label: 'Integrations', value: '25+' }
      ]
    },
    {
      id: 'word',
      name: 'Word Server',
      icon: FileText,
      description: 'Controllo avanzato di Microsoft Word per automazione documenti, template e formattazione.',
      features: [
        'Manipolazione completa documenti Word',
        'Gestione template e stili avanzati',
        'Automazione tabelle e grafici',
        'Controllo formattazione e layout',
        'Export multi-formato (PDF, HTML, etc.)'
      ],
      colorClass: 'text-accent-400',
      gradientClass: 'from-accent-600 to-accent-800',
      buttonActiveClass: 'border-accent-400 bg-accent-400/10 text-accent-400 backdrop-blur-lg',
      borderClass: 'border-accent-400 bg-accent-400/5 text-white backdrop-blur-lg', // Sempre attivo
      cardBorderClass: 'border-accent-400/60', // Bordo card
      stats: [
        { label: 'Doc Processing', value: '1000+/hr' },
        { label: 'Accuracy', value: '99.9%' },
        { label: 'Formats', value: '15+' }
      ]
    },
    {
      id: 'filesystem',
      name: 'Filesystem Server',
      icon: FolderOpen,
      description: 'Gestione intelligente e automatizzata del filesystem con backup, sync e monitoraggio.',
      features: [
        'Gestione avanzata file e cartelle',
        'Backup automatico e sincronizzazione',
        'Monitoraggio cambiamenti real-time',
        'Compressione e archiviazione',
        'Search e indicizzazione intelligente'
      ],
      colorClass: 'text-success-400',
      gradientClass: 'from-success-600 to-success-800',
      buttonActiveClass: 'border-success-400 bg-success-400/10 text-success-400 backdrop-blur-lg',
      borderClass: 'border-success-400 bg-success-400/5 text-white backdrop-blur-lg', // Sempre attivo
      cardBorderClass: 'border-success-400/60', // Bordo card
      stats: [
        { label: 'File Ops/sec', value: '10K+' },
        { label: 'Storage Saved', value: '40%' },
        { label: 'Sync Speed', value: '100MB/s' }
      ]
    }
  ]

  const currentServer = mcpServers[activeServer]

  return (
    <section id="features" className="features-section">
      
      <div className="features-container mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="features-header fade-in"
        >
          <div className="features-badge">
            <Zap className="features-badge-icon text-secondary-400" />
            <span className="features-badge-text text-secondary-400 font-semibold">Features Avanzate</span>
          </div>
          {/* Main Title */}
          <div className="max-w-4xl mx-auto mb-6">
            <div className="px-6 py-4">
              <h2 className="features-title text-reveal">
                Server MCP{' '}
                <span className="bg-gradient-to-r from-secondary-400 to-accent-400 bg-clip-text text-transparent">
                  Professionali
                </span>
              </h2>
              {/* Linea decorativa */}
              <div className="features-divider" style={{ background: 'linear-gradient(to right, #d946ef, #06b6d4)' }}></div>
            </div>
          </div>
          {/* Description - Direttamente sotto senza wrapper aggiuntivo */}
          <p className="features-description text-gray-300" style={{ filter: 'brightness(1.1)' }}>
            Ogni server MCP offre automazione completa e controllo avanzato per massimizzare la tua produttività
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="features-buttons"
        >
          {mcpServers.map((server, index) => (
            <motion.button
              key={server.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveServer(index)}
              className={`features-server-btn border-2 backdrop-blur-lg transition-all duration-300 ${
                activeServer === index
                  ? server.buttonActiveClass  // Selezionato: background più intenso
                  : server.borderClass        // Non selezionato: sempre bordo colorato ma bg meno intenso
              }`}
            >
              <server.icon className="features-server-btn-icon" />
              <span className="font-medium">{server.name}</span>
            </motion.button>
          ))}
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeServer}
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.9 }}
            transition={{ duration: 0.5 }}
            className="max-w-6xl mx-auto"
          >
            {/* Card con bordo colorato dinamico */}
            <div className={`features-main-card bg-white/5 backdrop-blur-lg border-2 ${currentServer.cardBorderClass}`}>
              <div className="features-card-grid">
                <div>
                  <div className="features-card-header">
                    <div className={`features-card-icon bg-gradient-to-br ${currentServer.gradientClass}`}>
                      <currentServer.icon />
                    </div>
                    <div>
                      <h3 className={`features-card-title ${currentServer.colorClass}`}>
                        {currentServer.name}
                      </h3>
                      <div className="features-card-subtitle flex items-center space-x-2 mt-1">
                        <Cpu className="w-3 h-3 text-gray-400" />
                        <span className="text-gray-400">Server MCP Professionale</span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="features-card-description text-gray-300">
                    {currentServer.description}
                  </p>

                  <div className="features-list">
                    {currentServer.features.map((feature, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="features-list-item"
                      >
                        <CheckCircle className={`features-list-icon ${currentServer.colorClass} flex-shrink-0`} />
                        <span className="features-list-text text-gray-300">{feature}</span>
                      </motion.div>
                    ))}
                  </div>

                  <div className="features-stats">
                    {currentServer.stats.map((stat, index) => (
                      <div key={index} className="text-center">
                        <div className={`features-stat-value ${currentServer.colorClass}`}>
                          {stat.value}
                        </div>
                        <div className="features-stat-label text-gray-400">{stat.label}</div>
                      </div>
                    ))}
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02, x: 5 }}
                    whileTap={{ scale: 0.98 }}
                    className={`features-cta-btn bg-gradient-to-r ${currentServer.gradientClass} text-white hover:shadow-lg transition-all duration-300`}
                  >
                    <span>Prova {currentServer.name}</span>
                    <ArrowRight className="w-3 h-3" />
                  </motion.button>
                </div>

                <div className="relative">
                  <div className="features-terminal bg-black/50 backdrop-blur-sm border border-white/10">
                    <div className="features-terminal-header">
                      <div className="features-terminal-dot bg-red-500"></div>
                      <div className="features-terminal-dot bg-yellow-500"></div>
                      <div className="features-terminal-dot bg-green-500"></div>
                      <span className="features-terminal-title text-gray-400">
                        {currentServer.name} Terminal
                      </span>
                    </div>
                    
                    <div className="features-terminal-content text-green-400">
                      <div className="features-terminal-line typewriter-text">$ mcp connect {currentServer.id}</div>
                      <div className="features-terminal-line text-blue-400">✓ Connected to {currentServer.name}</div>
                      <div className="features-terminal-line text-yellow-400">⚡ Server ready for automation</div>
                      <div className="features-terminal-line text-white/60">🔧 Available commands: {currentServer.stats[2]?.value || '50+'}</div>
                      <div className="features-terminal-line text-gray-500">...</div>
                    </div>
                  </div>

                  <motion.div
                    animate={{ 
                      y: [0, -10, 0],
                      rotate: [0, 5, 0]
                    }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className="absolute -top-4 -right-4"
                  >
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${currentServer.gradientClass} shadow-lg`}>
                      <Database className="w-5 h-5 text-white" />
                    </div>
                  </motion.div>

                  <motion.div
                    animate={{ 
                      y: [0, 10, 0],
                      rotate: [0, -5, 0]
                    }}
                    transition={{ duration: 5, repeat: Infinity, delay: 0.5 }}
                    className="absolute -bottom-4 -left-4"
                  >
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${currentServer.gradientClass} shadow-lg`}>
                      <Globe className="w-5 h-5 text-white" />
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="features-highlights card-container"
        >
          {[
            { 
              title: '99.9% Uptime', 
              description: 'Affidabilità enterprise con monitoraggio 24/7',
              icon: CheckCircle,
              color: 'text-success-400'
            },
            { 
              title: '<1s Response', 
              description: 'Performance ottimizzate per produttività massima',
              icon: Zap,
              color: 'text-primary-400'
            },
            { 
              title: '24/7 Support', 
              description: 'Assistenza tecnica professionale sempre disponibile',
              icon: Globe,
              color: 'text-accent-400'
            }
          ].map((highlight, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -5 }}
              className="features-highlight-card bg-white/5 backdrop-blur-lg border border-white/10 hover:border-white/20 transition-all duration-300"
            >
              <highlight.icon className={`features-highlight-icon ${highlight.color} mx-auto`} />
              <h4 className="features-highlight-title text-white">{highlight.title}</h4>
              <p className="features-highlight-desc text-gray-400">{highlight.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
