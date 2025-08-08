// components/calendar/EventModal.tsx  
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface Event {
  id?: string
  title: string
  description: string
  startDate: Date
  endDate: Date
  allDay: boolean
  color: string
}

interface EventModalProps {
  mode: 'create' | 'edit'
  event?: Event
  initialDate?: Date
  onClose: () => void
  onEventCreated?: () => void
  onEventUpdated?: () => void
  onEventDeleted?: () => void
}

export default function EventModal({ 
  mode, 
  event, 
  initialDate, 
  onClose,
  onEventCreated,
  onEventUpdated,
  onEventDeleted
}: EventModalProps) {
  const [eventData, setEventData] = useState<Event>({
    title: '',
    description: '',
    startDate: initialDate || new Date(),
    endDate: initialDate || new Date(),
    allDay: false,
    color: '#4F46E5'
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    if (mode === 'edit' && event) {
      setEventData(event)
    }
  }, [mode, event])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch(`/api/event${mode === 'edit' && event?.id ? `/${event.id}` : ''}`, {
        method: mode === 'edit' ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...eventData,
          startDate: eventData.startDate.toISOString(),
          endDate: eventData.endDate.toISOString()
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `Failed to ${mode} event`)
      }

      const result = await response.json()
      setSuccess(result.message || `Event ${mode === 'edit' ? 'updated' : 'created'} successfully`)
      
      // Call the appropriate callback
      if (mode === 'create') {
        onEventCreated?.()
      } else {
        onEventUpdated?.()
      }

      // Close modal after a short delay to show success message
      setTimeout(() => {
        onClose()
      }, 1000)
    } catch (error) {
      console.error(`Error ${mode}ing event:`, error)
      setError(error instanceof Error ? error.message : `Failed to ${mode} event`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!event?.id || !confirm('Are you sure you want to delete this event?')) return

    setIsSubmitting(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch(`/api/event/${event.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete event')
      }

      const result = await response.json()
      setSuccess(result.message || 'Event deleted successfully')
      
      onEventDeleted?.()

      // Close modal after a short delay to show success message
      setTimeout(() => {
        onClose()
      }, 1000)
    } catch (error) {
      console.error('Error deleting event:', error)
      setError(error instanceof Error ? error.message : 'Failed to delete event')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">
              {mode === 'edit' ? 'Edit Event' : 'Create Event'}
            </h2>
            <button
              className="text-gray-400 hover:text-gray-500"
              onClick={onClose}
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
              <p className="text-sm text-green-600">{success}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Title *
              </label>
              <Input
                type="text"
                value={eventData.title}
                onChange={(e) => setEventData({...eventData, title: e.target.value})}
                className="mt-1"
                required
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                value={eventData.description}
                onChange={(e) => setEventData({...eventData, description: e.target.value})}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 disabled:opacity-50"
                disabled={isSubmitting}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Start Date *
                </label>
                <Input
                  type="datetime-local"
                  value={eventData.startDate.toISOString().slice(0, 16)}
                  onChange={(e) => setEventData({...eventData, startDate: new Date(e.target.value)})}
                  className="mt-1"
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  End Date *
                </label>
                <Input
                  type="datetime-local"
                  value={eventData.endDate.toISOString().slice(0, 16)}
                  onChange={(e) => setEventData({...eventData, endDate: new Date(e.target.value)})}
                  className="mt-1"
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                checked={eventData.allDay}
                onChange={(e) => setEventData({...eventData, allDay: e.target.checked})}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded disabled:opacity-50"
                disabled={isSubmitting}
              />
              <label className="ml-2 block text-sm text-gray-700">
                All day event
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Color
              </label>
              <Input
                type="color"
                value={eventData.color}
                onChange={(e) => setEventData({...eventData, color: e.target.value})}
                className="mt-1 h-10 w-full"
                disabled={isSubmitting}
              />
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              {mode === 'edit' && (
                <Button
                  type="button"
                  onClick={handleDelete}
                  disabled={isSubmitting}
                  variant="destructive"
                >
                  Delete
                </Button>
              )}
              <Button
                type="button"
                onClick={onClose}
                variant="outline"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                {isSubmitting ? 'Saving...' : mode === 'edit' ? 'Update Event' : 'Create Event'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}  