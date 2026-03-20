import type React from "react"
import type { Metadata } from "next"
import { Inter, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css"
import Script from "next/script"

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap"
})
const geistMono = Geist_Mono({ 
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap"
})

export const metadata: Metadata = {
  title: "Muhammad Saad | 3D Portfolio",
  description:
    "Explore my work in an immersive 3D house experience - Software Engineer specializing in ERPNext, Flutter, React Native, and Backend Integrations",
  generator: "v0.app",
  keywords: ["Muhammad Saad", "Portfolio", "3D Portfolio", "Software Engineer", "ERPNext", "Flutter", "React Native"],
  authors: [{ name: "Muhammad Saad" }],
  openGraph: {
    title: "Muhammad Saad | 3D Portfolio",
    description: "Explore my work in an immersive 3D house experience",
    type: "website",
  },
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
