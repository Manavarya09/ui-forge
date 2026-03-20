import React from "react"
import type { Metadata, Viewport } from 'next'
import { Bebas_Neue, JetBrains_Mono } from 'next/font/google'

import './globals.css'

const _bebasNeue = Bebas_Neue({ 
  weight: '400',
  subsets: ['latin'],
  variable: '--font-bebas',
})

const _jetbrainsMono = JetBrains_Mono({ 
  subsets: ['latin'],
  variable: '--font-jetbrains',
})

export const metadata: Metadata = {
  title: 'IRON DISTRICT // CrossFit',
  description: 'Raw. Relentless. Results. No shortcuts. No excuses. Just iron.',
  openGraph: {
    title: 'IRON DISTRICT // CrossFit',
    description: 'Raw brutalist CrossFit landing page. Heavy typography, aggressive animations, industrial textures. Built with Next.js and Tailwind.',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'IRON DISTRICT - Break Every Limit',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'IRON DISTRICT // CrossFit',
    description: 'Raw brutalist CrossFit landing page. Built with just prompts in v0.',
    images: ['/images/og-image.jpg'],
  },
}

export const viewport: Viewport = {
  themeColor: '#080808',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${_bebasNeue.variable} ${_jetbrainsMono.variable}`}>
      <body className="font-mono antialiased overflow-x-hidden">{children}</body>
    </html>
  )
}
