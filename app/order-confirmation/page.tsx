"use client"

import { Separator } from "@/components/ui/separator"
import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Package, Home, MessageCircle, Download } from "lucide-react"
import { useSearchParams } from "next/navigation"
import type { Order } from "@/lib/types"

export default function OrderConfirmationPage() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get("orderId")
  const [order, setOrder] = useState<Order | null>(null)

  useEffect(() => {
    if (orderId) {
      const existingOrders: Order[] = JSON.parse(localStorage.getItem("mockOrders") || "[]")
      const foundOrder = existingOrders.find((o) => o.id === orderId)
      if (foundOrder) {
        setOrder(foundOrder)
      }
    }
  }, [orderId])

  const formatPrice = (price: number) => `$${price.toFixed(2)}`

  const handleDownloadReceipt = () => {
    if (order) {
      // Mock PDF download
      const link = document.createElement("a")
      link.href = `data:text/plain;charset=utf-8,Receipt for Order ${order.id}`
      link.download = `receipt-${order.id}.txt`
      link.click()
    }
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 text-center">
        <h2 className="text-2xl font-bold mb-4">Order Not Found</h2>
        <p className="text-muted-foreground mb-6">The order you are looking for could not be found.</p>
        <Button asChild className="bg-amber-600 hover:bg-amber-700">
          <Link href="/">Go to Homepage</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-2xl text-center">
        <CardHeader className="flex flex-col items-center">
          <CheckCircle className="h-20 w-20 text-green-500 mb-4" />
          <CardTitle className="text-3xl font-bold">Order Confirmed!</CardTitle>
          <p className="text-muted-foreground">Thank you for your purchase.</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-lg font-semibold">
            Your Order ID: <span className="text-primary">{order.id}</span>
          </div>

          <div className="space-y-2 text-left">
            <h3 className="text-xl font-semibold mb-2">Order Details:</h3>
            {order.items.map((item, index) => (
              <div key={index} className="flex items-center space-x-4">
                <img
                  src={item.image || "/placeholder.svg"}
                  alt={item.title}
                  className="w-12 h-16 object-cover rounded-md"
                />
                <div className="flex-1">
                  <p className="font-medium">{item.title}</p>
                  <p className="text-muted-foreground text-sm">{item.author}</p>
                  <p className="text-sm">
                    {item.quantity} x{" "}
                    {item.type === "buy"
                      ? formatPrice(item.price)
                      : `${formatPrice(item.price)} (total for ${item.rentalDuration} weeks)`}
                  </p>
                  {item.seller && <p className="text-xs text-muted-foreground">Seller: {item.seller}</p>}
                </div>
                <span className="font-semibold">{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
            <Separator className="my-4" />
            <div className="flex justify-between font-semibold">
              <span>Total Paid:</span>
              <span>{formatPrice(order.totalAmount)}</span>
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Payment Method:</span>
              <span>{order.paymentMethod}</span>
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Order Date:</span>
              <span>{new Date(order.orderDate).toLocaleDateString()}</span>
            </div>
            {order.deliveryAddress && (
              <div className="text-sm text-muted-foreground text-left">
                <span>Delivery Address:</span>
                <p className="font-medium">{order.deliveryAddress}</p>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Button asChild className="bg-amber-600 hover:bg-amber-700">
              <Link href="/my-orders">
                <Package className="mr-2 h-4 w-4" />
                View My Orders
              </Link>
            </Button>
            <Button
              onClick={handleDownloadReceipt}
              variant="outline"
              className="border-amber-600 text-amber-600 hover:bg-amber-50 hover:text-amber-700 bg-transparent"
            >
              <Download className="mr-2 h-4 w-4" />
              Download Receipt
            </Button>
            <Button
              variant="outline"
              className="border-amber-600 text-amber-600 hover:bg-amber-50 hover:text-amber-700 bg-transparent"
            >
              <MessageCircle className="mr-2 h-4 w-4" />
              Contact Seller
            </Button>
            <Button asChild variant="outline">
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
