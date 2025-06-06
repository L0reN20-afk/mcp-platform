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
  Loader2
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
      color: 'text-accent-400'
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
      color: 'from-primary-600 to-accent-600'
    },
    {
      id: 'office',
      name: 'Office Package',
      description: 'Automazione documenti: Word + PowerPoint + Excel (futuro)',
      servers: ['word'],
      price: 19.99,
      originalPrice: 24.99,
      color: 'from-accent-600 to-secondary-600'
    }
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
    <section id="packages" className="relative py-20 section-container">
      {/* Background - PIù TRASPARENTE per vedere il cubo */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-gray-900/15 to-black/30"></div>
      
      <div className="container mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 fade-in"
        >
          <div className="flex items-center justify-center mb-6">
            <Package className="w-6 h-6 sm:w-8 sm:h-8 text-accent-400 mr-3" />
            <span className="text-accent-400 font-semibold text-base sm:text-lg">Pacchetti e Server</span>
          </div>
          {/* Main Title con Safe Zone Avanzata */}
          <div className="relative max-w-4xl mx-auto mb-6">
            {/* Safe Zone Background - Protezione dalle particelle cyan */}
            <div className="absolute inset-0 bg-black/25 backdrop-blur-md rounded-2xl shadow-2xl shadow-black/50 border border-white/10 -m-6"></div>
            <div className="relative px-6 py-4">
              <h2 className="text-3xl md:text-6xl font-bold text-reveal mb-6">
                Scegli il tuo{' '}
                <span className="bg-gradient-to-r from-accent-400 to-success-400 bg-clip-text text-transparent">
                  Piano Perfetto
                </span>
              </h2>
              {/* Linea decorativa cyan-success */}
              <div className="w-32 h-1 bg-gradient-to-r from-accent-500 to-success-500 mx-auto rounded-full"></div>
            </div>
          </div>
          {/* Description con Safe Zone */}
          <div className="relative">
            {/* Safe Zone Background */}
            <div className="absolute inset-0 bg-black/14 backdrop-blur-sm rounded-xl -m-3"></div>
            <p className="relative text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto px-3">
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
          className="flex justify-center mb-12"
        >
          <div className="bg-white/5 backdrop-blur-sm border-2 border-accent-400/30 rounded-full p-2 flex gap-1 sm:gap-0">
            <button
              onClick={() => setActiveTab('packages')}
              className={`px-4 sm:px-8 py-3 rounded-full font-semibold text-sm sm:text-base transition-all duration-300 ${
                activeTab === 'packages'
                  ? 'bg-gradient-to-r from-accent-600 to-success-600 text-white'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              Pacchetti Completi
            </button>
            <button
              onClick={() => setActiveTab('individual')}
              className={`px-4 sm:px-8 py-3 rounded-full font-semibold text-sm sm:text-base transition-all duration-300 ${
                activeTab === 'individual'
                  ? 'bg-gradient-to-r from-accent-600 to-success-600 text-white'
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
                    className={`card-item relative bg-white/5 backdrop-blur-lg border-2 rounded-3xl p-8 cursor-pointer transition-all duration-300 flex flex-col h-full ${
                      selectedPackage === pkg.id
                        ? 'border-accent-400 bg-accent-400/10'
                        : pkg.popular
                        ? 'border-accent-400 bg-accent-400/5 hover:border-accent-300'
                        : 'border-accent-400/60 bg-accent-400/5 hover:border-accent-400'
                    }`}
                  >
                    {pkg.popular && (
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                        <div className="bg-gradient-to-r from-accent-500 to-success-500 text-white px-6 py-2 rounded-full text-sm font-semibold flex items-center space-x-1">
                          <Star className="w-4 h-4" />
                          <span>Più Popolare</span>
                        </div>
                      </div>
                    )}

                    <div className="text-center flex-grow flex flex-col">
                      <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${pkg.color} flex items-center justify-center`}>
                        <Package className="w-8 h-8 text-white" />
                      </div>

                      <h3 className="text-2xl font-bold text-white mb-2">{pkg.name}</h3>
                      <p className="text-gray-400 mb-6 flex-grow">{pkg.description}</p>

                      <div className="flex items-center justify-center space-x-3 mb-6">
                        <span className="text-3xl font-bold text-white">€{pkg.price}</span>
                        <span className="text-lg text-gray-400 line-through">€{pkg.originalPrice}</span>
                        <div className="bg-success-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                          Risparmi €{(pkg.originalPrice - pkg.price).toFixed(2)}
                        </div>
                      </div>

                      <div className="space-y-3 mb-8 flex-grow">
                        {pkg.servers.map(serverId => {
                          const server = servers.find(s => s.id === serverId)
                          return server ? (
                            <div key={serverId} className="flex items-center space-x-3 text-left">
                              <server.icon className={`w-5 h-5 ${server.color}`} />
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
                            ? 'bg-gradient-to-r from-accent-600 to-success-600 text-white'
                            : pkg.popular
                            ? 'bg-accent-500/20 text-white hover:bg-accent-500/30 border-2 border-accent-400/30 hover:border-accent-400'
                            : 'bg-accent-500/15 text-white hover:bg-accent-500/25 border border-accent-400/20 hover:border-accent-400/40'
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
                    className={`card-item bg-white/5 backdrop-blur-sm border-2 rounded-2xl p-6 cursor-pointer transition-all duration-300 flex flex-col h-full ${
                      selectedServers.includes(server.id)
                        ? `border-${server.color.split('-')[1]}-400 bg-${server.color.split('-')[1]}-400/10`
                        : server.id === 'vscode'
                        ? 'border-primary-400/60 bg-primary-400/5 hover:border-primary-400'
                        : server.id === 'visual-studio'
                        ? 'border-secondary-400/60 bg-secondary-400/5 hover:border-secondary-400'
                        : server.id === 'word'
                        ? 'border-accent-400/60 bg-accent-400/5 hover:border-accent-400'
                        : server.id === 'filesystem'
                        ? 'border-success-400/60 bg-success-400/5 hover:border-success-400'
                        : 'border-white/10 hover:border-white/30'
                    }`}
                  >
                    <div className="text-center flex-grow flex flex-col">
                      <div className="relative mb-4">
                        <server.icon className={`w-12 h-12 ${server.color} mx-auto`} />
                        <motion.div
                          initial={false}
                          animate={{ 
                            scale: selectedServers.includes(server.id) ? 1 : 0,
                            opacity: selectedServers.includes(server.id) ? 1 : 0
                          }}
                          className="absolute -top-2 -right-2"
                        >
                          <div className="bg-accent-500 text-white rounded-full p-1">
                            <Check className="w-4 h-4" />
                          </div>
                        </motion.div>
                      </div>
                      
                      <h4 className="text-lg font-bold text-white mb-2">{server.name}</h4>
                      <p className="text-sm text-gray-400 mb-4 flex-grow">{server.description}</p>
                      
                      <div className="text-2xl font-bold text-white mb-6">€{server.price}</div>
                      
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`w-full py-2 rounded-full text-sm font-semibold transition-all duration-300 flex items-center justify-center space-x-2 ${
                          selectedServers.includes(server.id)
                            ? server.id === 'vscode'
                              ? 'bg-primary-500 text-white'
                              : server.id === 'visual-studio'
                              ? 'bg-secondary-500 text-white'
                              : server.id === 'word'
                              ? 'bg-accent-500 text-white'
                              : server.id === 'filesystem'
                              ? 'bg-success-500 text-white'
                              : 'bg-accent-500 text-white'
                            : server.id === 'vscode'
                            ? 'bg-primary-500/20 text-white hover:bg-primary-500/30 border border-primary-400/30'
                            : server.id === 'visual-studio'
                            ? 'bg-secondary-500/20 text-white hover:bg-secondary-500/30 border border-secondary-400/30'
                            : server.id === 'word'
                            ? 'bg-accent-500/20 text-white hover:bg-accent-500/30 border border-accent-400/30'
                            : server.id === 'filesystem'
                            ? 'bg-success-500/20 text-white hover:bg-success-500/30 border border-success-400/30'
                            : 'bg-white/10 text-white hover:bg-white/20'
                        }`}
                      >
                        {selectedServers.includes(server.id) ? (
                          <>
                            <Minus className="w-4 h-4" />
                            <span>Rimuovi</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-4 h-4" />
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
                  className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xl font-bold text-white mb-2">Riepilogo Selezione</h4>
                      <p className="text-gray-400">
                        {selectedServers.length} server{selectedServers.length > 1 ? ' selezionati' : ' selezionato'}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-white flex items-center space-x-2">
                        <Calculator className="w-6 h-6 text-accent-400" />
                        <span>€{calculateTotal().toFixed(2)}</span>
                      </div>
                      <p className="text-sm text-gray-400">al mese</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Download CTA */}
        {(selectedServers.length > 0 || selectedPackage) && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mt-12"
          >
            <motion.button
              whileHover={{ scale: loading ? 1 : 1.05, y: loading ? 0 : -2 }}
              whileTap={{ scale: loading ? 1 : 0.95 }}
              onClick={handleDownloadClick}
              disabled={loading}
              className="magnetic-button bg-gradient-to-r from-accent-600 to-success-600 text-white px-8 py-4 rounded-full font-semibold text-lg flex items-center space-x-3 mx-auto hover:shadow-xl hover:shadow-accent-500/25 transition-all duration-300 disabled:opacity-70"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : downloadSuccess ? (
                <Star className="w-5 h-5 text-yellow-300" />
              ) : (
                <Download className="w-5 h-5" />
              )}
              <span>
                {loading ? 'Preparazione...' : downloadSuccess ? 'Download Avviato!' : 'Scarica Trial 48h Gratuito'}
              </span>
              <div className="bg-white/20 px-3 py-1 rounded-full text-sm">
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
                  className="mt-2 text-sm underline hover:no-underline"
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
      </div>
    </section>
  )
}
