
"use client"

import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { TonConnectUIProvider } from "@tonconnect/ui-react"

const inter = Inter({ subsets: ["latin"] })

// export const metadata: Metadata = {
//   title: "Hash Coin - Tap to Earn",
//   description: "The ultimate tap-to-earn game with TON wallet integration",
//     generator: 'v0.dev'
// }

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <TonConnectUIProvider manifestUrl="https://hash-coin-alpha.vercel.app/tonconnect-manifest.json">{children}</TonConnectUIProvider>
      </body>
    </html>
  )
}
