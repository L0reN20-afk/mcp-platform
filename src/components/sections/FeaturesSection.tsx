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
      buttonActiveClass: 'border-primary-400 bg-primary-400/10 text-primary-400',
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
      buttonActiveClass: 'border-secondary-400 bg-secondary-400/10 text-secondary-400',
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
      buttonActiveClass: 'border-accent-400 bg-accent-400/10 text-accent-400',
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
      buttonActiveClass: 'border-success-400 bg-success-400/10 text-success-400',
      stats: [
        { label: 'File Ops/sec', value: '10K+' },
        { label: 'Storage Saved', value: '40%' },
        { label: 'Sync Speed', value: '100MB/s' }
      ]
    }
  ]

  const currentServer = mcpServers[activeServer]

  return (
    <section id="features" className="relative py-20 section-container">
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-gray-900/15 to-black/30"></div>
      
      <div className="container mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 fade-in"
        >
          <div className="flex items-center justify-center mb-6">
            <Zap className="w-8 h-8 text-secondary-400 mr-3" />
            <span className="text-secondary-400 font-semibold text-lg">Features Avanzate</span>
          </div>
          {/* Main Title con Safe Zone Avanzata */}
          <div className="relative max-w-4xl mx-auto mb-6">
            {/* Safe Zone Background - PIÙ FORTE per proteggersi dalle particelle viola */}
            <div className="absolute inset-0 bg-black/25 backdrop-blur-md rounded-2xl shadow-2xl shadow-black/50 border border-white/10 -m-6"></div>
            <div className="relative px-6 py-4">
              <h2 className="text-4xl md:text-6xl font-bold text-reveal mb-6">
                Server MCP{' '}
                <span className="bg-gradient-to-r from-secondary-400 to-accent-400 bg-clip-text text-transparent">
                  Professionali
                </span>
              </h2>
              {/* Linea decorativa */}
              <div className="w-32 h-1 bg-gradient-to-r from-secondary-500 to-accent-500 mx-auto rounded-full"></div>
            </div>
          </div>
          {/* Description con Safe Zone */}
          <div className="relative max-w-3xl mx-auto">
            {/* Safe Zone Background */}
            <div className="absolute inset-0 bg-black/15 backdrop-blur-sm rounded-xl -m-3"></div>
            <p className="relative text-xl text-gray-300 px-3">
              Ogni server MCP offre automazione completa e controllo avanzato per massimizzare la tua produttività
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          {mcpServers.map((server, index) => (
            <motion.button
              key={server.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveServer(index)}
              className={`flex items-center space-x-3 px-6 py-3 rounded-full border-2 transition-all duration-300 ${
                activeServer === index
                  ? server.buttonActiveClass
                  : 'border-white/20 bg-white/10 text-white/80 hover:border-white/40 hover:text-white'
              }`}
            >
              <server.icon className="w-5 h-5" />
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
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-8 md:p-12">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <div className="flex items-center space-x-4 mb-6">
                    <div className={`p-4 rounded-2xl bg-gradient-to-br ${currentServer.gradientClass} feature-icon`}>
                      <currentServer.icon className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className={`text-3xl font-bold ${currentServer.colorClass}`}>
                        {currentServer.name}
                      </h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <Cpu className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-400">Server MCP Professionale</span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-lg text-gray-300 mb-8">
                    {currentServer.description}
                  </p>

                  <div className="space-y-4 mb-8">
                    {currentServer.features.map((feature, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start space-x-3"
                      >
                        <CheckCircle className={`w-5 h-5 ${currentServer.colorClass} mt-0.5 flex-shrink-0`} />
                        <span className="text-gray-300">{feature}</span>
                      </motion.div>
                    ))}
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-8">
                    {currentServer.stats.map((stat, index) => (
                      <div key={index} className="text-center">
                        <div className={`text-2xl font-bold ${currentServer.colorClass}`}>
                          {stat.value}
                        </div>
                        <div className="text-sm text-gray-400">{stat.label}</div>
                      </div>
                    ))}
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02, x: 5 }}
                    whileTap={{ scale: 0.98 }}
                    className={`flex items-center space-x-2 bg-gradient-to-r ${currentServer.gradientClass} text-white px-6 py-3 rounded-full font-semibold hover:shadow-lg transition-all duration-300`}
                  >
                    <span>Prova {currentServer.name}</span>
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </div>

                <div className="relative">
                  <div className="bg-black/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6 overflow-hidden">
                    <div className="flex items-center space-x-2 mb-4">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-gray-400 ml-4">
                        {currentServer.name} Terminal
                      </span>
                    </div>
                    
                    <div className="font-mono text-sm text-green-400 space-y-2">
                      <div className="typewriter-text">$ mcp connect {currentServer.id}</div>
                      <div className="text-blue-400">✓ Connected to {currentServer.name}</div>
                      <div className="text-yellow-400">⚡ Server ready for automation</div>
                      <div className="text-white/60">🔧 Available commands: {currentServer.stats[2]?.value || '50+'}</div>
                      <div className="text-gray-500">...</div>
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
                      <Database className="w-6 h-6 text-white" />
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
                      <Globe className="w-6 h-6 text-white" />
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
          className="grid md:grid-cols-3 gap-8 mt-16 card-container"
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
              className="card-item bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center hover:border-white/20 transition-all duration-300"
            >
              <highlight.icon className={`w-12 h-12 ${highlight.color} mx-auto mb-4`} />
              <h4 className="text-xl font-bold text-white mb-2">{highlight.title}</h4>
              <p className="text-gray-400">{highlight.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}