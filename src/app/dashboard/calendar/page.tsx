'use client'

import { useState, useEffect } from 'react'
import { Calendar, Plus, Filter, Search } from 'lucide-react'
import CalendarContent from './CalenderContent'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import DemoRibbon from '@/components/ui/DemoRibbon'

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

export default function CalendarPage() {
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'upcoming' | 'past'>('all')

  // Fetch events from API
  const fetchEvents = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/event')
      if (response.ok) {
        const data = await response.json()
        setEvents(data.events || [])
      }
    } catch (error) {
      console.error('Error fetching events:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEvents()
  }, [])

  // Filter events based on search and filter
  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase())
    
    if (!matchesSearch) return false

    const now = new Date()
    const eventStart = new Date(event.startDate)

    switch (filterType) {
      case 'upcoming':
        return eventStart >= now
      case 'past':
        return eventStart < now
      default:
        return true
    }
  })

  // Calculate stats
  const stats = {
    total: events.length,
    upcoming: events.filter(e => new Date(e.startDate) >= new Date()).length,
    past: events.filter(e => new Date(e.startDate) < new Date()).length,
    today: events.filter(e => {
      const today = new Date()
      const eventDate = new Date(e.startDate)
      return eventDate.toDateString() === today.toDateString()
    }).length
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Calendar</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">Manage your events and schedule</p>
        </div>
        <div className="flex items-center gap-3">
          <DemoRibbon message="Calendar Sync - Coming Soon!" />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600">Total Events</p>
              <p className="text-lg sm:text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <Calendar className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600">Upcoming</p>
              <p className="text-lg sm:text-2xl font-bold text-gray-900">{stats.upcoming}</p>
            </div>
            <Plus className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600">Past Events</p>
              <p className="text-lg sm:text-2xl font-bold text-gray-900">{stats.past}</p>
            </div>
            <Filter className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600">Today</p>
              <p className="text-lg sm:text-2xl font-bold text-gray-900">{stats.today}</p>
            </div>
            <Search className="h-6 w-6 sm:h-8 sm:w-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center justify-between">
          {/* Search */}
          <div className="relative flex-1 max-w-md w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <Input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 text-sm sm:text-base"
            />
          </div>

          {/* Filter */}
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="text-sm sm:text-base border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-3 py-2"
            >
              <option value="all">All Events</option>
              <option value="upcoming">Upcoming</option>
              <option value="past">Past</option>
            </select>
          </div>
        </div>
      </div>

      {/* Calendar Component */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
        <CalendarContent 
          initialEvents={filteredEvents}
          onEventCreated={fetchEvents}
          onEventUpdated={fetchEvents}
          onEventDeleted={fetchEvents}
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 sm:p-6">
        <h3 className="text-lg font-semibold mb-4">Calendar Features</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <DemoRibbon message="Google Calendar Sync - Coming Soon!" />
          <DemoRibbon message="Event Reminders - Coming Soon!" />
          <DemoRibbon message="Recurring Events - Coming Soon!" />
          <DemoRibbon message="Team Calendar - Coming Soon!" />
          <DemoRibbon message="Event Templates - Coming Soon!" />
          <DemoRibbon message="Calendar Export - Coming Soon!" />
        </div>
      </div>
    </div>
  )
}  