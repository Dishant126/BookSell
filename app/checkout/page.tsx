"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { ChevronLeft, CreditCard, Banknote, Wallet, ShoppingCart } from "lucide-react"
import { useCart } from "@/context/cart-context"
import { useWallet } from "@/context/wallet-context"
import { useRouter } from "next/navigation"
import { toast } from "@/components/ui/use-toast"
import type { Order } from "@/lib/types"

export default function CheckoutPage() {
  const { cartItems, getCartTotal, clearCart } = useCart()
  const { balance, withdraw } = useWallet()
  const router = useRouter()

  const [paymentMethod, setPaymentMethod] = useState("wallet")
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
  })
  const [upiId, setUpiId] = useState("")
  const [deliveryAddress, setDeliveryAddress] = useState("")
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)

  const subtotal = getCartTotal()
  const taxRate = 0.08 // 8% tax
  const tax = subtotal * taxRate
  const shipping = cartItems.some((item) => item.type === "buy") ? 5.0 : 0 // Flat shipping for purchased books
  const totalAmount = subtotal + tax + shipping

  const formatPrice = (price: number) => `$${price.toFixed(2)}`

  // Generate a simulated UPI QR code URL
  const upiQrCodeUrl = useMemo(() => {
    const simulatedUpiId = "bookmarketplace@bank"
    const encodedAmount = encodeURIComponent(totalAmount.toFixed(2))
    const encodedName = encodeURIComponent("Book Marketplace")
    const upiLink = `upi://pay?pa=${simulatedUpiId}&pn=${encodedName}&am=${encodedAmount}&cu=USD`
    return `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(upiLink)}`
  }, [totalAmount])

  const handlePayment = async () => {
    if (cartItems.length === 0) {
      toast({
        title: "Cart Empty",
        description: "Your cart is empty. Please add items before checking out.",
        variant: "destructive",
      })
      return
    }

    if (
      paymentMethod === "credit-card" &&
      (!cardDetails.cardNumber || !cardDetails.cardName || !cardDetails.expiryDate || !cardDetails.cvv)
    ) {
      toast({
        title: "Missing Card Details",
        description: "Please fill in all credit card details.",
        variant: "destructive",
      })
      return
    }

    if (paymentMethod === "upi" && !upiId && !isProcessingPayment) {
      toast({
        title: "Missing UPI ID",
        description: "Please enter your UPI ID or use the QR code.",
        variant: "destructive",
      })
      return
    }

    if (cartItems.some((item) => item.type === "buy") && !deliveryAddress) {
      toast({
        title: "Missing Delivery Address",
        description: "Please enter a delivery address for purchased books.",
        variant: "destructive",
      })
      return
    }

    setIsProcessingPayment(true)
    await new Promise((resolve) => setTimeout(resolve, 2000)) // Simulate payment processing delay

    let paymentSuccessful = false
    let orderId: string | undefined
    const rentalIds: string[] = []

    if (paymentMethod === "wallet") {
      paymentSuccessful = withdraw(totalAmount, "Checkout Payment")
    } else {
      // Simulate payment success for Credit Card and UPI
      paymentSuccessful = true
      toast({
        title: "Payment Successful!",
        description: `Payment of ${formatPrice(totalAmount)} completed successfully.`,
      })
    }

    if (paymentSuccessful) {
      orderId = `ORD-${Date.now()}`

      // Create order for all items
      const newOrder: Order = {
        id: orderId,
        items: cartItems.map((item) => ({
          bookId: item.id,
          title: item.title,
          author: item.author,
          price: item.type === "buy" ? item.price : item.rentPrice! * item.rentalDuration!,
          image: item.image,
          quantity: item.quantity,
          type: item.type,
          rentalDuration: item.rentalDuration,
          seller: item.seller,
        })),
        totalAmount: totalAmount,
        status: "Paid",
        orderDate: new Date().toISOString(),
        paymentMethod: paymentMethod === "credit-card" ? "Credit Card" : paymentMethod === "upi" ? "UPI" : "Wallet",
        deliveryAddress: cartItems.some((item) => item.type === "buy") ? deliveryAddress : undefined,
      }

      // Save order to localStorage
      const existingOrders = JSON.parse(localStorage.getItem("mockOrders") || "[]")
      localStorage.setItem("mockOrders", JSON.stringify([...existingOrders, newOrder]))

      // Create rentals for rental items
      const rentalItems = cartItems.filter((item) => item.type === "rent")
      if (rentalItems.length > 0) {
        const existingRentals = JSON.parse(localStorage.getItem("mockRentals") || "[]")
        const newRentals = rentalItems.map((item) => {
          const rentalStartDate = new Date()
          const rentalDueDate = new Date()
          rentalDueDate.setDate(rentalStartDate.getDate() + (item.rentalDuration || 1) * 7)
          const rentalId = `RENT-${Date.now()}-${item.id}`
          rentalIds.push(rentalId)

          return {
            id: rentalId,
            bookId: item.id,
            title: item.title,
            author: item.author,
            image: item.image,
            rentalPrice: item.rentPrice!,
            rentalDuration: item.rentalDuration || 1,
            startDate: rentalStartDate.toISOString(),
            dueDate: rentalDueDate.toISOString(),
            status: "Active",
            seller: item.seller,
            paymentMethod: paymentMethod === "credit-card" ? "Credit Card" : paymentMethod === "upi" ? "UPI" : "Wallet",
          }
        })
        localStorage.setItem("mockRentals", JSON.stringify([...existingRentals, ...newRentals]))
      }

      clearCart()

      // Send notification
      toast({
        title: "Order Placed Successfully!",
        description: `Your order ${orderId} has been confirmed. You will receive email confirmation shortly.`,
      })

      router.push(`/order-confirmation?orderId=${orderId}`)
    }

    setIsProcessingPayment(false)
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <ShoppingCart className="w-24 h-24 text-muted-foreground mb-6" />
        <h2 className="text-2xl font-bold mb-2">Your cart is empty!</h2>
        <p className="text-muted-foreground mb-6">Please add some books to your cart before checking out.</p>
        <Button asChild className="bg-amber-600 hover:bg-amber-700">
          <Link href="/marketplace">Go to Marketplace</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-muted/30 border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/cart">
                <ChevronLeft className="w-5 h-5" />
              </Link>
            </Button>
            <h1 className="text-3xl md:text-4xl font-bold">Checkout</h1>
          </div>
          <p className="text-muted-foreground">Complete your purchase.</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {cartItems.map((item) => (
                <div
                  key={`${item.id}-${item.type}-${item.rentalDuration || ""}`}
                  className="flex items-center space-x-4"
                >
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt={item.title}
                    className="w-16 h-20 object-cover rounded-md"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="text-muted-foreground text-sm">{item.author}</p>
                    <p className="text-sm">
                      {item.type === "buy"
                        ? `${item.quantity} x ${formatPrice(item.price)}`
                        : `${item.quantity} x ${formatPrice(item.rentPrice!)}/week (${item.rentalDuration} weeks)`}
                    </p>
                    <p className="text-xs text-muted-foreground">Seller: {item.seller}</p>
                  </div>
                  <span className="font-semibold">
                    {formatPrice(
                      item.type === "buy"
                        ? item.price * item.quantity
                        : item.rentPrice! * item.rentalDuration! * item.quantity,
                    )}
                  </span>
                </div>
              ))}
              <Separator />
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{formatPrice(shipping)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (8%)</span>
                  <span>{formatPrice(tax)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>{formatPrice(totalAmount)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Delivery Address */}
          {cartItems.some((item) => item.type === "buy") && (
            <Card>
              <CardHeader>
                <CardTitle>Delivery Address</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2">
                  <Label htmlFor="address">Full Delivery Address</Label>
                  <Input
                    id="address"
                    placeholder="123 Main St, City, State, Zip"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    className="border-muted-foreground/20 focus:border-amber-500"
                  />
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Payment Options */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Payment Method</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="grid gap-4">
                <Label
                  htmlFor="wallet"
                  className="flex items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="wallet" id="wallet" />
                    <Wallet className="h-5 w-5" />
                    <span>App Wallet ({formatPrice(balance)})</span>
                  </div>
                </Label>
                {paymentMethod === "wallet" && balance < totalAmount && (
                  <div className="p-4 border rounded-md bg-red-50 border-red-200">
                    <p className="text-sm text-red-600">
                      Insufficient wallet balance. Please add funds to your wallet or choose another payment method.
                    </p>
                    <Button asChild size="sm" className="mt-2 bg-amber-600 hover:bg-amber-700">
                      <Link href="/wallet">Add Funds</Link>
                    </Button>
                  </div>
                )}

                <Label
                  htmlFor="credit-card"
                  className="flex items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="credit-card" id="credit-card" />
                    <CreditCard className="h-5 w-5" />
                    <span>Credit/Debit Card</span>
                  </div>
                </Label>
                {paymentMethod === "credit-card" && (
                  <div className="grid gap-4 p-4 border rounded-md">
                    <div className="grid gap-2">
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input
                        id="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        value={cardDetails.cardNumber}
                        onChange={(e) => setCardDetails({ ...cardDetails, cardNumber: e.target.value })}
                        className="border-muted-foreground/20 focus:border-amber-500"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="cardName">Name on Card</Label>
                      <Input
                        id="cardName"
                        placeholder="John Doe"
                        value={cardDetails.cardName}
                        onChange={(e) => setCardDetails({ ...cardDetails, cardName: e.target.value })}
                        className="border-muted-foreground/20 focus:border-amber-500"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="expiryDate">Expiry Date</Label>
                        <Input
                          id="expiryDate"
                          placeholder="MM/YY"
                          value={cardDetails.expiryDate}
                          onChange={(e) => setCardDetails({ ...cardDetails, expiryDate: e.target.value })}
                          className="border-muted-foreground/20 focus:border-amber-500"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="cvv">CVV</Label>
                        <Input
                          id="cvv"
                          placeholder="123"
                          value={cardDetails.cvv}
                          onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                          className="border-muted-foreground/20 focus:border-amber-500"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <Label
                  htmlFor="upi"
                  className="flex items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="upi" id="upi" />
                    <Banknote className="h-5 w-5" />
                    <span>UPI</span>
                  </div>
                </Label>
                {paymentMethod === "upi" && (
                  <div className="grid gap-2 p-4 border rounded-md">
                    <Label htmlFor="upiId">UPI ID (Optional)</Label>
                    <Input
                      id="upiId"
                      placeholder="yourname@bank"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      className="border-muted-foreground/20 focus:border-amber-500"
                    />
                    <Separator className="my-4" />
                    <div className="flex flex-col items-center gap-2">
                      <p className="text-sm text-muted-foreground">Scan QR Code to Pay</p>
                      <img
                        src={upiQrCodeUrl || "/placeholder.svg"}
                        alt="UPI QR Code"
                        className="w-36 h-36 border rounded-md p-2"
                      />
                      <p className="text-xs text-center text-muted-foreground">
                        Open your UPI app and scan this QR code to complete the payment.
                      </p>
                      <Button
                        onClick={handlePayment}
                        disabled={isProcessingPayment}
                        className="w-full mt-2 bg-amber-600 hover:bg-amber-700"
                      >
                        {isProcessingPayment ? "Processing..." : `Pay ${formatPrice(totalAmount)}`}
                      </Button>
                    </div>
                  </div>
                )}
              </RadioGroup>
              {paymentMethod !== "upi" && (
                <Button
                  onClick={handlePayment}
                  disabled={isProcessingPayment || (paymentMethod === "wallet" && balance < totalAmount)}
                  className="w-full mt-6 bg-amber-600 hover:bg-amber-700 text-lg py-6"
                >
                  {isProcessingPayment ? "Processing..." : `Pay ${formatPrice(totalAmount)}`}
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
