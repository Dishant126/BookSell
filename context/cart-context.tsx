"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react"
import { toast } from "@/components/ui/use-toast"
import type { CartItem } from "@/lib/types"

interface CartContextType {
  cartItems: CartItem[]
  addToCart: (item: CartItem) => void
  removeFromCart: (id: string, type: "buy" | "rent", rentalDuration?: number) => void
  updateQuantity: (id: string, type: "buy" | "rent", quantity: number, rentalDuration?: number) => void
  getCartTotal: () => number
  getCartItemCount: () => number
  clearCart: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([])

  // Load cart from localStorage on initial load
  useEffect(() => {
    const storedCart = localStorage.getItem("cartItems")
    if (storedCart) {
      setCartItems(JSON.parse(storedCart))
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems))
  }, [cartItems])

  const addToCart = useCallback((item: CartItem) => {
    setCartItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex(
        (i) => i.id === item.id && i.type === item.type && i.rentalDuration === item.rentalDuration,
      )

      if (existingItemIndex > -1) {
        const updatedItems = [...prevItems]
        updatedItems[existingItemIndex].quantity += item.quantity
        toast({
          title: "Cart Updated",
          description: `Quantity for ${item.title} increased.`,
        })
        return updatedItems
      } else {
        toast({
          title: "Item Added",
          description: `${item.title} added to your cart.`,
          variant: "success",
        })
        return [...prevItems, { ...item, quantity: item.quantity || 1 }]
      }
    })
  }, [])

  const removeFromCart = useCallback((id: string, type: "buy" | "rent", rentalDuration?: number) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => !(item.id === id && item.type === type && item.rentalDuration === rentalDuration)),
    )
  }, [])

  const updateQuantity = useCallback((id: string, type: "buy" | "rent", quantity: number, rentalDuration?: number) => {
    setCartItems((prevItems) =>
      prevItems
        .map((item) =>
          item.id === id && item.type === type && item.rentalDuration === rentalDuration ? { ...item, quantity } : item,
        )
        .filter((item) => item.quantity > 0),
    )
  }, [])

  const getCartTotal = useCallback(() => {
    return cartItems.reduce((total, item) => {
      if (item.type === "buy") {
        return total + item.price * item.quantity
      } else if (item.type === "rent" && item.rentPrice && item.rentalDuration) {
        return total + item.rentPrice * item.rentalDuration * item.quantity
      }
      return total
    }, 0)
  }, [cartItems])

  const getCartItemCount = useCallback(() => {
    return cartItems.reduce((count, item) => count + item.quantity, 0)
  }, [cartItems])

  const clearCart = useCallback(() => {
    setCartItems([])
  }, [])

  const value = useMemo(
    () => ({
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      getCartTotal,
      getCartItemCount,
      clearCart,
    }),
    [cartItems, addToCart, removeFromCart, updateQuantity, getCartTotal, getCartItemCount, clearCart],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
