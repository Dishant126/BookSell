"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Search, MessageCircle, Phone, Video, MoreVertical } from 'lucide-react'
import { useChat } from '@/context/chat-context'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'

export default function ChatInboxPage() {
  const { chats, unreadCount } = useChat()
  const [searchQuery, setSearchQuery] = useState('')

  const filteredChats = chats.filter(chat => 
    chat.book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.participants.some(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const formatTime = (timestamp: string) => {
    return formatDistanceToNow(new Date(timestamp), { addSuffix: true })
  }

  const getOnlineStatus = (participants: any[], currentUserId: string) => {
    const otherUser = participants.find(p => p.id !== currentUserId)
    return otherUser?.isOnline
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-muted/30 border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">Messages</h1>
              <p className="text-muted-foreground">
                {unreadCount > 0 ? `${unreadCount} unread message${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                {chats.length} conversation{chats.length !== 1 ? 's' : ''}
              </Badge>
            </div>
          </div>

          {/* Search */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search conversations..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {filteredChats.length === 0 ? (
          <div className="text-center py-12">
            <MessageCircle className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">
              {searchQuery ? 'No conversations found' : 'No messages yet'}
            </h3>
            <p className="text-muted-foreground mb-6">
              {searchQuery 
                ? 'Try adjusting your search terms' 
                : 'Start browsing books to connect with sellers and buyers'
              }
            </p>
            {!searchQuery && (
              <Button asChild className="bg-amber-600 hover:bg-amber-700">
                <Link href="/marketplace">Browse Books</Link>
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-4 max-w-4xl mx-auto">
            {filteredChats.map((chat) => {
              const otherUser = chat.participants.find(p => p.id !== 'current-user')
              const isOnline = getOnlineStatus(chat.participants, 'current-user')
              
              return (
                <Card key={chat.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-0">
                    <Link href={`/chat/${chat.id}`}>
                      <div className="flex items-center space-x-4 p-4 hover:bg-muted/30 transition-colors">
                        {/* Book Thumbnail */}
                        <div className="relative">
                          <img
                            src={chat.book.image || '/placeholder.svg'}
                            alt={chat.book.title}
                            className="w-12 h-16 object-cover rounded"
                          />
                          {chat.unreadCount > 0 && (
                            <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs bg-red-500">
                              {chat.unreadCount}
                            </Badge>
                          )}
                        </div>

                        {/* User Avatar */}
                        <div className="relative">
                          <Avatar className="w-12 h-12">
                            <AvatarImage src={otherUser?.avatar || '/placeholder.svg'} alt={otherUser?.name} />
                            <AvatarFallback>
                              {otherUser?.name?.split(' ').map(n => n[0]).join('') || 'U'}
                            </AvatarFallback>
                          </Avatar>
                          {isOnline && (
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                          )}
                        </div>

                        {/* Chat Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-semibold truncate">{otherUser?.name}</h3>
                            <span className="text-xs text-muted-foreground">
                              {chat.lastMessage && formatTime(chat.lastMessage.timestamp)}
                            </span>
                          </div>
                          
                          <p className="text-sm text-muted-foreground truncate mb-1">
                            {chat.book.title} • ${chat.book.price}
                            {chat.book.rentPrice && ` • Rent $${chat.book.rentPrice}/week`}
                          </p>
                          
                          {chat.lastMessage && (
                            <p className="text-sm text-muted-foreground truncate">
                              {chat.lastMessage.senderId === 'current-user' && 'You: '}
                              {chat.lastMessage.content}
                            </p>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => {
                              e.preventDefault()
                              // Handle phone call
                            }}
                          >
                            <Phone className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => {
                              e.preventDefault()
                              // Handle video call
                            }}
                          >
                            <Video className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </Link>
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