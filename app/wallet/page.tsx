"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Wallet, PlusCircle, History, CreditCard, Banknote, MinusCircle } from "lucide-react"
import { useWallet } from "@/context/wallet-context"
import { toast } from "@/components/ui/use-toast"

export default function WalletPage() {
  const { balance, transactions, deposit, withdraw, refreshBalance } = useWallet()
  const [depositAmount, setDepositAmount] = useState("")
  const [withdrawalAmount, setWithdrawalAmount] = useState("")
  const [isProcessingDeposit, setIsProcessingDeposit] = useState(false)
  const [isProcessingWithdrawal, setIsProcessingWithdrawal] = useState(false)

  useEffect(() => {
    refreshBalance() // Ensure balance and transactions are fresh on mount
  }, [refreshBalance])

  const formatPrice = (price: number) => `$${Math.abs(price).toFixed(2)}`

  const handleDeposit = async () => {
    const amount = Number.parseFloat(depositAmount)
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount greater than 0.",
        variant: "destructive",
      })
      return
    }

    setIsProcessingDeposit(true)
    await new Promise((resolve) => setTimeout(resolve, 1500)) // Simulate processing delay

    deposit(amount, "Credit Card") // Assuming credit card for mock deposit
    setDepositAmount("")
    setIsProcessingDeposit(false)
  }

  const handleWithdrawal = async () => {
    const amount = Number.parseFloat(withdrawalAmount)
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount greater than 0.",
        variant: "destructive",
      })
      return
    }

    setIsProcessingWithdrawal(true)
    await new Promise((resolve) => setTimeout(resolve, 1500)) // Simulate processing delay

    const success = withdraw(amount, "Wallet Withdrawal")
    if (success) {
      setWithdrawalAmount("")
    }
    setIsProcessingWithdrawal(false)
  }

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "deposit":
        return <PlusCircle className="h-4 w-4 text-green-600" />
      case "payment":
        return <Wallet className="h-4 w-4 text-red-600" />
      case "withdrawal":
        return <MinusCircle className="h-4 w-4 text-red-600" />
      default:
        return <History className="h-4 w-4 text-muted-foreground" />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-muted/30 border-b">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">My Wallet</h1>
          <p className="text-muted-foreground">Manage your wallet balance and view transaction history.</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Current Balance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="h-6 w-6 text-amber-600" />
                Current Balance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-amber-600 mb-4">{formatPrice(balance)}</div>
              <p className="text-muted-foreground">Available for purchases and rentals</p>
            </CardContent>
          </Card>

          {/* Transaction History */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-6 w-6" />
                Transaction History
              </CardTitle>
            </CardHeader>
            <CardContent>
              {transactions.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No transactions yet</p>
              ) : (
                <div className="space-y-4">
                  {transactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {getTransactionIcon(transaction.type)}
                        <div>
                          <p className="font-medium">{transaction.description}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(transaction.date).toLocaleDateString()} • {transaction.method || "N/A"}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-semibold ${transaction.amount > 0 ? "text-green-600" : "text-red-600"}`}>
                          {transaction.amount > 0 ? "+" : ""}
                          {formatPrice(transaction.amount)}
                        </p>
                        <p className="text-xs text-muted-foreground">{transaction.id}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Add/Withdraw Money */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PlusCircle className="h-6 w-6 text-amber-600" />
                Add Money
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="deposit-amount">Amount</Label>
                <Input
                  id="deposit-amount"
                  type="number"
                  placeholder="Enter amount"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  className="border-muted-foreground/20 focus:border-amber-500"
                />
              </div>

              <div className="grid gap-3">
                <p className="text-sm font-medium">Quick Add:</p>
                <div className="grid grid-cols-3 gap-2">
                  {[25, 50, 100].map((amount) => (
                    <Button
                      key={amount}
                      variant="outline"
                      size="sm"
                      onClick={() => setDepositAmount(amount.toString())}
                      className="border-amber-600 text-amber-600 hover:bg-amber-50 hover:text-amber-700"
                    >
                      ${amount}
                    </Button>
                  ))}
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <p className="text-sm font-medium">Payment Method:</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 p-3 border rounded-lg">
                    <CreditCard className="h-4 w-4" />
                    <span className="text-sm">Credit/Debit Card</span>
                  </div>
                  <div className="flex items-center gap-2 p-3 border rounded-lg">
                    <Banknote className="h-4 w-4" />
                    <span className="text-sm">UPI</span>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleDeposit}
                disabled={isProcessingDeposit || !depositAmount}
                className="w-full bg-amber-600 hover:bg-amber-700"
              >
                {isProcessingDeposit ? "Processing..." : "Add Money"}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MinusCircle className="h-6 w-6 text-amber-600" />
                Withdraw Money (Mock)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="withdrawal-amount">Amount</Label>
                <Input
                  id="withdrawal-amount"
                  type="number"
                  placeholder="Enter amount"
                  value={withdrawalAmount}
                  onChange={(e) => setWithdrawalAmount(e.target.value)}
                  className="border-muted-foreground/20 focus:border-amber-500"
                />
              </div>
              <Button
                onClick={handleWithdrawal}
                disabled={isProcessingWithdrawal || !withdrawalAmount}
                className="w-full bg-amber-600 hover:bg-amber-700"
              >
                {isProcessingWithdrawal ? "Processing..." : "Withdraw Money"}
              </Button>
              <p className="text-xs text-muted-foreground">
                Note: This is a simulated withdrawal for demonstration purposes.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
