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
    <section id="packages" className="relative py-16 section-container">
      
      <div className="container mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-10 fade-in"
        >
          <div className="flex items-center justify-center mb-6">
            <Package className="w-5 h-5 sm:w-7 sm:h-7 text-orange-400 mr-3" />
            <span className="text-orange-400 font-semibold text-xs sm:text-base">Pacchetti e Server</span>
          </div>
          {/* Main Title */}
          <div className="max-w-4xl mx-auto mb-6">
            <div className="px-6 py-4">
              <h2 className="text-xl md:text-5xl font-bold text-reveal mb-6">
                Scegli il tuo{' '}
                <span className="bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                  Piano Perfetto
                </span>
              </h2>
              {/* Linea decorativa arancione-rosso */}
              <div className="w-32 h-1 bg-gradient-to-r from-orange-500 to-red-500 mx-auto rounded-full"></div>
            </div>
          </div>
          {/* Description */}
          <div>
            <p className="text-base sm:text-base text-gray-400 max-w-3xl mx-auto px-3">
              Pacchetti completi con risparmio garantito o server individuali per massima flessibilità
            </p>
          </div>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex justify-center mb-10"
        >
          <div className="bg-white/5 backdrop-blur-lg border-2 border-orange-400 rounded-full p-2 flex gap-1 sm:gap-0">
            <button
              onClick={() => setActiveTab('packages')}
              className={`px-3 sm:px-7 py-3 rounded-full font-semibold text-xs sm:text-xs transition-all duration-300 ${
                activeTab === 'packages'
                  ? 'bg-gradient-to-r from-orange-600 to-red-600 text-white'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              Pacchetti Completi
            </button>
            <button
              onClick={() => setActiveTab('individual')}
              className={`px-3 sm:px-7 py-3 rounded-full font-semibold text-xs sm:text-xs transition-all duration-300 ${
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
              <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                {packages.map((pkg, index) => (
                  <motion.div
                    key={pkg.id}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.2 }}
                    whileHover={{ y: -10, scale: 1.02 }}
                    onClick={() => selectPackage(pkg.id)}
                    className={`card-item relative bg-white/5 backdrop-blur-lg border-2 rounded-3xl p-5 cursor-pointer transition-all duration-300 flex flex-col h-full ${
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
                      <div className={`w-14 h-14 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${pkg.color} flex items-center justify-center`}>
                        <Package className="w-7 h-7 text-white" />
                      </div>

                      <h3 className="text-lg font-bold text-white mb-2">{pkg.name}</h3>
                      <p className="text-gray-400 mb-6 flex-grow">{pkg.description}</p>

                      <div className="flex items-center justify-center space-x-3 mb-6">
                        <span className="text-xl font-bold text-white">€{pkg.price}</span>
                        <span className="text-base text-gray-400 line-through">€{pkg.originalPrice}</span>
                        <div className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                          Risparmi €{(pkg.originalPrice - pkg.price).toFixed(2)}
                        </div>
                      </div>

                      <div className="space-y-3 mb-8 flex-grow">
                        {pkg.servers.map(serverId => {
                          const server = servers.find(s => s.id === serverId)
                          return server ? (
                            <div key={serverId} className="flex items-center space-x-3 text-left">
                              <server.icon className={`w-4 h-4 ${server.color}`} />
                              <span className="text-gray-300">{server.name}</span>
                            </div>
                          ) : null
                        })}
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`w-full py-3 rounded-full font-semibold transition-all duration-300 ${
                          selectedPackage === pkg.id
                            ? 'bg-gradient-to-r from-orange-600 to-red-600 text-white'
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
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 card-container">
                {servers.map((server, index) => (
                  <motion.div
                    key={server.id}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    whileHover={{ y: -5 }}
                    onClick={() => toggleServer(server.id)}
                    className={`card-item bg-white/5 backdrop-blur-lg border-2 rounded-2xl p-5 cursor-pointer transition-all duration-300 flex flex-col h-full ${
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
                      <div className="relative mb-4">
                        <server.icon className={`w-11 h-11 ${server.color} mx-auto`} />
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
                      
                      <h4 className="text-base font-bold text-white mb-2">{server.name}</h4>
                      <p className="text-xs text-gray-400 mb-4 flex-grow">{server.description}</p>
                      
                      <div className="text-xl font-bold text-white mb-6">€{server.price}</div>
                      
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`w-full py-2 rounded-full text-xs font-semibold transition-all duration-300 flex items-center justify-center space-x-2 ${
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
                            <Minus className="w-3 h-3" />
                            <span>Rimuovi</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-3 h-3" />
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
                  className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-5"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-lg font-bold text-white mb-2">Riepilogo Selezione</h4>
                      <p className="text-gray-400">
                        {selectedServers.length} server{selectedServers.length > 1 ? ' selezionati' : ' selezionato'}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-white flex items-center space-x-2">
                        <Calculator className="w-5 h-5 text-orange-400" />
                        <span>€{calculateTotal().toFixed(2)}</span>
                      </div>
                      <p className="text-xs text-gray-400">al mese</p>
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
            className="text-center my-16 py-8"
          >
            <motion.button
              whileHover={{ scale: loading ? 1 : 1.05, y: loading ? 0 : -2 }}
              whileTap={{ scale: loading ? 1 : 0.95 }}
              onClick={handleDownloadClick}
              disabled={loading}
              className="magnetic-button bg-gradient-to-r from-orange-600 to-red-600 text-white px-7 py-3 rounded-full font-semibold text-base flex items-center space-x-3 mx-auto hover:shadow-xl hover:shadow-orange-500/25 transition-all duration-300 disabled:opacity-70"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : downloadSuccess ? (
                <Star className="w-4 h-4 text-yellow-300" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              <span>
                {loading ? 'Preparazione...' : downloadSuccess ? 'Download Avviato!' : 'Scarica Trial 48h Gratuito'}
              </span>
              <div className="bg-white/20 px-3 py-1 rounded-full text-xs">
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
            
            <p className="text-gray-400 mt-4">
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
          className="mt-32 pt-20"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                className="floating-element text-center group cursor-pointer"
              >
                <div className={`backdrop-blur-lg border-2 rounded-2xl p-4 transition-all duration-300 group-hover:scale-110 ${
                  stat.color === 'text-primary-400' 
                    ? 'bg-white/5 border-primary-400/60 hover:border-primary-400 bg-primary-400/5' 
                    : stat.color === 'text-orange-400'
                    ? 'bg-white/5 border-orange-400/60 hover:border-orange-400 bg-orange-400/5'
                    : stat.color === 'text-secondary-400' 
                    ? 'bg-white/5 border-secondary-400/60 hover:border-secondary-400 bg-secondary-400/5'
                    : stat.color === 'text-success-400'
                    ? 'bg-white/5 border-success-400/60 hover:border-success-400 bg-success-400/5'
                    : 'bg-white/5 border-white/10 hover:border-white/20'
                }`}>
                  <stat.icon className={`w-7 h-7 ${stat.color} mx-auto mb-3 group-hover:scale-110 transition-transform duration-300`} />
                  <div className={`text-2xl font-bold ${stat.color} mb-1 counter`} data-target={stat.value.replace(/\D/g, '')} data-suffix={stat.value.replace(/\d/g, '')}>
                    {stat.value}
                  </div>
                  <div className="text-gray-400 text-xs font-medium">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  )
}