"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  Search,
  ShoppingCart,
  Heart,
  User,
  Menu,
  BookOpen,
  MessageCircle,
  MapPin,
  Moon,
  Sun,
  Bell,
  Scan,
  Calendar,
  Users,
  DollarSign,
  Package,
  BookText,
} from "lucide-react"
import { useTheme } from "next-themes"
import { WishlistModal } from "./wishlist-modal"
import { NotificationsModal } from "./notifications-modal"
import { useCart } from "@/context/cart-context"

export function Header() {
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [isWishlistOpen, setIsWishlistOpen] = useState(false)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  const { getCartItemCount } = useCart()

  const cartItemCount = getCartItemCount()

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8 text-amber-600" />
              <span className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                BookHub
              </span>
            </Link>

            {/* Search Bar - Desktop */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className={`relative w-full transition-all duration-200 ${isSearchFocused ? "scale-105" : ""}`}>
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search books, authors, ISBN..."
                  className="pl-10 pr-12 h-11 border-2 focus:border-amber-500"
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                />
                <Button size="sm" className="absolute right-1 top-1 h-9 bg-amber-600 hover:bg-amber-700">
                  <Scan className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-4">
              <Link href="/marketplace" className="text-sm font-medium hover:text-amber-600 transition-colors">
                Marketplace
              </Link>
              <Link href="/rent" className="text-sm font-medium hover:text-amber-600 transition-colors">
                Rent Books
              </Link>
              <Link href="/community" className="text-sm font-medium hover:text-amber-600 transition-colors">
                Community
              </Link>

              {/* Action Buttons */}
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="icon" className="relative" asChild>
                  <Link href="/map">
                    <MapPin className="h-5 w-5" />
                  </Link>
                </Button>

                <Button variant="ghost" size="icon" className="relative">
                  <MessageCircle className="h-5 w-5" />
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs bg-red-500">3</Badge>
                </Button>

                <Button variant="ghost" size="icon" className="relative" onClick={() => setIsNotificationsOpen(true)}>
                  <Bell className="h-5 w-5" />
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs bg-red-500">2</Badge>
                </Button>

                <Button variant="ghost" size="icon" className="relative" onClick={() => setIsWishlistOpen(true)}>
                  <Heart className="h-5 w-5" />
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs bg-amber-500">5</Badge>
                </Button>

                <Button variant="ghost" size="icon" className="relative">
                  <Link href="/cart" className="flex items-center justify-center h-full w-full">
                    <ShoppingCart className="h-5 w-5" />
                  </Link>
                  {cartItemCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs bg-green-500">
                      {cartItemCount}
                    </Badge>
                  )}
                </Button>

                <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
                  <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <User className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem asChild>
                      <Link href="/profile">My Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/my-books">My Books</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/my-orders" className="flex items-center">
                        <Package className="mr-2 h-4 w-4" />
                        Orders
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/my-rentals" className="flex items-center">
                        <BookText className="mr-2 h-4 w-4" />
                        My Rentals
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/wallet" className="flex items-center">
                        <DollarSign className="mr-2 h-4 w-4" />
                        Wallet
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/sell">Sell a Book</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>Settings</DropdownMenuItem>
                    <DropdownMenuItem>Sign Out</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </nav>

            {/* Mobile Menu */}
            <div className="md:hidden flex items-center space-x-2">
              <Button variant="ghost" size="icon" className="relative" onClick={() => setIsWishlistOpen(true)}>
                <Heart className="h-5 w-5" />
                <Badge className="absolute -top-1 -right-1 h-4 w-4 rounded-full p-0 text-xs bg-amber-500">5</Badge>
              </Button>

              <Button variant="ghost" size="icon" className="relative">
                <Link href="/cart" className="flex items-center justify-center h-full w-full">
                  <ShoppingCart className="h-5 w-5" />
                </Link>
                {cartItemCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs bg-green-500">
                    {cartItemCount}
                  </Badge>
                )}
              </Button>

              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80">
                  <div className="flex flex-col space-y-4 mt-8">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input placeholder="Search books..." className="pl-10" />
                    </div>

                    <nav className="flex flex-col space-y-2">
                      <Link
                        href="/marketplace"
                        className="text-lg font-medium py-2 hover:text-amber-600 flex items-center"
                      >
                        <BookOpen className="w-5 h-5 mr-3" />
                        Marketplace
                      </Link>
                      <Link href="/rent" className="text-lg font-medium py-2 hover:text-amber-600 flex items-center">
                        <Calendar className="w-5 h-5 mr-3" />
                        Rent Books
                      </Link>
                      <Link
                        href="/community"
                        className="text-lg font-medium py-2 hover:text-amber-600 flex items-center"
                      >
                        <Users className="w-5 h-5 mr-3" />
                        Community
                      </Link>
                      <Button
                        variant="ghost"
                        className="justify-start text-lg font-medium py-2 hover:text-amber-600 h-auto"
                        onClick={() => setIsWishlistOpen(true)}
                      >
                        <Heart className="w-5 h-5 mr-3" />
                        Wishlist
                        <Badge className="ml-auto bg-amber-500">5</Badge>
                      </Button>
                      <Button
                        variant="ghost"
                        className="justify-start text-lg font-medium py-2 hover:text-amber-600 h-auto"
                        onClick={() => setIsNotificationsOpen(true)}
                      >
                        <Bell className="w-5 h-5 mr-3" />
                        Notifications
                        <Badge className="ml-auto bg-red-500">2</Badge>
                      </Button>
                      <Link href="/profile" className="text-lg font-medium py-2 hover:text-amber-600 flex items-center">
                        <User className="w-5 h-5 mr-3" />
                        My Profile
                      </Link>
                      <Link
                        href="/my-orders"
                        className="text-lg font-medium py-2 hover:text-amber-600 flex items-center"
                      >
                        <Package className="w-5 h-5 mr-3" />
                        Orders
                      </Link>
                      <Link
                        href="/my-rentals"
                        className="text-lg font-medium py-2 hover:text-amber-600 flex items-center"
                      >
                        <BookText className="w-5 h-5 mr-3" />
                        My Rentals
                      </Link>
                      <Link href="/wallet" className="text-lg font-medium py-2 hover:text-amber-600 flex items-center">
                        <DollarSign className="w-5 h-5 mr-3" />
                        Wallet
                      </Link>
                    </nav>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      {/* Modals */}
      <WishlistModal isOpen={isWishlistOpen} onClose={() => setIsWishlistOpen(false)} />
      <NotificationsModal isOpen={isNotificationsOpen} onClose={() => setIsNotificationsOpen(false)} />
    </>
  )
}
