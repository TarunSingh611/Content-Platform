// components/calendar/EventModal.tsx  
import { useState, useEffect } from "react";  

interface Event {  
  id?: string;  
  title: string;  
  description: string;  
  startDate: Date;  
  endDate: Date;  
  allDay: boolean;  
  color: string;  
}  

interface EventModalProps {  
  mode: 'create' | 'edit';  
  event?: Event;  
  initialDate?: Date;  
  onClose: () => void;  
}  

export default function EventModal({ mode, event, initialDate, onClose }: EventModalProps) {  
  const [eventData, setEventData] = useState<Event>({  
    title: '',  
    description: '',  
    startDate: initialDate || new Date(),  
    endDate: initialDate || new Date(),  
    allDay: false,  
    color: '#4F46E5'  
  });  
  const [isSubmitting, setIsSubmitting] = useState(false);  

  useEffect(() => {  
    if (mode === 'edit' && event) {  
      setEventData(event);  
    }  
  }, [mode, event]);  

  const handleSubmit = async (e: React.FormEvent) => {  
    e.preventDefault();  
    setIsSubmitting(true);  

    try {  
      const response = await fetch(`/api/events${mode === 'edit' && event?.id ? `/${event.id}` : ''}`, {  
        method: mode === 'edit' ? 'PUT' : 'POST',  
        headers: {  
          'Content-Type': 'application/json',  
        },  
        body: JSON.stringify(eventData),  
      });  

      if (!response.ok) {  
        throw new Error(`Failed to ${mode} event`);  
      }  

      onClose();  
    } catch (error) {  
      console.error(`Error ${mode}ing event:`, error);  
    } finally {  
      setIsSubmitting(false);  
    }  
  };  

  const handleDelete = async () => {  
    if (!event?.id || !confirm('Are you sure you want to delete this event?')) return;  

    setIsSubmitting(true);  
    try {  
      const response = await fetch(`/api/events/${event.id}`, {  
        method: 'DELETE',  
      });  

      if (!response.ok) {  
        throw new Error('Failed to delete event');  
      }  

      onClose();  
    } catch (error) {  
      console.error('Error deleting event:', error);  
    } finally {  
      setIsSubmitting(false);  
    }  
  };  

  return (  
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">  
      <div className="bg-white rounded-lg max-w-md w-full">  
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

          <form onSubmit={handleSubmit} className="space-y-4">  
            <div>  
              <label className="block text-sm font-medium text-gray-700">  
                Title  
              </label>  
              <input  
                type="text"  
                value={eventData.title}  
                onChange={(e) => setEventData({...eventData, title: e.target.value})}  
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"  
                required  
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
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"  
              />  
            </div>  

            <div className="grid grid-cols-2 gap-4">  
              <div>  
                <label className="block text-sm font-medium text-gray-700">  
                  Start Date  
                </label>  
                <input  
                  type="datetime-local"  
                  value={eventData.startDate.toISOString().slice(0, 16)}  
                  onChange={(e) => setEventData({...eventData, startDate: new Date(e.target.value)})}  
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"  
                  required  
                />  
              </div>  

              <div>  
                <label className="block text-sm font-medium text-gray-700">  
                  End Date  
                </label>  
                <input  
                  type="datetime-local"  
                  value={eventData.endDate.toISOString().slice(0, 16)}  
                  onChange={(e) => setEventData({...eventData, endDate: new Date(e.target.value)})}  
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"  
                  required  
                />  
              </div>  
            </div>  

            <div className="flex items-center">  
              <input  
                type="checkbox"  
                checked={eventData.allDay}  
                onChange={(e) => setEventData({...eventData, allDay: e.target.checked})}  
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"  
              />  
              <label className="ml-2 block text-sm text-gray-700">  
                All day event  
              </label>  
            </div>  

            <div>  
              <label className="block text-sm font-medium text-gray-700">  
                Color  
              </label>  
              <input  
                type="color"  
                value={eventData.color}  
                onChange={(e) => setEventData({...eventData, color: e.target.value})}  
                className="mt-1 block w-full h-10 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"  
              />  
            </div>  

            <div className="flex justify-end space-x-3 mt-6">  
              {mode === 'edit' && (  
                <button  
                  type="button"  
                  onClick={handleDelete}  
                  disabled={isSubmitting}  
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"  
                >  
                  Delete  
                </button>  
              )}  
              <button  
                type="button"  
                onClick={onClose}  
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"  
              >  
                Cancel  
              </button>  
              <button  
                type="submit"  
                disabled={isSubmitting}  
                className={`px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700  
                  ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}  
              >  
                {isSubmitting ? 'Saving...' : 'Save Event'}  
              </button>  
            </div>  
          </form>  
        </div>  
      </div>  
    </div>  
  );  
}  