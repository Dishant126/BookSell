"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Phone, PhoneOff, Mic, MicOff, Video, VideoOff } from 'lucide-react'
import type { CallSession } from '@/lib/chat-types'

interface CallScreenProps {
  call: CallSession
  onEndCall: () => void
}

export function CallScreen({ call, onEndCall }: CallScreenProps) {
  const [duration, setDuration] = useState(0)
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOn, setIsVideoOn] = useState(call.type === 'video')
  
  const otherUser = call.participants.find(p => p.id !== 'current-user')

  useEffect(() => {
    let interval: NodeJS.Timeout
    
    if (call.status === 'connected' && call.startTime) {
      interval = setInterval(() => {
        const start = new Date(call.startTime!).getTime()
        const now = new Date().getTime()
        setDuration(Math.floor((now - start) / 1000))
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [call.status, call.startTime])

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const getStatusText = () => {
    switch (call.status) {
      case 'ringing':
        return 'Calling...'
      case 'connected':
        return formatDuration(duration)
      case 'ended':
        return 'Call ended'
      default:
        return ''
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 flex flex-col items-center justify-center text-white relative">
      {/* Background blur effect */}
      <div className="absolute inset-0 bg-black/30"></div>
      
      <div className="relative z-10 flex flex-col items-center space-y-8 max-w-md mx-auto px-4">
        {/* User Avatar */}
        <div className="relative">
          <Avatar className="w-32 h-32 border-4 border-white/20">
            <AvatarImage src={otherUser?.avatar || '/placeholder.svg'} alt={otherUser?.name} />
            <AvatarFallback className="text-2xl bg-white/20">
              {otherUser?.name?.split(' ').map(n => n[0]).join('') || 'U'}
            </AvatarFallback>
          </Avatar>
          {call.status === 'ringing' && (
            <div className="absolute inset-0 rounded-full border-4 border-white/50 animate-ping"></div>
          )}
        </div>

        {/* User Info */}
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">{otherUser?.name}</h2>
          <p className="text-white/80 text-lg">{getStatusText()}</p>
        </div>

        {/* Book Info */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 w-full">
          <div className="flex items-center space-x-3">
            <img
              src={call.participants[0]?.avatar || '/placeholder.svg'}
              alt="Book"
              className="w-12 h-16 object-cover rounded"
            />
            <div>
              <h3 className="font-semibold">Discussing Book</h3>
              <p className="text-white/80 text-sm">The Midnight Library</p>
              <p className="text-white/60 text-xs">$15.99 • Rent $3.99/week</p>
            </div>
          </div>
        </div>

        {/* Call Controls */}
        <div className="flex items-center space-x-6">
          {call.type === 'video' && (
            <Button
              variant="ghost"
              size="icon"
              className={`w-14 h-14 rounded-full ${isVideoOn ? 'bg-white/20' : 'bg-red-500'} hover:bg-white/30`}
              onClick={() => setIsVideoOn(!isVideoOn)}
            >
              {isVideoOn ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
            </Button>
          )}
          
          <Button
            variant="ghost"
            size="icon"
            className={`w-14 h-14 rounded-full ${isMuted ? 'bg-red-500' : 'bg-white/20'} hover:bg-white/30`}
            onClick={() => setIsMuted(!isMuted)}
          >
            {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600"
            onClick={onEndCall}
          >
            <PhoneOff className="w-8 h-8" />
          </Button>
        </div>

        {/* Additional Info */}
        {call.status === 'ringing' && (
          <p className="text-white/60 text-center text-sm">
            Connecting you with the seller...
          </p>
        )}
      </div>
    </div>
  )
}