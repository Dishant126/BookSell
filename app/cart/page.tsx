"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ShoppingCart, MinusCircle, PlusCircle, Trash2 } from "lucide-react"
import Link from "next/link"
import { useCart } from "@/context/cart-context"
import { toast } from "@/components/ui/use-toast"

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart()

  const subtotal = getCartTotal()
  const taxRate = 0.08 // 8% tax
  const tax = subtotal * taxRate
  const shipping = cartItems.some((item) => item.type === "buy") ? 5.0 : 0 // Flat shipping for purchased books
  const totalAmount = subtotal + tax + shipping

  const formatPrice = (price: number) => `$${price.toFixed(2)}`

  const handleRemoveItem = (id: string, type: "buy" | "rent", rentalDuration?: number) => {
    removeFromCart(id, type, rentalDuration)
    toast({
      title: "Item Removed",
      description: "The item has been removed from your cart.",
      variant: "default",
    })
  }

  const handleUpdateQuantity = (id: string, type: "buy" | "rent", newQuantity: number, rentalDuration?: number) => {
    if (newQuantity < 1) {
      handleRemoveItem(id, type, rentalDuration)
    } else {
      updateQuantity(id, type, newQuantity, rentalDuration)
    }
  }

  const handleClearCart = () => {
    clearCart()
    toast({
      title: "Cart Cleared",
      description: "All items have been removed from your cart.",
      variant: "default",
    })
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <ShoppingCart className="w-24 h-24 text-muted-foreground mb-6" />
        <h2 className="text-2xl font-bold mb-2">Your cart is empty!</h2>
        <p className="text-muted-foreground mb-6">Looks like you haven't added anything to your cart yet.</p>
        <Button asChild className="bg-amber-600 hover:bg-amber-700">
          <Link href="/marketplace">Start Shopping</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-muted/30 border-b">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Your Cart</h1>
          <p className="text-muted-foreground">Review your items before checkout.</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {cartItems.map((item) => (
            <Card key={`${item.id}-${item.type}-${item.rentalDuration || ""}`}>
              <CardContent className="flex items-center space-x-4 p-4">
                <img
                  src={item.image || "/placeholder.svg"}
                  alt={item.title}
                  className="w-24 h-32 object-cover rounded-md"
                />
                <div className="flex-1 grid gap-1">
                  <h3 className="font-semibold text-lg">{item.title}</h3>
                  <p className="text-muted-foreground text-sm">{item.author}</p>
                  <p className="text-sm">Condition: {item.condition}</p>
                  {item.type === "buy" ? (
                    <p className="text-lg font-bold text-amber-700">{formatPrice(item.price)}</p>
                  ) : (
                    <p className="text-lg font-bold text-green-700">
                      {formatPrice(item.rentPrice!)}/week ({item.rentalDuration} weeks)
                    </p>
                  )}
                </div>
                <div className="flex flex-col items-end space-y-2">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleUpdateQuantity(item.id, item.type, item.quantity - 1, item.rentalDuration)}
                      className="h-8 w-8"
                    >
                      <MinusCircle className="h-4 w-4" />
                    </Button>
                    <span className="font-medium text-lg">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleUpdateQuantity(item.id, item.type, item.quantity + 1, item.rentalDuration)}
                      className="h-8 w-8"
                    >
                      <PlusCircle className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveItem(item.id, item.type, item.rentalDuration)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          <div className="flex justify-end">
            <Button
              variant="outline"
              onClick={handleClearCart}
              className="text-red-500 border-red-500 hover:bg-red-50 bg-transparent"
            >
              Clear Cart
            </Button>
          </div>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
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
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>{formatPrice(totalAmount)}</span>
                </div>
              </div>
              <Button asChild className="w-full bg-amber-600 hover:bg-amber-700 text-lg py-6">
                <Link href="/checkout">Proceed to Checkout</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
