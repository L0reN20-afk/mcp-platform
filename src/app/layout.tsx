import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'MCP Platform - Automazione Server MCP Professionali',
  description: 'Piattaforma che offre abbonamenti mensili per server MCP personalizzati. VS Code, Visual Studio 2022, Word e Filesystem automation. Trial 48h gratuito.',
  keywords: ['MCP', 'Model Context Protocol', 'Automazione', 'VS Code', 'Visual Studio', 'Microsoft Word', 'Filesystem', 'Server', 'Trial gratuito'],
  authors: [{ name: 'MCP Platform Team' }],
  creator: 'MCP Platform',
  publisher: 'MCP Platform',
  robots: 'index, follow',
  openGraph: {
    title: 'MCP Platform - Server MCP Professionali',
    description: 'Automazione completa con server MCP personalizzati. Trial 48h gratuito disponibile.',
    url: 'https://mcpplatform.com',
    siteName: 'MCP Platform',
    locale: 'it_IT',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MCP Platform - Server MCP Professionali',
    description: 'Automazione completa con server MCP personalizzati. Trial 48h gratuito.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="it">
      <body className={`${inter.className} text-white`}>
        {children}
      </body>
    </html>
  )
}
