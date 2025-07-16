"use client"

import type React from "react"

import { ThemeProvider } from "next-themes"
import { CartProvider } from "@/context/cart-context"
import { WalletProvider } from "@/context/wallet-context"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <CartProvider>
        <WalletProvider>{children}</WalletProvider>
      </CartProvider>
    </ThemeProvider>
  )
}
