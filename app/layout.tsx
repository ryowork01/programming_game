import type React from "react"
import type { Metadata, Viewport } from "next"
import { Geist } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })

// ✅ こちらに viewport を独立させる
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
}

// ✅ metadata から viewport を削除
export const metadata: Metadata = {
  title: "RPG学習アプリ",
  description: "Dragon Quest-style RPG Learning App",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ja">
      <body className={`font-sans antialiased bg-rpg-dark text-rpg-text`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
