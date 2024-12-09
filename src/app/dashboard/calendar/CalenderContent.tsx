// app/dashboard/calendar/CalendarContent.tsx  
'use client'  

import { useState } from 'react'  
import Calendar from '@/components/calendar/Calendar'  
import EventModal from '@/components/calendar/EventModal'  

interface CalendarContentProps {  
  initialEvents: any[] // Type this according to your Event type  
}  

export default function CalendarContent({ initialEvents }: CalendarContentProps) {  
  const [showCreateModal, setShowCreateModal] = useState(false)  

  return (  
    <div className="p-6">  
      <div className="flex justify-between items-center mb-6">  
        <h1 className="text-2xl font-bold">Calendar</h1>  
        <button  
          onClick={() => setShowCreateModal(true)}  
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"  
        >  
          Create Event  
        </button>  
      </div>  

      <div className="bg-white rounded-lg shadow p-6">  
        <Calendar events={initialEvents} />  
      </div>  

      {showCreateModal && (  
        <EventModal   
          mode="create"  
          initialDate={new Date()}  
          onClose={() => setShowCreateModal(false)}  
        />  
      )}  
    </div>  
  )  
}  