import React from "react"
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

import './globals.css'

const _inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'KCD Panama 2026 - Kubernetes Community Days',
  description:
    'Join the cloud-native community at Kubernetes Community Days Panama 2026. Apr 21-23, 2026 at Ciudad del Saber, Panama City.',
}

export const viewport = {
  themeColor: '#0086FF',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
