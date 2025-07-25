import type { Chat, ChatMessage, ChatUser, QuickReply } from './chat-types'

export const mockChatUsers: ChatUser[] = [
  {
    id: 'user-1',
    name: 'Sarah Johnson',
    avatar: '/placeholder.svg?height=40&width=40',
    isOnline: true,
  },
  {
    id: 'user-2',
    name: 'Mike Chen',
    avatar: '/placeholder.svg?height=40&width=40',
    isOnline: false,
    lastSeen: '2024-01-15T10:30:00Z',
  },
  {
    id: 'user-3',
    name: 'Emma Davis',
    avatar: '/placeholder.svg?height=40&width=40',
    isOnline: true,
  },
  {
    id: 'current-user',
    name: 'You',
    avatar: '/placeholder.svg?height=40&width=40',
    isOnline: true,
  },
]

export const mockChats: Chat[] = [
  {
    id: 'chat-1',
    participants: [mockChatUsers[0], mockChatUsers[3]],
    book: {
      id: '1',
      title: 'The Midnight Library',
      author: 'Matt Haig',
      price: 15.99,
      rentPrice: 3.99,
      image: '/placeholder.svg?height=80&width=60',
      seller: 'Sarah Johnson',
    },
    lastMessage: {
      id: 'msg-1',
      chatId: 'chat-1',
      senderId: 'user-1',
      content: 'Hi! Is this book still available?',
      type: 'text',
      timestamp: '2024-01-15T14:30:00Z',
      readBy: ['user-1'],
    },
    unreadCount: 1,
    createdAt: '2024-01-15T14:30:00Z',
    updatedAt: '2024-01-15T14:30:00Z',
    theme: 'default',
  },
  {
    id: 'chat-2',
    participants: [mockChatUsers[1], mockChatUsers[3]],
    book: {
      id: '2',
      title: 'Atomic Habits',
      author: 'James Clear',
      price: 18.99,
      rentPrice: 4.99,
      image: '/placeholder.svg?height=80&width=60',
      seller: 'Mike Chen',
    },
    lastMessage: {
      id: 'msg-2',
      chatId: 'chat-2',
      senderId: 'current-user',
      content: 'Great! When can we meet?',
      type: 'text',
      timestamp: '2024-01-15T12:15:00Z',
      readBy: ['current-user', 'user-2'],
    },
    unreadCount: 0,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T12:15:00Z',
    theme: 'blue',
  },
  {
    id: 'chat-3',
    participants: [mockChatUsers[2], mockChatUsers[3]],
    book: {
      id: '3',
      title: 'Dune',
      author: 'Frank Herbert',
      price: 22.99,
      rentPrice: 5.99,
      image: '/placeholder.svg?height=80&width=60',
      seller: 'Emma Davis',
    },
    lastMessage: {
      id: 'msg-3',
      chatId: 'chat-3',
      senderId: 'user-3',
      content: 'The book is in excellent condition! 📚',
      type: 'text',
      timestamp: '2024-01-14T16:45:00Z',
      readBy: ['user-3', 'current-user'],
    },
    unreadCount: 0,
    createdAt: '2024-01-14T16:00:00Z',
    updatedAt: '2024-01-14T16:45:00Z',
    theme: 'green',
  },
]

export const mockMessages: Record<string, ChatMessage[]> = {
  'chat-1': [
    {
      id: 'msg-1-1',
      chatId: 'chat-1',
      senderId: 'user-1',
      content: 'Hi! Is this book still available?',
      type: 'text',
      timestamp: '2024-01-15T14:30:00Z',
      readBy: ['user-1'],
    },
    {
      id: 'msg-1-2',
      chatId: 'chat-1',
      senderId: 'current-user',
      content: 'Yes, it is! Are you interested in buying or renting?',
      type: 'text',
      timestamp: '2024-01-15T14:32:00Z',
      readBy: ['current-user'],
    },
    {
      id: 'msg-1-3',
      chatId: 'chat-1',
      senderId: 'user-1',
      content: 'I\'d like to rent it for 2 weeks. Is that possible?',
      type: 'text',
      timestamp: '2024-01-15T14:35:00Z',
      readBy: ['user-1'],
    },
  ],
  'chat-2': [
    {
      id: 'msg-2-1',
      chatId: 'chat-2',
      senderId: 'user-2',
      content: 'Hello! I saw your listing for Atomic Habits.',
      type: 'text',
      timestamp: '2024-01-15T10:00:00Z',
      readBy: ['user-2', 'current-user'],
    },
    {
      id: 'msg-2-2',
      chatId: 'chat-2',
      senderId: 'current-user',
      content: 'Hi Mike! Yes, it\'s available. Would you like to buy it?',
      type: 'text',
      timestamp: '2024-01-15T10:05:00Z',
      readBy: ['current-user', 'user-2'],
    },
    {
      id: 'msg-2-3',
      chatId: 'chat-2',
      senderId: 'user-2',
      content: 'Perfect! I\'m interested in purchasing it.',
      type: 'text',
      timestamp: '2024-01-15T10:10:00Z',
      readBy: ['user-2', 'current-user'],
    },
    {
      id: 'msg-2-4',
      chatId: 'chat-2',
      senderId: 'current-user',
      content: 'Great! When can we meet?',
      type: 'text',
      timestamp: '2024-01-15T12:15:00Z',
      readBy: ['current-user', 'user-2'],
    },
  ],
  'chat-3': [
    {
      id: 'msg-3-1',
      chatId: 'chat-3',
      senderId: 'current-user',
      content: 'Hi Emma! I\'m interested in Dune. What condition is it in?',
      type: 'text',
      timestamp: '2024-01-14T16:00:00Z',
      readBy: ['current-user', 'user-3'],
    },
    {
      id: 'msg-3-2',
      chatId: 'chat-3',
      senderId: 'user-3',
      content: 'The book is in excellent condition! 📚',
      type: 'text',
      timestamp: '2024-01-14T16:45:00Z',
      readBy: ['user-3', 'current-user'],
    },
  ],
}

export const quickReplies: QuickReply[] = [
  { id: '1', text: 'Hi! Is this still available?', category: 'greeting' },
  { id: '2', text: 'What condition is the book in?', category: 'question' },
  { id: '3', text: 'Can we meet at the campus library?', category: 'meeting' },
  { id: '4', text: 'I\'d like to book this!', category: 'booking' },
  { id: '5', text: 'Is pickup available?', category: 'question' },
  { id: '6', text: 'When are you free to meet?', category: 'meeting' },
  { id: '7', text: 'Thanks for the quick response!', category: 'greeting' },
  { id: '8', text: 'Can you hold it for me?', category: 'booking' },
]

export const meetingLocations = [
  'Campus Library',
  'Student Center',
  'Coffee Shop on Main St',
  'University Bookstore',
  'Central Park',
  'Local Starbucks',
]