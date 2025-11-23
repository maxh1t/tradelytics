import './globals.css'
import { Geist, Geist_Mono } from 'next/font/google'

import { Toaster } from '@/src/components/ui/sonner'
import { CDPProvider } from '@/src/lib/cdn'

import type { Metadata } from 'next'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Tradelytics',
  description: 'All your web3 trading data in one place with real time positions and PnL.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <CDPProvider>
          {children}
          <Toaster />
        </CDPProvider>
      </body>
    </html>
  )
}
