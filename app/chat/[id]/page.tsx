"use client"

import { useState, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { 
  ArrowLeft, 
  Phone, 
  Video, 
  MoreVertical, 
  Send, 
  Smile, 
  Paperclip, 
  Image as ImageIcon,
  MapPin,
  Calendar,
  Shield,
  Flag,
  Palette,
  Check,
  CheckCheck
} from 'lucide-react'
import { useChat } from '@/context/chat-context'
import { formatDistanceToNow } from 'date-fns'
import { quickReplies, meetingLocations } from '@/lib/chat-data'
import { EmojiPicker } from '@/components/chat/emoji-picker'
import { CallScreen } from '@/components/chat/call-screen'
import { QuickReplies } from '@/components/chat/quick-replies'
import { MeetingSuggestions } from '@/components/chat/meeting-suggestions'
import { ChatThemeSelector } from '@/components/chat/chat-theme-selector'

export default function ChatPage() {
  const params = useParams()
  const router = useRouter()
  const chatId = params.id as string
  
  const { 
    chats, 
    messages, 
    currentUser, 
    activeCall, 
    sendMessage, 
    markAsRead, 
    startCall, 
    endCall,
    setTyping,
    blockUser,
    reportUser,
    updateChatTheme
  } = useChat()
  
  const [message, setMessage] = useState('')
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [showQuickReplies, setShowQuickReplies] = useState(false)
  const [showMeetingSuggestions, setShowMeetingSuggestions] = useState(false)
  const [showThemeSelector, setShowThemeSelector] = useState(false)
  const [showReportDialog, setShowReportDialog] = useState(false)
  const [reportReason, setReportReason] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  
  const chat = chats.find(c => c.id === chatId)
  const chatMessages = messages[chatId] || []
  const otherUser = chat?.participants.find(p => p.id !== currentUser.id)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatMessages])

  useEffect(() => {
    // Mark messages as read when viewing chat
    chatMessages.forEach(msg => {
      if (!msg.readBy.includes(currentUser.id)) {
        markAsRead(chatId, msg.id)
      }
    })
  }, [chatMessages, chatId, currentUser.id, markAsRead])

  const handleSendMessage = () => {
    if (message.trim()) {
      sendMessage(chatId, message.trim())
      setMessage('')
      setIsTyping(false)
      setTyping(chatId, false)
    }
  }

  const handleInputChange = (value: string) => {
    setMessage(value)
    if (value.trim() && !isTyping) {
      setIsTyping(true)
      setTyping(chatId, true)
    } else if (!value.trim() && isTyping) {
      setIsTyping(false)
      setTyping(chatId, false)
    }
  }

  const handleEmojiSelect = (emoji: string) => {
    setMessage(prev => prev + emoji)
    setShowEmojiPicker(false)
    inputRef.current?.focus()
  }

  const handleQuickReply = (reply: string) => {
    setMessage(reply)
    setShowQuickReplies(false)
    inputRef.current?.focus()
  }

  const handleMeetingSuggestion = (location: string) => {
    const suggestionMessage = `How about we meet at ${location}?`
    sendMessage(chatId, suggestionMessage)
    setShowMeetingSuggestions(false)
  }

  const handleReport = () => {
    if (reportReason.trim()) {
      reportUser(chatId, reportReason)
      setShowReportDialog(false)
      setReportReason('')
    }
  }

  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const getThemeColors = (theme: string) => {
    switch (theme) {
      case 'blue':
        return { sent: 'bg-blue-500', received: 'bg-blue-100 dark:bg-blue-900' }
      case 'green':
        return { sent: 'bg-green-500', received: 'bg-green-100 dark:bg-green-900' }
      case 'purple':
        return { sent: 'bg-purple-500', received: 'bg-purple-100 dark:bg-purple-900' }
      default:
        return { sent: 'bg-amber-500', received: 'bg-gray-100 dark:bg-gray-800' }
    }
  }

  if (!chat) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Chat not found</h2>
          <p className="text-muted-foreground mb-4">The conversation you're looking for doesn't exist.</p>
          <Button onClick={() => router.push('/chat')}>Back to Messages</Button>
        </div>
      </div>
    )
  }

  if (activeCall && activeCall.chatId === chatId) {
    return <CallScreen call={activeCall} onEndCall={endCall} />
  }

  const themeColors = getThemeColors(chat.theme || 'default')

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" onClick={() => router.push('/chat')}>
                <ArrowLeft className="w-5 h-5" />
              </Button>
              
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={otherUser?.avatar || '/placeholder.svg'} alt={otherUser?.name} />
                    <AvatarFallback>
                      {otherUser?.name?.split(' ').map(n => n[0]).join('') || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  {otherUser?.isOnline && (
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                  )}
                </div>
                
                <div>
                  <h2 className="font-semibold">{otherUser?.name}</h2>
                  <p className="text-sm text-muted-foreground">
                    {otherUser?.isOnline ? 'Online' : `Last seen ${formatDistanceToNow(new Date(otherUser?.lastSeen || ''), { addSuffix: true })}`}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="icon" onClick={() => startCall(chatId, 'voice')}>
                <Phone className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => startCall(chatId, 'video')}>
                <Video className="w-5 h-5" />
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="w-5 h-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setShowThemeSelector(true)}>
                    <Palette className="w-4 h-4 mr-2" />
                    Change Theme
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => blockUser(chatId)}>
                    <Shield className="w-4 h-4 mr-2" />
                    Block User
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setShowReportDialog(true)}>
                    <Flag className="w-4 h-4 mr-2" />
                    Report User
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>

      {/* Book Banner */}
      <div className="border-b bg-muted/30">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center space-x-3">
            <img
              src={chat.book.image || '/placeholder.svg'}
              alt={chat.book.title}
              className="w-12 h-16 object-cover rounded"
            />
            <div className="flex-1">
              <h3 className="font-semibold">{chat.book.title}</h3>
              <p className="text-sm text-muted-foreground">{chat.book.author}</p>
              <div className="flex items-center space-x-2 mt-1">
                <Badge variant="outline">${chat.book.price}</Badge>
                {chat.book.rentPrice && (
                  <Badge variant="outline" className="bg-blue-50 text-blue-700">
                    Rent ${chat.book.rentPrice}/week
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-4 py-6 space-y-4">
          {chatMessages.map((msg) => {
            const isOwn = msg.senderId === currentUser.id
            const isRead = msg.readBy.length > 1
            
            return (
              <div key={msg.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs lg:max-w-md ${isOwn ? 'order-2' : 'order-1'}`}>
                  <div
                    className={`px-4 py-2 rounded-2xl ${
                      isOwn 
                        ? `${themeColors.sent} text-white` 
                        : `${themeColors.received} text-foreground`
                    }`}
                  >
                    <p className="text-sm">{msg.content}</p>
                  </div>
                  <div className={`flex items-center mt-1 space-x-1 ${isOwn ? 'justify-end' : 'justify-start'}`}>
                    <span className="text-xs text-muted-foreground">
                      {formatMessageTime(msg.timestamp)}
                    </span>
                    {isOwn && (
                      <div className="text-muted-foreground">
                        {isRead ? (
                          <CheckCheck className="w-3 h-3" />
                        ) : (
                          <Check className="w-3 h-3" />
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
          
          {/* Typing Indicator */}
          {/* This would show when the other user is typing */}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="border-t bg-muted/30">
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center space-x-2 overflow-x-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowQuickReplies(!showQuickReplies)}
              className="bg-transparent"
            >
              Quick Replies
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowMeetingSuggestions(!showMeetingSuggestions)}
              className="bg-transparent"
            >
              <MapPin className="w-4 h-4 mr-1" />
              Suggest Meeting
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="bg-transparent"
            >
              <Calendar className="w-4 h-4 mr-1" />
              Book Now
            </Button>
          </div>
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t bg-background">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <Input
                ref={inputRef}
                value={message}
                onChange={(e) => handleInputChange(e.target.value)}
                placeholder="Type a message..."
                className="pr-20"
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                >
                  <Smile className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Paperclip className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <ImageIcon className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <Button onClick={handleSendMessage} className="bg-amber-600 hover:bg-amber-700">
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Modals and Overlays */}
      {showEmojiPicker && (
        <EmojiPicker onEmojiSelect={handleEmojiSelect} onClose={() => setShowEmojiPicker(false)} />
      )}
      
      {showQuickReplies && (
        <QuickReplies replies={quickReplies} onSelect={handleQuickReply} onClose={() => setShowQuickReplies(false)} />
      )}
      
      {showMeetingSuggestions && (
        <MeetingSuggestions 
          locations={meetingLocations} 
          onSelect={handleMeetingSuggestion} 
          onClose={() => setShowMeetingSuggestions(false)} 
        />
      )}

      {showThemeSelector && (
        <ChatThemeSelector
          currentTheme={chat.theme || 'default'}
          onThemeSelect={(theme) => {
            updateChatTheme(chatId, theme)
            setShowThemeSelector(false)
          }}
          onClose={() => setShowThemeSelector(false)}
        />
      )}

      {/* Report Dialog */}
      <Dialog open={showReportDialog} onOpenChange={setShowReportDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Report User</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Please describe why you're reporting this user. This helps us maintain a safe community.
            </p>
            <Textarea
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              placeholder="Describe the issue..."
              rows={4}
            />
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowReportDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleReport} disabled={!reportReason.trim()}>
                Submit Report
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}