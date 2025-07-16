"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Bell, Package, BookText, MessageCircle, Heart, User, CheckCircle, Trash2 } from "lucide-react"
import Link from "next/link"
import type { Notification } from "@/lib/types"
import { mockNotifications } from "@/lib/mock-data"

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])

  useEffect(() => {
    const storedNotifications = localStorage.getItem("mockNotifications")
    if (storedNotifications) {
      setNotifications(JSON.parse(storedNotifications))
    } else {
      setNotifications(mockNotifications)
      localStorage.setItem("mockNotifications", JSON.stringify(mockNotifications))
    }
  }, [])

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "order":
        return <Package className="h-5 w-5 text-blue-500" />
      case "rental":
        return <BookText className="h-5 w-5 text-green-500" />
      case "message":
        return <MessageCircle className="h-5 w-5 text-purple-500" />
      case "wishlist":
        return <Heart className="h-5 w-5 text-red-500" />
      case "seller":
        return <User className="h-5 w-5 text-amber-500" />
      default:
        return <Bell className="h-5 w-5 text-gray-500" />
    }
  }

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif)))
    localStorage.setItem(
      "mockNotifications",
      JSON.stringify(notifications.map((notif) => (notif.id === id ? { ...notif, read: true } : notif))),
    )
  }

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id))
    localStorage.setItem("mockNotifications", JSON.stringify(notifications.filter((notif) => notif.id !== id)))
  }

  const unreadCount = notifications.filter((notif) => !notif.read).length

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-muted/30 border-b">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Notifications</h1>
          <p className="text-muted-foreground">Stay updated with your BookHub activities.</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-0">
            {notifications.length === 0 ? (
              <div className="text-center py-12">
                <Bell className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No new notifications</h3>
                <p className="text-muted-foreground">You're all caught up!</p>
              </div>
            ) : (
              <ScrollArea className="h-[calc(100vh-250px)]">
                <div className="divide-y">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`flex items-start gap-4 p-4 transition-colors ${
                        notification.read ? "bg-background" : "bg-amber-50 hover:bg-amber-100"
                      }`}
                    >
                      <div className="pt-1">{getNotificationIcon(notification.type)}</div>
                      <div className="flex-1 grid gap-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold">{notification.title}</h3>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">
                              {new Date(notification.date).toLocaleDateString()}
                            </span>
                            {!notification.read && (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => markAsRead(notification.id)}
                                className="h-6 w-6 text-green-600 hover:bg-green-100"
                                aria-label="Mark as read"
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => deleteNotification(notification.id)}
                              className="h-6 w-6 text-red-600 hover:bg-red-100"
                              aria-label="Delete notification"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">{notification.description}</p>
                        {notification.link && (
                          <Link href={notification.link} className="text-sm text-amber-600 hover:underline">
                            View Details
                          </Link>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
