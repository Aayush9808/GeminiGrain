import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import { Playfair_Display, Inter, JetBrains_Mono } from 'next/font/google'

const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-serif-display' })
const inter = Inter({ subsets: ['latin'], variable: '--font-sans-body' })
const jetMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-geist-mono' })

export const metadata: Metadata = {
  title: 'GeminiGrain — Every Meal Saved Matters',
  description:
    'GeminiGrain is a social impact platform connecting donors, NGOs, and volunteers to rescue safe surplus food and serve communities with dignity.',
  keywords: 'GeminiGrain, food donation, NGO, volunteer, social impact, food rescue',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${playfair.variable} ${inter.variable} ${jetMono.variable} bg-rq-bg text-rq-text antialiased min-h-screen`}>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#FFFFFF',
              color: '#0F172A',
              border: '1px solid #E2E8F0',
              borderRadius: '10px',
              fontSize: '14px',
              boxShadow: '0 12px 32px rgba(15, 23, 42, 0.12)',
            },
            success: {
              iconTheme: { primary: '#16A34A', secondary: '#FFFFFF' },
            },
            error: {
              iconTheme: { primary: '#DC2626', secondary: '#FFFFFF' },
            },
          }}
        />
      </body>
    </html>
  )
}
