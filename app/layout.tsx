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
    default: 'AI 提示詞庫 - 專業的 AI 提示詞平台',
    template: '%s | AI 提示詞庫'
  },
  description: '探索、分析並學習來自 30+ 個 AI 工具的系統提示詞。專業的提示詞工程洞察平台。',
  keywords: ['AI 提示詞', '系統提示詞', '提示詞工程', 'Claude', 'GPT', 'Cursor', 'AI 工具'],
  authors: [{ name: 'AI 提示詞庫團隊' }],
  creator: 'AI 提示詞庫',
  openGraph: {
    type: 'website',
    locale: 'zh_TW',
    url: 'https://aipromptlibrary.com',
    title: 'AI 提示詞庫',
    description: '專業的 AI 提示詞收集與分析平台',
    siteName: 'AI 提示詞庫',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'AI 提示詞庫'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI 提示詞庫',
    description: '專業的 AI 提示詞收集與分析平台',
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
      <body className={`${inter.className} min-h-screen flex flex-col overflow-x-hidden`}>
        <Providers>
          <Header />
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
          <Footer />
          <Toaster position="bottom-right" />
        </Providers>
      </body>
    </html>
  )
}