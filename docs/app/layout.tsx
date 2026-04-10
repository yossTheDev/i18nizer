import type { Metadata } from 'next'
import './globals.css'
import 'highlight.js/styles/github-dark.css'
import { Providers } from '@/components/Providers'
import { AppLayout } from '@/components/AppLayout'

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
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    'name': 'i18nizer',
    'operatingSystem': 'Any',
    'applicationCategory': 'DeveloperApplication',
    'description': 'CLI tool to extract translatable strings from JSX/TSX files, generate i18n JSON with AI translations, and rewrite components automatically.',
    'offers': {
      '@type': 'Offer',
      'price': '0',
      'priceCurrency': 'USD'
    }
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-sans antialiased bg-terminal-bg text-terminal-fg min-h-screen relative overflow-x-hidden">
        {/* Decorative background elements */}
        <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0 overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary-500/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary-900/10 rounded-full blur-[120px]" />
          <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-primary-400/5 rounded-full blur-[100px]" />
        </div>

        <Providers>
          <AppLayout>{children}</AppLayout>
        </Providers>
      </body>
    </html>
  )
}
