"use client"

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MapPin } from 'lucide-react'

interface MeetingSuggestionsProps {
  locations: string[]
  onSelect: (location: string) => void
  onClose: () => void
}

export function MeetingSuggestions({ locations, onSelect, onClose }: MeetingSuggestionsProps) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg flex items-center">
              <MapPin className="w-5 h-5 mr-2" />
              Suggest Meeting Location
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              ✕
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          {locations.map((location, index) => (
            <Button
              key={index}
              variant="outline"
              className="w-full justify-start text-left bg-transparent"
              onClick={() => onSelect(location)}
            >
              <MapPin className="w-4 h-4 mr-2" />
              {location}
            </Button>
          ))}
          
          <div className="pt-2 border-t">
            <Button
              variant="outline"
              className="w-full justify-start text-left bg-transparent"
              onClick={() => onSelect('Custom location')}
            >
              <MapPin className="w-4 h-4 mr-2" />
              Other location...
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}