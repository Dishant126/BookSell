"use client"

import React, { createContext, useContext, useState, useEffect, useCallback } from "react"
import { toast } from "@/components/ui/use-toast"
import type { WalletTransaction } from "@/lib/types"
import { mockWalletTransactions } from "@/lib/mock-data"

interface WalletContextType {
  balance: number
  transactions: WalletTransaction[]
  deposit: (amount: number, method: string) => void
  withdraw: (amount: number, purpose: string, orderId?: string, rentalId?: string) => boolean
  refreshBalance: () => void
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [balance, setBalance] = useState<number>(0)
  const [transactions, setTransactions] = useState<WalletTransaction[]>([])

  // Load balance and transactions from localStorage on initial load
  useEffect(() => {
    const storedBalance = localStorage.getItem("walletBalance")
    if (storedBalance) {
      setBalance(Number.parseFloat(storedBalance))
    } else {
      setBalance(150.0) // Initial mock balance
      localStorage.setItem("walletBalance", "150.00")
    }

    const storedTransactions = localStorage.getItem("walletTransactions")
    if (storedTransactions) {
      setTransactions(JSON.parse(storedTransactions))
    } else {
      setTransactions(mockWalletTransactions)
      localStorage.setItem("walletTransactions", JSON.stringify(mockWalletTransactions))
    }
  }, [])

  // Save balance and transactions to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("walletBalance", balance.toFixed(2))
  }, [balance])

  useEffect(() => {
    localStorage.setItem("walletTransactions", JSON.stringify(transactions))
  }, [transactions])

  const addTransaction = useCallback((newTransaction: WalletTransaction) => {
    setTransactions((prevTransactions) => [newTransaction, ...prevTransactions])
  }, [])

  const deposit = useCallback(
    (amount: number, method: string) => {
      if (amount <= 0) {
        toast({
          title: "Invalid Amount",
          description: "Deposit amount must be positive.",
          variant: "destructive",
        })
        return
      }
      setBalance((prevBalance) => {
        const newBalance = prevBalance + amount
        toast({
          title: "Deposit Successful!",
          description: `Successfully added $${amount.toFixed(2)} to your wallet. New balance: $${newBalance.toFixed(2)}.`,
        })
        addTransaction({
          id: `WTXN-${Date.now()}`,
          type: "deposit",
          amount: amount,
          date: new Date().toISOString(),
          description: "Wallet top-up",
          method: method,
        })
        return newBalance
      })
    },
    [addTransaction],
  )

  const withdraw = useCallback(
    (amount: number, purpose: string, orderId?: string, rentalId?: string) => {
      if (amount <= 0) {
        toast({
          title: "Invalid Amount",
          description: "Withdrawal amount must be positive.",
          variant: "destructive",
        })
        return false
      }
      if (balance >= amount) {
        setBalance((prevBalance) => {
          const newBalance = prevBalance - amount
          toast({
            title: "Payment Successful!",
            description: `Successfully paid $${amount.toFixed(2)} from your wallet. Remaining balance: $${newBalance.toFixed(2)}.`,
          })
          addTransaction({
            id: `WTXN-${Date.now()}`,
            type: "payment",
            amount: -amount, // Negative for withdrawal
            date: new Date().toISOString(),
            description: purpose,
            method: "Wallet",
            orderId: orderId,
            rentalId: rentalId,
          })
          return newBalance
        })
        return true
      } else {
        toast({
          title: "Insufficient Funds",
          description: `Your wallet balance ($${balance.toFixed(2)}) is insufficient for this transaction ($${amount.toFixed(2)}).`,
          variant: "destructive",
        })
        return false
      }
    },
    [balance, addTransaction],
  )

  const refreshBalance = useCallback(() => {
    const storedBalance = localStorage.getItem("walletBalance")
    if (storedBalance) {
      setBalance(Number.parseFloat(storedBalance))
    }
    const storedTransactions = localStorage.getItem("walletTransactions")
    if (storedTransactions) {
      setTransactions(JSON.parse(storedTransactions))
    }
  }, [])

  const value = React.useMemo(
    () => ({
      balance,
      transactions,
      deposit,
      withdraw,
      refreshBalance,
    }),
    [balance, transactions, deposit, withdraw, refreshBalance],
  )

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
}

export function useWallet() {
  const context = useContext(WalletContext)
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider")
  }
  return context
}
