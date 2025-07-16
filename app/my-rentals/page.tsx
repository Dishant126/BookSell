"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BookText, Calendar, DollarSign, User, Clock, MessageCircle, Search, Filter, Plus } from "lucide-react"
import Link from "next/link"
import type { Rental } from "@/lib/types"
import { mockRentals } from "@/lib/mock-data"

export default function MyRentalsPage() {
  const [rentals, setRentals] = useState<Rental[]>([])
  const [filteredRentals, setFilteredRentals] = useState<Rental[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortBy, setSortBy] = useState("date-desc")

  useEffect(() => {
    const storedRentals = localStorage.getItem("mockRentals")
    if (storedRentals) {
      const parsedRentals = JSON.parse(storedRentals)
      setRentals(parsedRentals)
      setFilteredRentals(parsedRentals)
    } else {
      setRentals(mockRentals)
      setFilteredRentals(mockRentals)
      localStorage.setItem("mockRentals", JSON.stringify(mockRentals))
    }
  }, [])

  useEffect(() => {
    const filtered = rentals.filter((rental) => {
      const matchesSearch =
        rental.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rental.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rental.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rental.seller.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === "all" || rental.status.toLowerCase() === statusFilter.toLowerCase()
      return matchesSearch && matchesStatus
    })

    // Sort rentals
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "date-desc":
          return new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
        case "date-asc":
          return new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
        case "due-date":
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
        case "price-desc":
          return b.rentalPrice - a.rentalPrice
        case "price-asc":
          return a.rentalPrice - b.rentalPrice
        default:
          return 0
      }
    })

    setFilteredRentals(filtered)
  }, [rentals, searchTerm, statusFilter, sortBy])

  const formatPrice = (price: number) => `$${price.toFixed(2)}`
  const formatDate = (isoString: string) => new Date(isoString).toLocaleDateString()

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "text-green-600"
      case "Overdue":
        return "text-red-600"
      case "Returned":
        return "text-muted-foreground"
      case "Cancelled":
        return "text-gray-500"
      default:
        return ""
    }
  }

  const calculateDaysRemaining = (dueDate: string) => {
    const now = new Date()
    const due = new Date(dueDate)
    const diffTime = due.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const handleExtendRental = (rentalId: string) => {
    // Mock extend rental functionality
    const updatedRentals = rentals.map((rental) => {
      if (rental.id === rentalId) {
        const newDueDate = new Date(rental.dueDate)
        newDueDate.setDate(newDueDate.getDate() + 7) // Extend by 1 week
        return { ...rental, dueDate: newDueDate.toISOString() }
      }
      return rental
    })
    setRentals(updatedRentals)
    localStorage.setItem("mockRentals", JSON.stringify(updatedRentals))
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-muted/30 border-b">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">My Rentals</h1>
          <p className="text-muted-foreground">Keep track of your rented books and their due dates.</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search rentals, books, authors, or sellers..."
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
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
              <SelectItem value="returned">Returned</SelectItem>
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
              <SelectItem value="due-date">Due Date</SelectItem>
              <SelectItem value="price-desc">Highest Price</SelectItem>
              <SelectItem value="price-asc">Lowest Price</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {filteredRentals.length === 0 ? (
          <div className="text-center py-12">
            <BookText className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">
              {rentals.length === 0 ? "No rentals yet" : "No rentals match your search"}
            </h3>
            <p className="text-muted-foreground mb-6">
              {rentals.length === 0
                ? "You haven't rented any books. Explore books available for rent!"
                : "Try adjusting your search or filter criteria."}
            </p>
            {rentals.length === 0 && (
              <Button asChild className="bg-amber-600 hover:bg-amber-700">
                <Link href="/marketplace">Browse Rentals</Link>
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {filteredRentals.map((rental) => {
              const daysRemaining = calculateDaysRemaining(rental.dueDate)
              const isOverdue = daysRemaining < 0 && rental.status === "Active"

              return (
                <Card key={rental.id}>
                  <CardHeader className="flex flex-row items-center justify-between pb-4">
                    <div>
                      <CardTitle className="text-xl">{rental.title}</CardTitle>
                      <p className="text-sm text-muted-foreground">{rental.author}</p>
                      <p className="text-xs text-muted-foreground">Rental ID: {rental.id}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold">{formatPrice(rental.rentalPrice)}/week</p>
                      <p className={`text-sm font-semibold ${getStatusColor(rental.status)}`}>
                        Status: {rental.status}
                      </p>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <Separator className="mb-4" />
                    <div className="flex items-center space-x-4 mb-4">
                      <img
                        src={rental.image || "/placeholder.svg"}
                        alt={rental.title}
                        className="w-20 h-28 object-cover rounded-md"
                      />
                      <div className="grid gap-1 text-sm">
                        <p className="flex items-center gap-1">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>Start Date: {formatDate(rental.startDate)}</span>
                        </p>
                        <p className="flex items-center gap-1">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>Due Date: {formatDate(rental.dueDate)}</span>
                          {rental.status === "Active" && (
                            <span className={`ml-2 font-medium ${isOverdue ? "text-red-600" : "text-amber-600"}`}>
                              {isOverdue ? `(${Math.abs(daysRemaining)} days overdue)` : `(${daysRemaining} days left)`}
                            </span>
                          )}
                        </p>
                        <p className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                          <span>Duration: {rental.rentalDuration} weeks</span>
                        </p>
                        <p className="flex items-center gap-1">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span>Seller: {rental.seller}</span>
                        </p>
                        <p className="flex items-center gap-1 text-xs">
                          <span>Payment Method: {rental.paymentMethod}</span>
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap justify-end gap-2 mt-4">
                      {rental.status === "Active" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleExtendRental(rental.id)}
                          className="border-amber-600 text-amber-600 hover:bg-amber-50 hover:text-amber-700 bg-transparent"
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Extend Rental
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-amber-600 text-amber-600 hover:bg-amber-50 hover:text-amber-700 bg-transparent"
                      >
                        <MessageCircle className="mr-2 h-4 w-4" />
                        Contact Seller
                      </Button>
                      <Button size="sm" asChild className="bg-amber-600 hover:bg-amber-700">
                        <Link href={`/book/${rental.bookId}`}>View Book</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
