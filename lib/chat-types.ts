export interface ChatUser {
  id: string
  name: string
  avatar: string
  isOnline: boolean
  lastSeen?: string
}

export interface ChatMessage {
  id: string
  chatId: string
  senderId: string
  content: string
  type: 'text' | 'image' | 'file' | 'system' | 'booking'
  timestamp: string
  readBy: string[]
  attachments?: ChatAttachment[]
  replyTo?: string
}

export interface ChatAttachment {
  id: string
  type: 'image' | 'file'
  url: string
  name: string
  size: number
}

export interface Chat {
  id: string
  participants: ChatUser[]
  book: {
    id: string
    title: string
    author: string
    price: number
    rentPrice?: number
    image: string
    seller: string
  }
  lastMessage?: ChatMessage
  unreadCount: number
  createdAt: string
  updatedAt: string
  isBlocked?: boolean
  theme?: 'default' | 'blue' | 'green' | 'purple'
}

export interface CallSession {
  id: string
  chatId: string
  participants: ChatUser[]
  status: 'ringing' | 'connected' | 'ended'
  startTime?: string
  endTime?: string
  duration?: number
  type: 'voice' | 'video'
}

export interface QuickReply {
  id: string
  text: string
  category: 'greeting' | 'question' | 'meeting' | 'booking'
}

export interface TypingIndicator {
  chatId: string
  userId: string
  isTyping: boolean
  timestamp: string
}