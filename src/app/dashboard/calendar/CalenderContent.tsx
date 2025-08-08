// app/dashboard/calendar/CalendarContent.tsx  
'use client'  

import { useState } from 'react'  
import Calendar from '@/components/calendar/Calendar'  
import EventModal from '@/components/calendar/EventModal'  
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

interface CalendarEvent {
  id: string
  title: string
  description: string
  startDate: string
  endDate: string
  allDay: boolean
  color: string
  createdAt: string
  updatedAt: string
}

interface CalendarContentProps {
  initialEvents: CalendarEvent[]
  onEventCreated?: () => void
  onEventUpdated?: () => void
  onEventDeleted?: () => void
}

export default function CalendarContent({ 
  initialEvents, 
  onEventCreated, 
  onEventUpdated, 
  onEventDeleted 
}: CalendarContentProps) {
  const [showCreateModal, setShowCreateModal] = useState(false)

  const handleEventCreated = () => {
    setShowCreateModal(false)
    onEventCreated?.()
  }

  const handleEventUpdated = () => {
    onEventUpdated?.()
  }

  const handleEventDeleted = () => {
    onEventDeleted?.()
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Event Calendar</h2>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">Click on a date to create an event or click on an existing event to edit</p>
        </div>
        <Button
          onClick={() => setShowCreateModal(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 sm:px-4 sm:py-2 text-sm sm:text-base"
        >
          <Plus className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">Create Event</span>
          <span className="sm:hidden">New Event</span>
        </Button>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <Calendar 
          events={initialEvents} 
          onEventCreated={handleEventCreated}
          onEventUpdated={handleEventUpdated}
          onEventDeleted={handleEventDeleted}
        />
      </div>

      {showCreateModal && (
        <EventModal
          mode="create"
          initialDate={new Date()}
          onClose={() => setShowCreateModal(false)}
          onEventCreated={handleEventCreated}
        />
      )}
    </div>
  )
}  