// components/calendar/Calendar.tsx  
'use client'  
import { useState } from 'react'  
import { Calendar as BigCalendar, dateFnsLocalizer } from 'react-big-calendar'  
import {format} from 'date-fns/format'  
import {parse} from 'date-fns/parse'  
import {startOfWeek} from 'date-fns/startOfWeek'  
import {getDay} from 'date-fns/getDay'  
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

export default function Calendar({ events }:any) {  
  const [selectedEvent, setSelectedEvent] = useState(null)  
  const [selectedSlot, setSelectedSlot] = useState<any>(null)  

  const handleSelectEvent = (event:any) => {  
    setSelectedEvent(event)  
  }  

  const handleSelectSlot = (slotInfo:any) => {  
    setSelectedSlot(slotInfo)  
  }  

  return (  
    <>  
      <BigCalendar  
        localizer={localizer}  
        events={events.map((event:any) => ({  
          ...event,  
          start: new Date(event.startDate),  
          end: new Date(event.endDate)  
        }))}  
        startAccessor="start"  
        endAccessor="end"  
        style={{ height: 700 }}  
        onSelectEvent={handleSelectEvent}  
        onSelectSlot={handleSelectSlot}  
        selectable  
      />  

      {selectedEvent && (  
        <EventModal  
          mode="edit"  
          event={selectedEvent}  
          onClose={() => setSelectedEvent(null)}  
        />  
      )}  

      {selectedSlot && (  
        <EventModal  
          mode="create"  
          initialDate={selectedSlot.start}  
          onClose={() => setSelectedSlot(null)}  
        />  
      )}  
    </>  
  )  
}  