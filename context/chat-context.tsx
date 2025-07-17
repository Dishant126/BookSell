"use client"

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import type { Chat, ChatMessage, ChatUser, CallSession, TypingIndicator } from '@/lib/chat-types'
import { mockChats, mockMessages, mockChatUsers } from '@/lib/chat-data'
import { toast } from '@/components/ui/use-toast'

interface ChatContextType {
  chats: Chat[]
  messages: Record<string, ChatMessage[]>
  currentUser: ChatUser
  activeCall: CallSession | null
  typingIndicators: TypingIndicator[]
  unreadCount: number
  sendMessage: (chatId: string, content: string, type?: 'text' | 'image' | 'file') => void
  markAsRead: (chatId: string, messageId: string) => void
  startCall: (chatId: string, type: 'voice' | 'video') => void
  endCall: () => void
  setTyping: (chatId: string, isTyping: boolean) => void
  blockUser: (chatId: string) => void
  reportUser: (chatId: string, reason: string) => void
  updateChatTheme: (chatId: string, theme: 'default' | 'blue' | 'green' | 'purple') => void
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [chats, setChats] = useState<Chat[]>(mockChats)
  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>(mockMessages)
  const [activeCall, setActiveCall] = useState<CallSession | null>(null)
  const [typingIndicators, setTypingIndicators] = useState<TypingIndicator[]>([])
  const currentUser = mockChatUsers.find(u => u.id === 'current-user')!

  const unreadCount = chats.reduce((total, chat) => total + chat.unreadCount, 0)

  const sendMessage = useCallback((chatId: string, content: string, type: 'text' | 'image' | 'file' = 'text') => {
    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      chatId,
      senderId: currentUser.id,
      content,
      type,
      timestamp: new Date().toISOString(),
      readBy: [currentUser.id],
    }

    setMessages(prev => ({
      ...prev,
      [chatId]: [...(prev[chatId] || []), newMessage],
    }))

    setChats(prev => prev.map(chat => 
      chat.id === chatId 
        ? { ...chat, lastMessage: newMessage, updatedAt: newMessage.timestamp }
        : chat
    ))

    // Simulate receiving a response after a delay
    setTimeout(() => {
      const chat = chats.find(c => c.id === chatId)
      if (chat) {
        const otherUser = chat.participants.find(p => p.id !== currentUser.id)
        if (otherUser) {
          const responses = [
            'Thanks for your message!',
            'Let me check and get back to you.',
            'Sounds good to me!',
            'When would be a good time to meet?',
            'I\'ll send you the details.',
          ]
          
          const responseMessage: ChatMessage = {
            id: `msg-${Date.now()}-response`,
            chatId,
            senderId: otherUser.id,
            content: responses[Math.floor(Math.random() * responses.length)],
            type: 'text',
            timestamp: new Date().toISOString(),
            readBy: [otherUser.id],
          }

          setMessages(prev => ({
            ...prev,
            [chatId]: [...(prev[chatId] || []), responseMessage],
          }))

          setChats(prev => prev.map(chat => 
            chat.id === chatId 
              ? { 
                  ...chat, 
                  lastMessage: responseMessage, 
                  updatedAt: responseMessage.timestamp,
                  unreadCount: chat.unreadCount + 1
                }
              : chat
          ))

          // Show notification
          toast({
            title: `New message from ${otherUser.name}`,
            description: responseMessage.content,
          })
        }
      }
    }, 2000 + Math.random() * 3000)
  }, [currentUser.id, chats])

  const markAsRead = useCallback((chatId: string, messageId: string) => {
    setMessages(prev => ({
      ...prev,
      [chatId]: prev[chatId]?.map(msg => 
        msg.id === messageId && !msg.readBy.includes(currentUser.id)
          ? { ...msg, readBy: [...msg.readBy, currentUser.id] }
          : msg
      ) || [],
    }))

    setChats(prev => prev.map(chat => 
      chat.id === chatId 
        ? { ...chat, unreadCount: 0 }
        : chat
    ))
  }, [currentUser.id])

  const startCall = useCallback((chatId: string, type: 'voice' | 'video') => {
    const chat = chats.find(c => c.id === chatId)
    if (chat) {
      const callSession: CallSession = {
        id: `call-${Date.now()}`,
        chatId,
        participants: chat.participants,
        status: 'ringing',
        type,
      }
      setActiveCall(callSession)
      
      // Simulate call connection after 3 seconds
      setTimeout(() => {
        setActiveCall(prev => prev ? { ...prev, status: 'connected', startTime: new Date().toISOString() } : null)
      }, 3000)
    }
  }, [chats])

  const endCall = useCallback(() => {
    if (activeCall) {
      setActiveCall(prev => prev ? { ...prev, status: 'ended', endTime: new Date().toISOString() } : null)
      setTimeout(() => setActiveCall(null), 1000)
    }
  }, [activeCall])

  const setTyping = useCallback((chatId: string, isTyping: boolean) => {
    setTypingIndicators(prev => {
      const filtered = prev.filter(t => !(t.chatId === chatId && t.userId === currentUser.id))
      if (isTyping) {
        return [...filtered, { chatId, userId: currentUser.id, isTyping, timestamp: new Date().toISOString() }]
      }
      return filtered
    })

    // Clear typing indicator after 3 seconds
    if (isTyping) {
      setTimeout(() => {
        setTypingIndicators(prev => prev.filter(t => !(t.chatId === chatId && t.userId === currentUser.id)))
      }, 3000)
    }
  }, [currentUser.id])

  const blockUser = useCallback((chatId: string) => {
    setChats(prev => prev.map(chat => 
      chat.id === chatId 
        ? { ...chat, isBlocked: true }
        : chat
    ))
    toast({
      title: 'User Blocked',
      description: 'You will no longer receive messages from this user.',
    })
  }, [])

  const reportUser = useCallback((chatId: string, reason: string) => {
    // In a real app, this would send a report to the backend
    toast({
      title: 'User Reported',
      description: 'Thank you for your report. We will review it shortly.',
    })
  }, [])

  const updateChatTheme = useCallback((chatId: string, theme: 'default' | 'blue' | 'green' | 'purple') => {
    setChats(prev => prev.map(chat => 
      chat.id === chatId 
        ? { ...chat, theme }
        : chat
    ))
  }, [])

  const value = {
    chats,
    messages,
    currentUser,
    activeCall,
    typingIndicators,
    unreadCount,
    sendMessage,
    markAsRead,
    startCall,
    endCall,
    setTyping,
    blockUser,
    reportUser,
    updateChatTheme,
  }

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>
}

export function useChat() {
  const context = useContext(ChatContext)
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider')
  }
  return context
}