import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { MotionProvider } from '@/components/motion'
import './globals.css'

// Enables entrance/reveal animations before first paint (skipped when JS is off).
const motionBootstrap = "document.documentElement.classList.add('motion-ready')"

export const metadata: Metadata = {
  title: {
    default: 'Sientax | Simplifying Taxation',
    template: '%s | Sientax',
  },
  description: 'Trusted tax and accounting solutions for individuals and businesses across the USA.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#f6f5ed',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <script dangerouslySetInnerHTML={{ __html: motionBootstrap }} />
      </head>
      <body className="antialiased">
        <MotionProvider />
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
