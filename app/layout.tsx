import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'AI Prompt Library - Professional SaaS for AI Prompts',
    template: '%s | AI Prompt Library'
  },
  description: 'Explore, analyze, and learn from 30+ AI tools system prompts. Professional SaaS platform for prompt engineering.',
  keywords: ['AI prompts', 'system prompts', 'prompt engineering', 'Claude', 'GPT', 'Cursor', 'AI tools'],
  authors: [{ name: 'AI Prompt Library Team' }],
  creator: 'AI Prompt Library',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://aipromptlibrary.com',
    title: 'AI Prompt Library',
    description: 'Professional SaaS platform for AI prompts collection and analysis',
    siteName: 'AI Prompt Library',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'AI Prompt Library'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Prompt Library',
    description: 'Professional SaaS platform for AI prompts collection and analysis',
    images: ['/og-image.png'],
    creator: '@aipromptlib'
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <Providers>
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
          <Toaster position="bottom-right" />
        </Providers>
      </body>
    </html>
  )
}