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
    <section id="demo" className="demo-section">
      
      <div className="demo-container mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="demo-header fade-in"
        >
          <div className="demo-badge">
            <Play className="demo-badge-icon text-primary-400" />
            <span className="demo-badge-text text-primary-400 font-semibold">Trial 48h Gratuito</span>
          </div>
          {/* Main Title */}
          <div className="max-w-4xl mx-auto mb-6">
            <div className="px-6 py-4">
              <h2 className="demo-title text-reveal">
                Prova Subito{' '}
                <span className="bg-gradient-to-r from-warning-400 to-primary-400 bg-clip-text text-transparent">
                  Gratuitamente
                </span>
              </h2>
              {/* Linea decorativa warning-success */}
              <div className="demo-divider bg-gradient-to-r from-warning-500 to-primary-500"></div>
            </div>
          </div>
          {/* Description - Direttamente sotto senza wrapper aggiuntivo */}
          <p className="demo-description text-gray-400" style={{ filter: 'brightness(1.1)' }}>
            Scarica il trial completo 48 ore e testa tutti i server MCP in azione. 
            Nessuna carta di credito richiesta.
          </p>
          
          {/* Trial CTA */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="demo-trial-cta bg-gradient-to-r from-warning-600/20 to-primary-600/20 border border-primary-400/30"
          >
            <div className="demo-trial-content">
              <Clock className="demo-trial-icon text-primary-400" />
              <div className="demo-trial-text">
                <div className="demo-trial-title text-white">48 Ore Complete</div>
                <div className="demo-trial-subtitle text-primary-400">Accesso illimitato a tutto</div>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: loading ? 1 : 1.05, y: loading ? 0 : -2 }}
              whileTap={{ scale: loading ? 1 : 0.95 }}
              onClick={handleDownloadClick}
              disabled={loading}
              className="demo-trial-button bg-gradient-to-r from-warning-600 to-primary-600 text-white hover:shadow-xl hover:shadow-primary-500/25 disabled:opacity-70"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : downloadSuccess ? (
                <Star className="w-4 h-4 text-yellow-300" />
              ) : (
                <Download className="w-4 h-4" />
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
          className="demo-tabs"
        >
          {codeExamples.map((example, index) => (
            <motion.button
              key={example.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveDemo(index)}
              className={`demo-tab-button border-2 backdrop-blur-lg transition-all duration-300 ${
                activeDemo === index
                  ? `border-${example.color.split('-')[1]}-400 bg-${example.color.split('-')[1]}-400/10 ${example.color}`
                  : 'border-white/20 bg-white/10 text-white/80 hover:border-white/40 hover:text-white'
              }`}
            >
              <example.icon className="demo-tab-icon" />
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
            <div className="demo-grid">
              {/* Code Editor */}
              <div className="demo-code-container bg-black/80 backdrop-blur-lg border border-white/10">
                {/* Editor Header */}
                <div className="demo-code-header bg-gray-900/50 border-b border-white/10">
                  <div className="demo-code-dots">
                    <div className="demo-code-dot bg-red-500"></div>
                    <div className="demo-code-dot bg-yellow-500"></div>
                    <div className="demo-code-dot bg-green-500"></div>
                  </div>
                  <span className="demo-code-title text-gray-400 font-mono">
                    {codeExamples[activeDemo].name.toLowerCase().replace(' ', '-')}-demo.ts
                  </span>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => copyToClipboard(codeExamples[activeDemo].code)}
                    className="text-gray-400 hover:text-white transition-colors ml-auto"
                  >
                    <Copy className="w-3 h-3" />
                  </motion.button>
                </div>

                {/* Code Content */}
                <div className="demo-code-content">
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
              <div className="demo-terminal-container bg-black/80 backdrop-blur-lg border border-white/10">
                {/* Terminal Header */}
                <div className="demo-terminal-header bg-gray-900/50 border-b border-white/10">
                  <div className="flex items-center space-x-4">
                    <Terminal className="w-4 h-4 text-green-400" />
                    <span className="demo-terminal-title text-gray-400 font-mono">
                      MCP Platform Terminal
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 ml-auto">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-green-400 text-xs">CONNECTED</span>
                  </div>
                </div>

                {/* Terminal Content */}
                <div className="demo-terminal-content">
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
          className="demo-features-grid card-container"
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
              color: 'text-primary-400'
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="demo-feature-card bg-white/5 backdrop-blur-lg border border-white/10 hover:border-white/20 transition-all duration-300"
            >
              <feature.icon className={`demo-feature-icon ${feature.color} mx-auto`} />
              <h4 className="demo-feature-title text-white">{feature.title}</h4>
              <p className="demo-feature-description text-gray-400">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
