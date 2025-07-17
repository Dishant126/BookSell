"use client"

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Check } from 'lucide-react'

interface ChatThemeSelectorProps {
  currentTheme: string
  onThemeSelect: (theme: 'default' | 'blue' | 'green' | 'purple') => void
  onClose: () => void
}

const themes = [
  { id: 'default', name: 'Default', color: 'bg-amber-500' },
  { id: 'blue', name: 'Ocean Blue', color: 'bg-blue-500' },
  { id: 'green', name: 'Forest Green', color: 'bg-green-500' },
  { id: 'purple', name: 'Royal Purple', color: 'bg-purple-500' },
]

export function ChatThemeSelector({ currentTheme, onThemeSelect, onClose }: ChatThemeSelectorProps) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg">Chat Theme</CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              ✕
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {themes.map((theme) => (
            <Button
              key={theme.id}
              variant="outline"
              className="w-full justify-start text-left h-auto py-3 bg-transparent"
              onClick={() => onThemeSelect(theme.id as any)}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-6 h-6 rounded-full ${theme.color}`}></div>
                <span className="flex-1">{theme.name}</span>
                {currentTheme === theme.id && (
                  <Check className="w-4 h-4 text-green-600" />
                )}
              </div>
            </Button>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}