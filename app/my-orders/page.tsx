"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Package, MessageCircle, Download, Search, Filter } from "lucide-react"
import Link from "next/link"
import type { Order } from "@/lib/types"
import { mockOrders } from "@/lib/mock-data"

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortBy, setSortBy] = useState("date-desc")

  useEffect(() => {
    const storedOrders = localStorage.getItem("mockOrders")
    if (storedOrders) {
      const parsedOrders = JSON.parse(storedOrders)
      setOrders(parsedOrders)
      setFilteredOrders(parsedOrders)
    } else {
      setOrders(mockOrders)
      setFilteredOrders(mockOrders)
      localStorage.setItem("mockOrders", JSON.stringify(mockOrders))
    }
  }, [])

  useEffect(() => {
    const filtered = orders.filter((order) => {
      const matchesSearch = order.items.some(
        (item) =>
          item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.id.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      const matchesStatus = statusFilter === "all" || order.status.toLowerCase() === statusFilter.toLowerCase()
      return matchesSearch && matchesStatus
    })

    // Sort orders
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "date-desc":
          return new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()
        case "date-asc":
          return new Date(a.orderDate).getTime() - new Date(b.orderDate).getTime()
        case "amount-desc":
          return b.totalAmount - a.totalAmount
        case "amount-asc":
          return a.totalAmount - b.totalAmount
        default:
          return 0
      }
    })

    setFilteredOrders(filtered)
  }, [orders, searchTerm, statusFilter, sortBy])

  const formatPrice = (price: number) => `$${price.toFixed(2)}`
  const formatDate = (isoString: string) => new Date(isoString).toLocaleDateString()

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Delivered":
        return "text-green-600"
      case "Shipped":
        return "text-blue-600"
      case "Paid":
        return "text-amber-600"
      case "Cancelled":
        return "text-red-600"
      default:
        return "text-muted-foreground"
    }
  }

  const handleDownloadReceipt = (orderId: string) => {
    // Mock PDF download
    const link = document.createElement("a")
    link.href = `data:text/plain;charset=utf-8,Receipt for Order ${orderId}`
    link.download = `receipt-${orderId}.txt`
    link.click()
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-muted/30 border-b">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">My Orders</h1>
          <p className="text-muted-foreground">Track your purchases and view order history.</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search orders, books, or authors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-muted-foreground/20 focus:border-amber-500"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="shipped">Shipped</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date-desc">Newest First</SelectItem>
              <SelectItem value="date-asc">Oldest First</SelectItem>
              <SelectItem value="amount-desc">Highest Amount</SelectItem>
              <SelectItem value="amount-asc">Lowest Amount</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">
              {orders.length === 0 ? "No orders yet" : "No orders match your search"}
            </h3>
            <p className="text-muted-foreground mb-6">
              {orders.length === 0
                ? "You haven't placed any orders. Start exploring the marketplace!"
                : "Try adjusting your search or filter criteria."}
            </p>
            {orders.length === 0 && (
              <Button asChild className="bg-amber-600 hover:bg-amber-700">
                <Link href="/marketplace">Browse Books</Link>
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => (
              <Card key={order.id}>
                <CardHeader className="flex flex-row items-center justify-between pb-4">
                  <div>
                    <CardTitle className="text-xl">Order ID: {order.id}</CardTitle>
                    <p className="text-sm text-muted-foreground">Placed on {formatDate(order.orderDate)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold">{formatPrice(order.totalAmount)}</p>
                    <p className={`text-sm font-semibold ${getStatusColor(order.status)}`}>Status: {order.status}</p>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <Separator className="mb-4" />
                  <div className="space-y-4">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex items-center space-x-4">
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.title}
                          className="w-16 h-20 object-cover rounded-md"
                        />
                        <div className="flex-1">
                          <h4 className="font-semibold">{item.title}</h4>
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
                  </div>
                  <Separator className="my-4" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="font-medium">Payment Method:</p>
                      <p className="text-muted-foreground">{order.paymentMethod}</p>
                    </div>
                    {order.deliveryAddress && (
                      <div>
                        <p className="font-medium">Delivery Address:</p>
                        <p className="text-muted-foreground">{order.deliveryAddress}</p>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-wrap justify-end gap-2 mt-6">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownloadReceipt(order.id)}
                      className="border-amber-600 text-amber-600 hover:bg-amber-50 hover:text-amber-700 bg-transparent"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download Receipt
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-amber-600 text-amber-600 hover:bg-amber-50 hover:text-amber-700 bg-transparent"
                    >
                      <MessageCircle className="mr-2 h-4 w-4" />
                      Contact Seller
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
