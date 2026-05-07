// path: src/app/layout.tsx
import type React from 'react'
import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from '@/components/ui/sonner'
import { Providers } from '@/components/providers'
import { NotificationBanner } from '@/components/ui/notification-banner'

export const metadata: Metadata = {
  title: 'Teraverse - Enhanced Gameplay for Gigaverse',
  description: 'Connect and automate your Gigaverse gameplay experience',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans">
        <Providers>
          <NotificationBanner />
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}
