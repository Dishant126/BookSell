"use client"

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { QuickReply } from '@/lib/chat-types'

interface QuickRepliesProps {
  replies: QuickReply[]
  onSelect: (reply: string) => void
  onClose: () => void
}

export function QuickReplies({ replies, onSelect, onClose }: QuickRepliesProps) {
  const categories = Array.from(new Set(replies.map(r => r.category)))

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center p-4">
      <Card className="w-full max-w-md max-h-96 overflow-hidden">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg">Quick Replies</CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              ✕
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 max-h-64 overflow-y-auto">
          {categories.map(category => (
            <div key={category}>
              <h4 className="text-sm font-medium text-muted-foreground mb-2 capitalize">
                {category}
              </h4>
              <div className="space-y-2">
                {replies
                  .filter(reply => reply.category === category)
                  .map(reply => (
                    <Button
                      key={reply.id}
                      variant="outline"
                      className="w-full justify-start text-left h-auto py-2 px-3 bg-transparent"
                      onClick={() => onSelect(reply.text)}
                    >
                      {reply.text}
                    </Button>
                  ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}