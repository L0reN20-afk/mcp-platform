'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Package, 
  Check, 
  Plus, 
  Minus, 
  Download, 
  ShoppingCart,
  Code2,
  FileCode,
  FileText,
  FolderOpen,
  Star,
  Zap,
  Calculator,
  Loader2,
  Users,
  Clock,
  Shield
} from 'lucide-react'
import { useTrialDownload, trackEvent } from '@/lib/hooks/useApi'

interface Server {
  id: string
  name: string
  icon: React.ComponentType<any>
  price: number
  description: string
  color: string
}

interface PackageType {
  id: string
  name: string
  description: string
  servers: string[]
  price: number
  originalPrice: number
  popular?: boolean
  color: string
}

export default function PackagesSection() {
  const [activeTab, setActiveTab] = useState<'packages' | 'individual'>('packages')
  const [selectedServers, setSelectedServers] = useState<string[]>([])
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null)

  // API integration
  const { downloadTrial, loading, error } = useTrialDownload()
  const [downloadSuccess, setDownloadSuccess] = useState(false)

  const handleDownloadClick = async () => {
    try {
      // Track download intent with package info
      await trackEvent('trial_download_clicked', {
        section: 'packages',
        selected_package: selectedPackage,
        selected_servers: selectedServers,
        user_agent: navigator.userAgent
      })

      const result = await downloadTrial()
      
      if (result && result.success) {
        setDownloadSuccess(true)
        
        // Track successful download
        await trackEvent('trial_download_success', {
          trial_id: result.trial_id,
          download_url: result.download_url,
          source: 'packages_section',
          package_selection: {
            package: selectedPackage,
            servers: selectedServers
          }
        })

        // Redirect to download
        if (result.download_url) {
          window.open(result.download_url, '_blank')
        }

        // Reset success state after 3 seconds
        setTimeout(() => setDownloadSuccess(false), 3000)
      }
    } catch (err) {
      console.error('Download error:', err)
    }
  }

  const servers: Server[] = [
    {
      id: 'vscode',
      name: 'VS Code Server',
      icon: Code2,
      price: 12.99,
      description: 'Automazione completa Visual Studio Code',
      color: 'text-primary-400'
    },
    {
      id: 'visual-studio',
      name: 'Visual Studio 2022',
      icon: FileCode,
      price: 15.99,
      description: 'Integrazione .NET avanzata',
      color: 'text-secondary-400'
    },
    {
      id: 'word',
      name: 'Word Server',
      icon: FileText,
      price: 9.99,
      description: 'Controllo avanzato Microsoft Word',
      color: 'text-orange-400'
    },
    {
      id: 'filesystem',
      name: 'Filesystem Server',
      icon: FolderOpen,
      price: 8.99,
      description: 'Gestione intelligente filesystem',
      color: 'text-success-400'
    }
  ]

  const packages: PackageType[] = [
    {
      id: 'coding',
      name: 'Coding Package',
      description: 'Perfetto per sviluppatori: VS Code + Visual Studio + Filesystem',
      servers: ['vscode', 'visual-studio', 'filesystem'],
      price: 29.99,
      originalPrice: 37.97,
      popular: true,
      color: 'from-orange-600 to-red-600'
    },
    {
      id: 'office',
      name: 'Office Package',
      description: 'Automazione documenti: Word + PowerPoint + Excel (futuro)',
      servers: ['word'],
      price: 19.99,
      originalPrice: 24.99,
      color: 'from-orange-600 to-red-600'
    }
  ]

  const stats = [
    { icon: Zap, value: "4+", label: "Server MCP", color: "text-primary-400" },
    { icon: Users, value: "100%", label: "Automazione", color: "text-orange-400" },
    { icon: Clock, value: "24/7", label: "Support", color: "text-secondary-400" },
    { icon: Shield, value: "48h", label: "Trial Gratuito", color: "text-success-400" }
  ]

  const toggleServer = (serverId: string) => {
    setSelectedServers(prev => 
      prev.includes(serverId) 
        ? prev.filter(id => id !== serverId)
        : [...prev, serverId]
    )
  }

  const selectPackage = (packageId: string) => {
    const pkg = packages.find(p => p.id === packageId)
    if (pkg) {
      setSelectedPackage(packageId)
      setSelectedServers(pkg.servers)
    }
  }

  const calculateTotal = () => {
    return selectedServers.reduce((total, serverId) => {
      const server = servers.find(s => s.id === serverId)
      return total + (server?.price || 0)
    }, 0)
  }

  const calculateSavings = () => {
    const total = calculateTotal()
    const pkg = packages.find(p => p.id === selectedPackage)
    return pkg ? pkg.originalPrice - pkg.price : 0
  }

  return (
    <section id="packages" className="packages-section">
      
      <div className="packages-container mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="packages-header fade-in"
        >
          <div className="packages-badge">
            <Package className="packages-badge-icon text-orange-400" />
            <span className="packages-badge-text text-orange-400 font-semibold">Pacchetti e Server</span>
          </div>
          {/* Main Title */}
          <div className="max-w-4xl mx-auto mb-6">
            <div className="px-6 py-4">
              <h2 className="packages-title text-reveal">
                Scegli il{' '}
                <span className="bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                  Piano Perfetto
                </span>
              </h2>
              {/* Linea decorativa arancione-rosso */}
              <div className="packages-divider bg-gradient-to-r from-orange-500 to-red-500"></div>
            </div>
          </div>
          {/* Description - Direttamente sotto senza wrapper aggiuntivo */}
          <p className="packages-description text-gray-400" style={{ filter: 'brightness(1.1)' }}>
            Pacchetti completi con risparmio garantito o server individuali per massima flessibilità
          </p>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="packages-tabs"
        >
          <div className="packages-tabs-container bg-white/5 backdrop-blur-lg border-2 border-orange-400">
            <button
              onClick={() => setActiveTab('packages')}
              className={`packages-tab-button transition-all duration-300 ${
                activeTab === 'packages'
                  ? 'bg-gradient-to-r from-orange-600 to-red-600 text-white'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              Pacchetti Completi
            </button>
            <button
              onClick={() => setActiveTab('individual')}
              className={`packages-tab-button transition-all duration-300 ${
                activeTab === 'individual'
                  ? 'bg-gradient-to-r from-orange-600 to-red-600 text-white'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              Server Singoli
            </button>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {activeTab === 'packages' ? (
            <motion.div
              key="packages"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.5 }}
              className="card-container"
            >
              <div className="packages-grid">
                {packages.map((pkg, index) => (
                  <motion.div
                    key={pkg.id}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.2 }}
                    whileHover={{ y: -10, scale: 1.02 }}
                    onClick={() => selectPackage(pkg.id)}
                    className={`package-card relative bg-white/5 backdrop-blur-lg border-2 cursor-pointer transition-all duration-300 ${
                      selectedPackage === pkg.id
                        ? 'border-orange-400 bg-white/10'
                        : pkg.popular
                        ? 'border-orange-400 bg-white/5 hover:border-orange-300'
                        : 'border-orange-400/60 bg-white/5 hover:border-orange-400'
                    }`}
                  >
                    {pkg.popular && (
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                        <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-2 rounded-full text-xs font-semibold flex items-center space-x-1">
                          <Star className="w-4 h-4" />
                          <span>Più Popolare</span>
                        </div>
                      </div>
                    )}

                    <div className="text-center flex-grow flex flex-col">
                      <div className={`package-icon bg-gradient-to-br ${pkg.color}`}>
                        <Package className="text-white" />
                      </div>

                      <h3 className="package-name text-white">{pkg.name}</h3>
                      <p className="package-description text-gray-400" style={{ filter: 'brightness(1.1)' }}>{pkg.description}</p>

                      <div className="package-pricing">
                        <span className="package-price text-white">€{pkg.price}</span>
                        <span className="package-original-price text-gray-400">€{pkg.originalPrice}</span>
                        <div className="package-savings bg-red-500 text-white">
                          Risparmi €{(pkg.originalPrice - pkg.price).toFixed(2)}
                        </div>
                      </div>

                      <div className="package-features">
                        {pkg.servers.map(serverId => {
                          const server = servers.find(s => s.id === serverId)
                          return server ? (
                            <div key={serverId} className="package-feature">
                              <server.icon className={`${server.color}`} />
                              <span className="text-gray-300">{server.name}</span>
                            </div>
                          ) : null
                        })}
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`package-button ${
                          selectedPackage === pkg.id
                            ? 'bg-gradient-to-r from-orange-600 to-red-600 text-white border-transparent'
                            : pkg.popular
                            ? 'bg-white/10 text-white hover:bg-white/20 border-2 border-orange-400/60 hover:border-orange-400'
                            : 'bg-white/15 text-white hover:bg-white/25 border-2 border-orange-400/50 hover:border-orange-400/80'
                        }`}
                      >
                        {selectedPackage === pkg.id ? 'Selezionato' : 'Seleziona Pacchetto'}
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="individual"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
              className="max-w-6xl mx-auto"
            >
              <div className="servers-grid card-container">
                {servers.map((server, index) => (
                  <motion.div
                    key={server.id}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    whileHover={{ y: -5 }}
                    onClick={() => toggleServer(server.id)}
                    className={`server-card bg-white/5 backdrop-blur-lg border-2 transition-all duration-300 cursor-pointer ${
                      selectedServers.includes(server.id)
                        ? `border-${server.color.split('-')[1]}-400 bg-${server.color.split('-')[1]}-400/10`
                        : server.id === 'vscode'
                        ? 'border-primary-400/60 bg-primary-400/5 hover:border-primary-400'
                        : server.id === 'visual-studio'
                        ? 'border-secondary-400/60 bg-secondary-400/5 hover:border-secondary-400'
                        : server.id === 'word'
                        ? 'border-orange-400/60 bg-orange-400/5 hover:border-orange-400'
                        : server.id === 'filesystem'
                        ? 'border-success-400/60 bg-success-400/5 hover:border-success-400'
                        : 'border-white/10 hover:border-white/30'
                    }`}
                  >
                    <div className="text-center flex-grow flex flex-col">
                      <div className="server-icon-container">
                        <server.icon className={`server-icon ${server.color}`} />
                        <motion.div
                          initial={false}
                          animate={{ 
                            scale: selectedServers.includes(server.id) ? 1 : 0,
                            opacity: selectedServers.includes(server.id) ? 1 : 0
                          }}
                          className="absolute -top-2 -right-2"
                        >
                          <div className="bg-orange-500 text-white rounded-full p-1">
                            <Check className="w-3 h-3" />
                          </div>
                        </motion.div>
                      </div>
                      
                      <h4 className="server-name text-white">{server.name}</h4>
                      <p className="server-description text-gray-400">{server.description}</p>
                      
                      <div className="server-price text-white">€{server.price}</div>
                      
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`server-button ${
                          selectedServers.includes(server.id)
                            ? server.id === 'vscode'
                              ? 'bg-primary-500 text-white'
                              : server.id === 'visual-studio'
                              ? 'bg-secondary-500 text-white'
                              : server.id === 'word'
                              ? 'bg-orange-500 text-white'
                              : server.id === 'filesystem'
                              ? 'bg-success-500 text-white'
                              : 'bg-orange-500 text-white'
                            : server.id === 'vscode'
                            ? 'bg-primary-500/20 text-white hover:bg-primary-500/30 border border-primary-400/30'
                            : server.id === 'visual-studio'
                            ? 'bg-secondary-500/20 text-white hover:bg-secondary-500/30 border border-secondary-400/30'
                            : server.id === 'word'
                            ? 'bg-orange-500/20 text-white hover:bg-orange-500/30 border border-orange-400/30'
                            : server.id === 'filesystem'
                            ? 'bg-success-500/20 text-white hover:bg-success-500/30 border border-success-400/30'
                            : 'bg-white/10 text-white hover:bg-white/20'
                        }`}
                      >
                        {selectedServers.includes(server.id) ? (
                          <>
                            <Minus />
                            <span>Rimuovi</span>
                          </>
                        ) : (
                          <>
                            <Plus />
                            <span>Aggiungi</span>
                          </>
                        )}
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Selection Summary */}
              {selectedServers.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="selection-summary bg-white/5 backdrop-blur-lg border border-white/10"
                >
                  <div className="selection-summary-content">
                    <div>
                      <h4 className="selection-summary-title text-white">Riepilogo Selezione</h4>
                      <p className="selection-summary-subtitle text-gray-400">
                        {selectedServers.length} server{selectedServers.length > 1 ? ' selezionati' : ' selezionato'}
                      </p>
                    </div>
                    <div className="selection-total">
                      <div className="selection-total-price text-white">
                        <Calculator className="text-orange-400" />
                        <span>€{calculateTotal().toFixed(2)}</span>
                      </div>
                      <p className="selection-total-period text-gray-400">al mese</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Download CTA - Spazio moderato per le statistiche fisse */}
        {(selectedServers.length > 0 || selectedPackage) && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="packages-cta"
          >
            <motion.button
              whileHover={{ scale: loading ? 1 : 1.05, y: loading ? 0 : -2 }}
              whileTap={{ scale: loading ? 1 : 0.95 }}
              onClick={handleDownloadClick}
              disabled={loading}
              className="packages-download-button magnetic-button bg-gradient-to-r from-orange-600 to-red-600 text-white hover:shadow-xl hover:shadow-orange-500/25 transition-all duration-300 disabled:opacity-70"
            >
              {loading ? (
                <Loader2 className="animate-spin" />
              ) : downloadSuccess ? (
                <Star className="text-yellow-300" />
              ) : (
                <Download />
              )}
              <span>
                {loading ? 'Preparazione...' : downloadSuccess ? 'Download Avviato!' : 'Scarica Trial 48h Gratuito'}
              </span>
              <div className="beta-badge bg-white/20">
                BETA
              </div>
            </motion.button>
            
            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 bg-red-500/20 border border-red-500/30 rounded-lg p-4 text-red-300 text-center max-w-md mx-auto"
              >
                <p>{error}</p>
                <button 
                  onClick={() => window.location.reload()} 
                  className="mt-2 text-xs underline hover:no-underline"
                >
                  Riprova
                </button>
              </motion.div>
            )}
            
            <p className="packages-download-description text-gray-400">
              Prova tutti i server selezionati per 48 ore completamente gratis
            </p>
          </motion.div>
        )}

        {/* Stats Section - FISSE E SEMPRE VISIBILI - Ancora più in basso */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.3 }}
          className="packages-stats"
        >
          <div className="packages-stats-grid">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                className={`packages-stat-card backdrop-blur-lg border-2 floating-element group cursor-pointer transition-all duration-300 group-hover:scale-110 ${
                  stat.color === 'text-primary-400' 
                    ? 'bg-white/5 border-primary-400/60 hover:border-primary-400 bg-primary-400/5' 
                    : stat.color === 'text-orange-400'
                    ? 'bg-white/5 border-orange-400/60 hover:border-orange-400 bg-orange-400/5'
                    : stat.color === 'text-secondary-400' 
                    ? 'bg-white/5 border-secondary-400/60 hover:border-secondary-400 bg-secondary-400/5'
                    : stat.color === 'text-success-400'
                    ? 'bg-white/5 border-success-400/60 hover:border-success-400 bg-success-400/5'
                    : 'bg-white/5 border-white/10 hover:border-white/20'
                }`}
              >
                <stat.icon className={`packages-stat-icon ${stat.color} group-hover:scale-110 transition-transform duration-300`} />
                <div className={`packages-stat-value ${stat.color} counter`} data-target={stat.value.replace(/\D/g, '')} data-suffix={stat.value.replace(/\d/g, '')}>
                  {stat.value}
                </div>
                <div className="packages-stat-label text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  )
}
