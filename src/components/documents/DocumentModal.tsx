// components/documents/DocumentModal.tsx  
'use client'  
import { useState, useEffect } from 'react'  

interface DocumentModalProps {  
  document: {  
    id: string  
    title: string  
    content: string  
    type: string  
    status: string  
  }  
  onClose: () => void  
}  

export default function DocumentModal({ document, onClose }: DocumentModalProps) {  
  const [title, setTitle] = useState(document.title)  
  const [content, setContent] = useState(document.content)  
  const [type, setType] = useState(document.type)  
  const [status, setStatus] = useState(document.status)  
  const [isSaving, setIsSaving] = useState(false)  

  useEffect(() => {  
    const handleEscape = (e: KeyboardEvent) => {  
      if (e.key === 'Escape') {  
        onClose()  
      }  
    }  
    window.addEventListener('keydown', handleEscape)  
    return () => window.removeEventListener('keydown', handleEscape)  
  }, [onClose])  

  const handleSubmit = async (e: React.FormEvent) => {  
    e.preventDefault()  
    setIsSaving(true)  

    try {  
      const response = await fetch(`/api/documents/${document.id}`, {  
        method: 'PUT',  
        headers: {  
          'Content-Type': 'application/json',  
        },  
        body: JSON.stringify({  
          title,  
          content,  
          type,  
          status,  
        }),  
      })  

      if (!response.ok) {  
        throw new Error('Failed to update document')  
      }  

      onClose()  
    } catch (error) {  
      console.error('Error updating document:', error)  
      // Handle error (show error message to user)  
    } finally {  
      setIsSaving(false)  
    }  
  }  

  return (  
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">  
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">  
        <div className="p-6">  
          <div className="flex justify-between items-center mb-6">  
            <h2 className="text-xl font-semibold">Edit Document</h2>  
            <button  
              onClick={onClose}  
              className="text-gray-400 hover:text-gray-500"  
            >  
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">  
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />  
              </svg>  
            </button>  
          </div>  

          <form onSubmit={handleSubmit} className="space-y-6">  
            <div>  
              <label className="block text-sm font-medium text-gray-700 mb-1">  
                Title  
              </label>  
              <input  
                type="text"  
                value={title}  
                onChange={(e) => setTitle(e.target.value)}  
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"  
                required  
              />  
            </div>  

            <div>  
              <label className="block text-sm font-medium text-gray-700 mb-1">  
                Type  
              </label>  
              <select  
                value={type}  
                onChange={(e) => setType(e.target.value)}  
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"  
              >  
                <option value="doc">Document</option>  
                <option value="pdf">PDF</option>  
                <option value="sheet">Spreadsheet</option>  
              </select>  
            </div>  

            <div>  
              <label className="block text-sm font-medium text-gray-700 mb-1">  
                Status  
              </label>  
              <select  
                value={status}  
                onChange={(e) => setStatus(e.target.value)}  
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"  
              >  
                <option value="draft">Draft</option>  
                <option value="published">Published</option>  
                <option value="archived">Archived</option>  
              </select>  
            </div>  

            <div>  
              <label className="block text-sm font-medium text-gray-700 mb-1">  
                Content  
              </label>  
              <textarea  
                value={content}  
                onChange={(e) => setContent(e.target.value)}  
                rows={8}  
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"  
                required  
              />  
            </div>  

            <div className="flex justify-end space-x-3">  
              <button  
                type="button"  
                onClick={onClose}  
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"  
              >  
                Cancel  
              </button>  
              <button  
                type="submit"  
                disabled={isSaving}  
                className={`px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md   
                  ${isSaving ? 'opacity-50 cursor-not-allowed' : 'hover:bg-indigo-700'}  
                  focus:outline-none focus:ring-2 focus:ring-indigo-500`}  
              >  
                {isSaving ? 'Saving...' : 'Save Changes'}  
              </button>  
            </div>  
          </form>  
        </div>  
      </div>  
    </div>  
  )  
}  