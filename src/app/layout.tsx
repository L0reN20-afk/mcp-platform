import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Buildmyth - MCP Platform',
  description: 'Piattaforma che offre abbonamenti mensili per server MCP personalizzati. VS Code, Visual Studio 2022, Word e Filesystem automation. Trial 48h gratuito.',
  keywords: ['MCP', 'Model Context Protocol', 'Automazione', 'VS Code', 'Visual Studio', 'Microsoft Word', 'Filesystem', 'Server', 'Trial gratuito', 'Buildmyth'],
  authors: [{ name: 'Buildmyth Team' }],
  creator: 'Buildmyth',
  publisher: 'Buildmyth',
  robots: 'index, follow',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/icon.png',
  },
  openGraph: {
    title: 'Buildmyth - MCP Platform',
    description: 'Automazione completa con server MCP personalizzati. Trial 48h gratuito disponibile.',
    url: 'https://buildmyth.com',
    siteName: 'Buildmyth',
    locale: 'it_IT',
    type: 'website',
    images: [
      {
        url: 'https://buildmyth.com/images/logo.png',
        width: 1200,
        height: 630,
        alt: 'Buildmyth Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Buildmyth - MCP Platform',
    description: 'Automazione completa con server MCP personalizzati. Trial 48h gratuito.',
    images: ['https://buildmyth.com/images/logo.png'],
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
