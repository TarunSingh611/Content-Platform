'use client'

import { useState, useEffect } from 'react'
import { Calendar as BigCalendar, dateFnsLocalizer } from 'react-big-calendar'
import { format } from 'date-fns/format'
import { parse } from 'date-fns/parse'
import { startOfWeek } from 'date-fns/startOfWeek'
import { getDay } from 'date-fns/getDay'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import EventModal from './EventModal'

const locales = {
  'en-US': require('date-fns/locale/en-US')
}

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales
})

interface CalendarEventData {
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

interface CalendarProps {
  events: CalendarEventData[]
  onEventCreated?: () => void
  onEventUpdated?: () => void
  onEventDeleted?: () => void
}

export default function Calendar({ 
  events, 
  onEventCreated, 
  onEventUpdated, 
  onEventDeleted 
}: CalendarProps) {
  const [selectedEvent, setSelectedEvent] = useState<{
    id: string
    title: string
    description: string
    startDate: Date
    endDate: Date
    allDay: boolean
    color: string
    createdAt: string
    updatedAt: string
  } | null>(null)
  const [selectedSlot, setSelectedSlot] = useState<{ start: Date; end: Date } | null>(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const handleSelectEvent = (event: CalendarEventData) => {
    // Transform the event to match the EventModal interface
    const transformedEvent = {
      ...event,
      startDate: new Date(event.startDate),
      endDate: new Date(event.endDate)
    }
    setSelectedEvent(transformedEvent)
  }

  const handleSelectSlot = (slotInfo: { start: Date; end: Date }) => {
    setSelectedSlot(slotInfo)
  }

  const handleEventCreated = () => {
    setSelectedSlot(null)
    onEventCreated?.()
  }

  const handleEventUpdated = () => {
    setSelectedEvent(null)
    onEventUpdated?.()
  }

  const handleEventDeleted = () => {
    setSelectedEvent(null)
    onEventDeleted?.()
  }

  const handleClose = () => {
    setSelectedEvent(null)
    setSelectedSlot(null)
  }

  // Transform events for react-big-calendar
  const calendarEvents = events.map((event: CalendarEventData) => ({
    ...event,
    start: new Date(event.startDate),
    end: new Date(event.endDate),
    title: event.title,
    allDay: event.allDay
  }))

  return (
    <>
      <div className="calendar-container">
        <BigCalendar
          localizer={localizer}
          events={calendarEvents}
          startAccessor="start"
          endAccessor="end"
          style={{ 
            height: isMobile ? 400 : 600,
            fontSize: isMobile ? '12px' : '14px'
          }}
          onSelectEvent={handleSelectEvent}
          onSelectSlot={handleSelectSlot}
          selectable
          popup
          defaultView={isMobile ? "month" : "month"}
          views={isMobile ? ['month'] : ['month', 'week', 'day']}
          eventPropGetter={(event) => ({
            style: {
              backgroundColor: event.color || '#4F46E5',
              borderColor: event.color || '#4F46E5',
              fontSize: isMobile ? '11px' : '12px',
              padding: isMobile ? '2px 4px' : '4px 8px'
            }
          })}
          components={{
            toolbar: (props) => (
              <div className="rbc-toolbar">
                <div className="rbc-btn-group">
                  <button
                    type="button"
                    onClick={() => props.onNavigate('PREV')}
                    className="rbc-btn"
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    onClick={() => props.onNavigate('TODAY')}
                    className="rbc-btn"
                  >
                    Today
                  </button>
                  <button
                    type="button"
                    onClick={() => props.onNavigate('NEXT')}
                    className="rbc-btn"
                  >
                    ›
                  </button>
                </div>
                <div className="rbc-toolbar-label">
                  {props.label}
                </div>
                {!isMobile && (
                  <div className="rbc-btn-group">
                    {Object.keys(props.views).map((view: string) => (
                      <button
                        key={view}
                        type="button"
                        onClick={() => props.onView(view as any)}
                        className={`rbc-btn ${props.view === view ? 'rbc-active' : ''}`}
                      >
                        {view.charAt(0).toUpperCase() + view.slice(1)}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )
          }}
        />
      </div>

      {selectedEvent && (
        <EventModal
          mode="edit"
          event={selectedEvent}
          onClose={handleClose}
          onEventUpdated={handleEventUpdated}
          onEventDeleted={handleEventDeleted}
        />
      )}

      {selectedSlot && (
        <EventModal
          mode="create"
          initialDate={selectedSlot.start}
          onClose={handleClose}
          onEventCreated={handleEventCreated}
        />
      )}

      <style jsx>{`
        .calendar-container {
          overflow-x: auto;
        }
        
        .rbc-toolbar {
          display: flex;
          flex-direction: ${isMobile ? 'column' : 'row'};
          align-items: center;
          justify-content: space-between;
          padding: 8px;
          gap: ${isMobile ? '8px' : '0'};
        }
        
        .rbc-toolbar-label {
          font-size: ${isMobile ? '14px' : '16px'};
          font-weight: 600;
          text-align: center;
        }
        
        .rbc-btn-group {
          display: flex;
          gap: 2px;
        }
        
        .rbc-btn {
          padding: ${isMobile ? '4px 8px' : '6px 12px'};
          font-size: ${isMobile ? '12px' : '14px'};
          border: 1px solid #ddd;
          background: white;
          cursor: pointer;
          border-radius: 4px;
        }
        
        .rbc-btn:hover {
          background: #f5f5f5;
        }
        
        .rbc-btn.rbc-active {
          background: #4F46E5;
          color: white;
          border-color: #4F46E5;
        }
        
        .rbc-event {
          border-radius: 3px;
          font-weight: 500;
        }
        
        .rbc-event-content {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        
        @media (max-width: 768px) {
          .rbc-calendar {
            font-size: 12px;
          }
          
          .rbc-header {
            padding: 4px 2px;
            font-size: 11px;
          }
          
          .rbc-date-cell {
            padding: 2px;
            font-size: 11px;
          }
          
          .rbc-event {
            margin: 1px;
            padding: 1px 2px;
          }
        }
      `}</style>
    </>
  )
}  