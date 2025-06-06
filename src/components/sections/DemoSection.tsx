'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Play, 
  Copy, 
  Download, 
  Terminal, 
  Code2, 
  FileCode, 
  FileText, 
  FolderOpen,
  CheckCircle,
  ArrowRight,
  Zap,
  Clock,
  Loader2,
  Star
} from 'lucide-react'
import { useTrialDownload, trackEvent } from '@/lib/hooks/useApi'

interface CodeExample {
  id: string
  name: string
  icon: React.ComponentType<any>
  title: string
  description: string
  code: string
  output: string[]
  color: string
}

export default function DemoSection() {
  const [activeDemo, setActiveDemo] = useState(0)
  const [typingText, setTypingText] = useState('')
  const [currentOutputLine, setCurrentOutputLine] = useState(0)
  const [isTyping, setIsTyping] = useState(false)
  const typewriterRef = useRef<number>()

  // API integration
  const { downloadTrial, loading, error } = useTrialDownload()
  const [downloadSuccess, setDownloadSuccess] = useState(false)

  const handleDownloadClick = async () => {
    try {
      // Track download intent
      await trackEvent('trial_download_clicked', {
        section: 'demo',
        user_agent: navigator.userAgent
      })

      const result = await downloadTrial()
      
      if (result && result.success) {
        setDownloadSuccess(true)
        
        // Track successful download
        await trackEvent('trial_download_success', {
          trial_id: result.trial_id,
          download_url: result.download_url,
          source: 'demo_section'
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

  const codeExamples: CodeExample[] = [
    {
      id: 'vscode',
      name: 'VS Code Server',
      icon: Code2,
      title: 'Automazione VS Code Completa',
      description: 'Controlla VS Code programmaticamente: apri progetti, modifica file, esegui comandi terminal',
      code: `// Connetti al VS Code Server MCP
import { VSCodeServer } from '@mcp/vscode-server'

const vscode = new VSCodeServer()

// Apri progetto e modifica file
await vscode.openProject('/my-project')
await vscode.openFile('src/app.tsx')
await vscode.insertText('console.log("Hello MCP!")')

// Esegui comando terminal
const result = await vscode.terminal.execute('npm run build')
console.log('Build completato:', result.success)`,
      output: [
        '🔌 Connessione a VS Code Server...',
        '✅ Connesso con successo',
        '📁 Apertura progetto: /my-project',
        '📝 File aperto: src/app.tsx',
        '⚡ Testo inserito alla riga 42',
        '💻 Esecuzione comando: npm run build',
        '🎉 Build completato con successo!',
        '⏱️  Tempo esecuzione: 1.2s'
      ],
      color: 'text-primary-400'
    },
    {
      id: 'visual-studio',
      name: 'Visual Studio 2022',
      icon: FileCode,
      title: 'Integrazione .NET Avanzata',
      description: 'Gestisci progetti .NET, build automatici, debugging e deploy con Visual Studio 2022',
      code: `// Visual Studio 2022 Server MCP
import { VisualStudioServer } from '@mcp/vs-server'

const vs = new VisualStudioServer()

// Apri soluzione .NET
await vs.openSolution('./MyApp.sln')
await vs.restoreNuGetPackages()

// Build e test automatici
const buildResult = await vs.build('Release')
const testResult = await vs.runTests()

console.log('Build:', buildResult.status)
console.log('Tests passed:', testResult.passed)`,
      output: [
        '🔧 Connessione a Visual Studio 2022...',
        '✅ Istanza VS2022 trovata e collegata',
        '📦 Apertura soluzione: MyApp.sln',
        '📋 Restore pacchetti NuGet in corso...',
        '🔨 Build configurazione Release...',
        '🧪 Esecuzione test suite...',
        '✅ Build: SUCCESS (0 errori, 0 warning)',
        '🎯 Tests: 47/47 passed (100%)'
      ],
      color: 'text-secondary-400'
    },
    {
      id: 'word',
      name: 'Word Server',
      icon: FileText,
      title: 'Automazione Documenti Word',
      description: 'Crea, modifica e gestisci documenti Word programmaticamente con controllo completo',
      code: `// Word Server MCP per automazione documenti
import { WordServer } from '@mcp/word-server'

const word = new WordServer()

// Crea nuovo documento da template
const doc = await word.createFromTemplate('./template.docx')
await doc.replaceText('{{CLIENTE}}', 'Acme Corporation')
await doc.insertTable(salesData, { style: 'modern' })

// Applica formattazione e salva
await doc.applyStyle('heading1', 'Relazione Q4 2024')
await doc.exportToPDF('./report-q4.pdf')`,
      output: [
        '📄 Inizializzazione Word Server...',
        '✅ Microsoft Word collegato',
        '📋 Caricamento template: template.docx',
        '🔄 Sostituzione placeholder: {{CLIENTE}}',
        '📊 Inserimento tabella dati vendite...',
        '🎨 Applicazione stile: heading1',
        '📑 Export PDF: report-q4.pdf',
        '💾 Documento salvato con successo!'
      ],
      color: 'text-accent-400'
    },
    {
      id: 'filesystem',
      name: 'Filesystem Server',
      icon: FolderOpen,
      title: 'Gestione Filesystem Intelligente',
      description: 'Organizza, sincronizza e monitora file e cartelle con algoritmi intelligenti',
      code: `// Filesystem Server MCP per gestione avanzata
import { FilesystemServer } from '@mcp/filesystem-server'

const fs = new FilesystemServer()

// Backup automatico con compressione
await fs.backup('./project', './backups/', {
  compress: true,
  incremental: true,
  exclude: ['node_modules', '.git']
})

// Monitoraggio cambiamenti real-time
fs.watch('./src', (event) => {
  console.log('File modificato:', event.path)
  triggerHotReload(event.path)
})`,
      output: [
        '📁 Inizializzazione Filesystem Server...',
        '✅ Accesso filesystem confermato',
        '💾 Avvio backup incrementale...',
        '🗜️  Compressione attiva (ratio: 73%)',
        '📋 Esclusioni: node_modules, .git',
        '👁️  Monitoraggio attivo su ./src',
        '⚡ Hot-reload configurato',
        '✅ Sistema pronto per operazioni!'
      ],
      color: 'text-success-400'
    }
  ]

  useEffect(() => {
    if (isTyping) return

    const example = codeExamples[activeDemo]
    setTypingText('')
    setCurrentOutputLine(0)
    setIsTyping(true)

    // Typewriter effect for code
    let index = 0
    const typeCode = () => {
      if (index < example.code.length) {
        setTypingText(example.code.slice(0, index + 1))
        index++
        typewriterRef.current = window.setTimeout(typeCode, 20)
      } else {
        // Start output animation
        animateOutput()
      }
    }

    const animateOutput = () => {
      let lineIndex = 0
      const showNextLine = () => {
        if (lineIndex < example.output.length) {
          setCurrentOutputLine(lineIndex + 1)
          lineIndex++
          setTimeout(showNextLine, 400)
        } else {
          setIsTyping(false)
        }
      }
      setTimeout(showNextLine, 500)
    }

    typeCode()

    return () => {
      if (typewriterRef.current) {
        clearTimeout(typewriterRef.current)
      }
    }
  }, [activeDemo])

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <section id="demo" className="relative py-20 section-container">
      {/* Background - PIù TRASPARENTE per vedere l'icosaedro */}
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
            <Play className="w-8 h-8 text-warning-400 mr-3" />
            <span className="text-warning-400 font-semibold text-lg">Trial 48h Gratuito</span>
          </div>
          {/* Main Title con Safe Zone Avanzata */}
          <div className="relative max-w-4xl mx-auto mb-6">
            {/* Safe Zone Background - Protezione dalle particelle DNA verde-blu */}
            <div className="absolute inset-0 bg-black/25 backdrop-blur-md rounded-2xl shadow-2xl shadow-black/50 border border-white/10 -m-6"></div>
            <div className="relative px-6 py-4">
              <h2 className="text-4xl md:text-6xl font-bold text-reveal mb-6">
                Prova Subito{' '}
                <span className="bg-gradient-to-r from-warning-400 to-success-400 bg-clip-text text-transparent">
                  Gratuitamente
                </span>
              </h2>
              {/* Linea decorativa warning-success */}
              <div className="w-32 h-1 bg-gradient-to-r from-warning-500 to-success-500 mx-auto rounded-full"></div>
            </div>
          </div>
          {/* Description con Safe Zone */}
          <div className="relative mb-8">
            {/* Safe Zone Background */}
            <div className="absolute inset-0 bg-black/14 backdrop-blur-sm rounded-xl -m-3"></div>
            <p className="relative text-xl text-gray-400 max-w-3xl mx-auto px-3">
              Scarica il trial completo 48 ore e testa tutti i server MCP in azione. 
              Nessuna carta di credito richiesta.
            </p>
          </div>
          
          {/* Trial CTA */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-gradient-to-r from-warning-600/20 to-success-600/20 border border-warning-400/30 rounded-2xl p-6 max-w-2xl mx-auto mb-12"
          >
            <div className="flex items-center justify-center space-x-4 mb-4">
              <Clock className="w-8 h-8 text-warning-400" />
              <div className="text-left">
                <div className="text-2xl font-bold text-white">48 Ore Complete</div>
                <div className="text-warning-400 font-medium">Accesso illimitato a tutto</div>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: loading ? 1 : 1.05, y: loading ? 0 : -2 }}
              whileTap={{ scale: loading ? 1 : 0.95 }}
              onClick={handleDownloadClick}
              disabled={loading}
              className="bg-gradient-to-r from-warning-600 to-success-600 text-white px-8 py-4 rounded-full font-semibold text-lg flex items-center space-x-3 mx-auto hover:shadow-xl hover:shadow-warning-500/25 transition-all duration-300 disabled:opacity-70"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : downloadSuccess ? (
                <Star className="w-5 h-5 text-yellow-300" />
              ) : (
                <Download className="w-5 h-5" />
              )}
              <span>
                {loading ? 'Preparazione...' : downloadSuccess ? 'Download Avviato!' : 'Scarica Trial Gratuito'}
              </span>
            </motion.button>
          </motion.div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 bg-red-500/20 border border-red-500/30 rounded-lg p-4 text-red-300 text-center max-w-md mx-auto"
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
        </motion.div>

        {/* Demo Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          {codeExamples.map((example, index) => (
            <motion.button
              key={example.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveDemo(index)}
              className={`flex items-center space-x-3 px-6 py-3 rounded-full border-2 transition-all duration-300 ${
                activeDemo === index
                  ? `border-${example.color.split('-')[1]}-400 bg-${example.color.split('-')[1]}-400/10 ${example.color}`
                  : 'border-white/20 bg-white/10 text-white/80 hover:border-white/40 hover:text-white'
              }`}
            >
              <example.icon className="w-5 h-5" />
              <span className="font-medium">{example.name}</span>
            </motion.button>
          ))}
        </motion.div>

        {/* Interactive Demo */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeDemo}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.5 }}
            className="max-w-7xl mx-auto"
          >
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Code Editor */}
              <div className="bg-black/80 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden">
                {/* Editor Header */}
                <div className="flex items-center justify-between bg-gray-900/50 px-6 py-4 border-b border-white/10">
                  <div className="flex items-center space-x-4">
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                    <span className="text-gray-400 text-sm font-mono">
                      {codeExamples[activeDemo].name.toLowerCase().replace(' ', '-')}-demo.ts
                    </span>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => copyToClipboard(codeExamples[activeDemo].code)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                  </motion.button>
                </div>

                {/* Code Content */}
                <div className="p-6">
                  <div className="mb-4">
                    <h3 className={`text-xl font-bold ${codeExamples[activeDemo].color} mb-2`}>
                      {codeExamples[activeDemo].title}
                    </h3>
                    <p className="text-gray-400 text-sm">
                      {codeExamples[activeDemo].description}
                    </p>
                  </div>
                  
                  <pre className="font-mono text-sm text-green-400 bg-black/50 p-4 rounded-lg border border-white/5 overflow-x-auto">
                    <code>{typingText}</code>
                    <span className="animate-pulse text-white">|</span>
                  </pre>
                </div>
              </div>

              {/* Terminal Output */}
              <div className="bg-black/80 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden">
                {/* Terminal Header */}
                <div className="flex items-center justify-between bg-gray-900/50 px-6 py-4 border-b border-white/10">
                  <div className="flex items-center space-x-4">
                    <Terminal className="w-5 h-5 text-green-400" />
                    <span className="text-gray-400 text-sm font-mono">
                      MCP Platform Terminal
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-green-400 text-xs">CONNECTED</span>
                  </div>
                </div>

                {/* Terminal Content */}
                <div className="p-6 font-mono text-sm min-h-[400px]">
                  <div className="text-blue-400 mb-4">
                    $ mcp-platform run {codeExamples[activeDemo].id}-demo
                  </div>
                  
                  <div className="space-y-2">
                    {codeExamples[activeDemo].output.slice(0, currentOutputLine).map((line, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                        className="text-gray-300"
                      >
                        {line}
                      </motion.div>
                    ))}
                  </div>

                  {currentOutputLine === codeExamples[activeDemo].output.length && !isTyping && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className="mt-4 pt-4 border-t border-white/10"
                    >
                      <div className="text-green-400 mb-2">✅ Esecuzione completata con successo!</div>
                      <div className="text-blue-400">$ _</div>
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Demo Features */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid md:grid-cols-3 gap-8 mt-16 card-container"
        >
          {[
            {
              icon: Zap,
              title: 'Setup Immediato',
              description: 'Installazione automatica e configurazione guidata. Pronto in 2 minuti.',
              color: 'text-primary-400'
            },
            {
              icon: CheckCircle,
              title: 'Funzionalità Complete',
              description: 'Accesso completo a tutti i server MCP senza limitazioni per 48 ore.',
              color: 'text-success-400'
            },
            {
              icon: Clock,
              title: 'Supporto Incluso',
              description: 'Assistenza tecnica via email durante tutto il periodo di trial.',
              color: 'text-warning-400'
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="card-item bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center hover:border-white/20 transition-all duration-300"
            >
              <feature.icon className={`w-12 h-12 ${feature.color} mx-auto mb-4`} />
              <h4 className="text-xl font-bold text-white mb-2">{feature.title}</h4>
              <p className="text-gray-400">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Final CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-black via-gray-900/50 to-black border border-white/10 rounded-3xl p-8 max-w-4xl mx-auto">
            <h3 className="text-3xl font-bold text-white mb-4">
              Pronto a trasformare il tuo workflow?
            </h3>
            <p className="text-gray-400 mb-8 text-lg">
              Scarica il trial 48h gratuito e scopri quanto può essere potente l&apos;automazione MCP
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: loading ? 1 : 1.05, y: loading ? 0 : -2 }}
                whileTap={{ scale: loading ? 1 : 0.95 }}
                onClick={handleDownloadClick}
                disabled={loading}
                className="bg-gradient-to-r from-warning-600 to-success-600 text-white px-8 py-4 rounded-full font-semibold text-lg flex items-center space-x-3 justify-center hover:shadow-xl hover:shadow-warning-500/25 transition-all duration-300 disabled:opacity-70"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : downloadSuccess ? (
                  <Star className="w-5 h-5 text-yellow-300" />
                ) : (
                  <Download className="w-5 h-5" />
                )}
                <span>
                  {loading ? 'Preparazione...' : downloadSuccess ? 'Download Avviato!' : 'Scarica Trial Gratuito'}
                </span>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="border-2 border-white/20 text-white px-8 py-4 rounded-full font-semibold text-lg hover:border-white/40 transition-all duration-300 flex items-center space-x-3 justify-center"
              >
                <span>Vedi Prezzi</span>
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
