import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import { Sora, JetBrains_Mono } from 'next/font/google'

const sora = Sora({ subsets: ['latin'], variable: '--font-geist-sans' })
const jetMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-geist-mono' })

export const metadata: Metadata = {
  title: 'GeminiGrain — Rescue Surplus Food with AI',
  description:
    'GeminiGrain is an AI-powered food rescue platform connecting surplus food donors with NGOs in real-time using Google Gemini API.',
  keywords: 'GeminiGrain, food rescue, AI, Gemini, NGO, food waste, sustainability',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${sora.variable} ${jetMono.variable} bg-rq-bg text-rq-text antialiased min-h-screen`}>
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
