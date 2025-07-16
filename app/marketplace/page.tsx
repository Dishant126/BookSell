"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Filter, ChevronDown, Star, Calendar, ShoppingCart } from "lucide-react"
import { useCart } from "@/context/cart-context"
import { toast } from "@/components/ui/use-toast"
import type { Book } from "@/lib/types"
import { mockBooks } from "@/lib/mock-data" // Import mockBooks from mock-data.ts

export default function MarketplacePage() {
  const [filters, setFilters] = useState({
    genre: [],
    priceRange: [0, 50],
    condition: [],
    type: "all", // 'all', 'buy', 'rent'
    distance: 50,
    availability: { delivery: false, pickup: false },
  })
  const [searchTerm, setSearchTerm] = useState("")
  const { addToCart } = useCart()

  const handleFilterChange = (key: string, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const handleCheckboxFilter = (key: string, value: string) => {
    setFilters((prev) => {
      const currentArray = prev[key as keyof typeof prev] as string[]
      if (currentArray.includes(value)) {
        return { ...prev, [key]: currentArray.filter((item) => item !== value) }
      } else {
        return { ...prev, [key]: [...currentArray, value] }
      }
    })
  }

  const handleAvailabilityFilter = (key: "delivery" | "pickup") => {
    setFilters((prev) => ({
      ...prev,
      availability: { ...prev.availability, [key]: !prev.availability[key] },
    }))
  }

  const filteredBooks = mockBooks.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesGenre = filters.genre.length === 0 || filters.genre.includes(book.genre)

    const matchesPrice = (book.price ?? 0) >= filters.priceRange[0] && (book.price ?? 0) <= filters.priceRange[1]

    const matchesCondition = filters.condition.length === 0 || filters.condition.includes(book.condition)

    const matchesType =
      filters.type === "all" ||
      (filters.type === "buy" && book.price !== undefined) ||
      (filters.type === "rent" && book.rentPrice !== undefined)

    const matchesAvailability =
      (!filters.availability.delivery || book.delivery) && (!filters.availability.pickup || book.pickup)

    // Distance filter is simulated, assuming all mock books are within 50 miles
    const matchesDistance = filters.distance >= 50 || true // Always true for mock data

    return (
      matchesSearch &&
      matchesGenre &&
      matchesPrice &&
      matchesCondition &&
      matchesType &&
      matchesAvailability &&
      matchesDistance
    )
  })

  const allGenres = Array.from(new Set(mockBooks.map((book) => book.genre)))
  const allConditions = Array.from(new Set(mockBooks.map((book) => book.condition)))

  const handleAddToCart = (book: Book, type: "buy" | "rent", rentalDuration?: number) => {
    addToCart({
      id: book.id,
      title: book.title,
      author: book.author,
      price: book.price ?? 0, // Provide a default if undefined
      rentPrice: book.rentPrice,
      image: book.image,
      condition: book.condition,
      quantity: 1,
      type,
      rentalDuration,
      seller: book.seller,
    })
    toast({
      title: "Added to Cart!",
      description: `${book.title} has been added to your cart.`,
      variant: "success",
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-muted/30 border-b">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Book Marketplace</h1>
          <p className="text-muted-foreground">Discover your next favorite read.</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardContent className="p-6 space-y-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Filter className="w-5 h-5" /> Filters
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Search</h3>
                  <Input
                    placeholder="Search by title or author..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Book Type</h3>
                  <div className="flex space-x-4">
                    <Button
                      variant={filters.type === "all" ? "default" : "outline"}
                      onClick={() => handleFilterChange("type", "all")}
                      className={filters.type === "all" ? "bg-amber-600 hover:bg-amber-700" : ""}
                    >
                      All
                    </Button>
                    <Button
                      variant={filters.type === "buy" ? "default" : "outline"}
                      onClick={() => handleFilterChange("type", "buy")}
                      className={filters.type === "buy" ? "bg-amber-600 hover:bg-amber-700" : ""}
                    >
                      Buy
                    </Button>
                    <Button
                      variant={filters.type === "rent" ? "default" : "outline"}
                      onClick={() => handleFilterChange("type", "rent")}
                      className={filters.type === "rent" ? "bg-amber-600 hover:bg-amber-700" : ""}
                    >
                      Rent
                    </Button>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Genre</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {allGenres.map((genre) => (
                      <div key={genre} className="flex items-center space-x-2">
                        <Checkbox
                          id={`genre-${genre}`}
                          checked={filters.genre.includes(genre)}
                          onCheckedChange={() => handleCheckboxFilter("genre", genre)}
                        />
                        <label
                          htmlFor={`genre-${genre}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {genre}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Price Range</h3>
                  <Slider
                    min={0}
                    max={50}
                    step={1}
                    value={filters.priceRange}
                    onValueChange={(val) => handleFilterChange("priceRange", val)}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground mt-2">
                    <span>${filters.priceRange[0]}</span>
                    <span>${filters.priceRange[1]}</span>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Condition</h3>
                  <div className="grid gap-2">
                    {allConditions.map((condition) => (
                      <div key={condition} className="flex items-center space-x-2">
                        <Checkbox
                          id={`condition-${condition}`}
                          checked={filters.condition.includes(condition)}
                          onCheckedChange={() => handleCheckboxFilter("condition", condition)}
                        />
                        <label
                          htmlFor={`condition-${condition}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {condition}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Distance Radius</h3>
                  <Slider
                    min={0}
                    max={100}
                    step={10}
                    value={[filters.distance]}
                    onValueChange={(val) => handleFilterChange("distance", val[0])}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground mt-2">
                    <span>0 miles</span>
                    <span>{filters.distance} miles</span>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Availability</h3>
                  <div className="grid gap-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="delivery"
                        checked={filters.availability.delivery}
                        onCheckedChange={() => handleAvailabilityFilter("delivery")}
                      />
                      <label
                        htmlFor="delivery"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Delivery Available
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="pickup"
                        checked={filters.availability.pickup}
                        onCheckedChange={() => handleAvailabilityFilter("pickup")}
                      />
                      <label
                        htmlFor="pickup"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Local Pickup
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Book Listings */}
        <div className="lg:col-span-3">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">{filteredBooks.length} Books Found</h2>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                  Sort by <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Price: Low to High</DropdownMenuItem>
                <DropdownMenuItem>Price: High to Low</DropdownMenuItem>
                <DropdownMenuItem>Newest Arrivals</DropdownMenuItem>
                <DropdownMenuItem>Top Rated</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
            {filteredBooks.map((book) => (
              <Card key={book.id} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-200">
                <Link href={`/book/${book.id}`}>
                  <img src={book.image || "/placeholder.svg"} alt={book.title} className="w-full h-48 object-cover" />
                </Link>
                <CardContent className="p-4">
                  <Link href={`/book/${book.id}`}>
                    <h3 className="font-semibold text-lg mb-1 hover:text-amber-600 transition-colors">{book.title}</h3>
                  </Link>
                  <p className="text-sm text-muted-foreground mb-2">{book.author}</p>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1 text-sm">
                      <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                      <span>
                        {book.rating} ({book.reviews})
                      </span>
                    </div>
                    <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                      {book.condition}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    {book.price && <span className="text-xl font-bold text-amber-700">${book.price.toFixed(2)}</span>}
                    {book.rentPrice && (
                      <span className="text-lg font-semibold text-green-700">${book.rentPrice.toFixed(2)}/week</span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {book.price && (
                      <Button
                        className="flex-1 bg-amber-600 hover:bg-amber-700"
                        onClick={() => handleAddToCart(book, "buy")}
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" /> Buy
                      </Button>
                    )}
                    {book.rentPrice && (
                      <Button
                        variant="outline"
                        className="flex-1 border-green-600 text-green-600 hover:bg-green-50 hover:text-green-700 bg-transparent"
                        onClick={() => handleAddToCart(book, "rent", 1)} // Default 1 week rental
                      >
                        <Calendar className="w-4 h-4 mr-2" /> Rent
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
