import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/app/components/Navbar'
import Footer from '@/app/components/Footer'
import { Providers } from './providers' // ✅ import the new wrapper

export const metadata: Metadata = {
  title: 'My Medium Blog',
  description: 'A Medium-like blog platform built with Next.js',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white">
        <Providers>
          <Navbar />
          <main className="min-h-screen">{children}</main>
          {/* <Footer /> */}
        </Providers>
      </body>
    </html>
  )
}
