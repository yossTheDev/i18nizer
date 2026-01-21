import type { Metadata } from 'next'
import './globals.css'
import 'highlight.js/styles/github-dark.css'
import { Providers } from '@/components/Providers'
import { Sidebar } from '@/components/Sidebar'
import { Header } from '@/components/Header'

export const metadata: Metadata = {
  metadataBase: new URL('https://i18nizer.dev'),
  title: {
    default: 'i18nizer - Automated i18n for React & Next.js',
    template: '%s | i18nizer',
  },
  description: 'CLI tool to extract translatable strings from JSX/TSX files, generate i18n JSON with AI translations, and rewrite components automatically.',
  keywords: ['i18n', 'internationalization', 'translation', 'React', 'Next.js', 'CLI', 'AI', 'automation', 'i18next', 'next-intl'],
  authors: [{ name: 'Yoannis Sanchez Soto' }],
  creator: 'Yoannis Sanchez Soto',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://i18nizer.dev',
    title: 'i18nizer - Automated i18n for React & Next.js',
    description: 'CLI tool to extract translatable strings from JSX/TSX files, generate i18n JSON with AI translations, and rewrite components automatically.',
    siteName: 'i18nizer',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'i18nizer - Automated i18n for React & Next.js',
    description: 'CLI tool to extract translatable strings from JSX/TSX files, generate i18n JSON with AI translations, and rewrite components automatically.',
    creator: '@yossthedev',
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
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <Providers>
          <div className="min-h-screen flex flex-col">
            <Header />
            <div className="flex-1 flex">
              <Sidebar />
              <main className="flex-1 lg:ml-64">
                <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
                  {children}
                </div>
              </main>
            </div>
          </div>
        </Providers>
      </body>
    </html>
  )
}
