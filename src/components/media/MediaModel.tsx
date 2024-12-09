// components/media/MediaModal.tsx  
'use client'  
import { useState } from 'react'  
import Image from 'next/image'  
import { formatBytes } from '@/lib/utils'  

interface MediaFile {  
  id: string  
  name: string  
  url: string  
  type: string  
  size: number  
  createdAt: string  
  updatedAt: string  
}  

interface MediaModalProps {  
  file: MediaFile  
  onClose: () => void  
  onDelete?: () => Promise<void>  
}  

export default function MediaModal({ file, onClose, onDelete }: MediaModalProps) {  
  const [isDeleting, setIsDeleting] = useState(false)  
  const [copySuccess, setCopySuccess] = useState(false)  

  const handleCopyUrl = async () => {  
    try {  
      await navigator.clipboard.writeText(file.url)  
      setCopySuccess(true)  
      setTimeout(() => setCopySuccess(false), 2000)  
    } catch (err) {  
      console.error('Failed to copy URL:', err)  
    }  
  }  

  const handleDelete = async () => {  
    if (!onDelete || !confirm('Are you sure you want to delete this file?')) return  

    setIsDeleting(true)  
    try {  
      await onDelete()  
      onClose()  
    } catch (error) {  
      console.error('Error deleting file:', error)  
      setIsDeleting(false)  
    }  
  }  

  const isImage = file.type.startsWith('image/')  
  const isVideo = file.type.startsWith('video/')  
  const isPDF = file.type === 'application/pdf'  

  return (  
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">  
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">  
        <div className="p-6">  
          <div className="flex justify-between items-center mb-6">  
            <h2 className="text-xl font-semibold">File Details</h2>  
            <button  
              onClick={onClose}  
              className="text-gray-400 hover:text-gray-500"  
            >  
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">  
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />  
              </svg>  
            </button>  
          </div>  

          <div className="space-y-6">  
            {/* Preview */}  
            <div className="border rounded-lg p-4 bg-gray-50 flex items-center justify-center">  
              {isImage && (  
                <div className="relative w-full h-[300px]">  
                  <Image  
                    src={file.url}  
                    alt={file.name}  
                    fill  
                    className="object-contain"  
                  />  
                </div>  
              )}  
              {isVideo && (  
                <video  
                  src={file.url}  
                  controls  
                  className="max-h-[300px] w-auto"  
                >  
                  Your browser does not support the video tag.  
                </video>  
              )}  
              {isPDF && (  
                <iframe  
                  src={file.url}  
                  className="w-full h-[300px]"  
                  title={file.name}  
                />  
              )}  
              {!isImage && !isVideo && !isPDF && (  
                <div className="text-center p-8">  
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">  
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />  
                  </svg>  
                  <p className="mt-2 text-sm text-gray-500">  
                    Preview not available  
                  </p>  
                </div>  
              )}  
            </div>  

            {/* File Details */}  
            <div className="grid grid-cols-2 gap-4">  
              <div>  
                <label className="block text-sm font-medium text-gray-700">  
                  File Name  
                </label>  
                <p className="mt-1 text-sm text-gray-900">{file.name}</p>  
              </div>  
              <div>  
                <label className="block text-sm font-medium text-gray-700">  
                  File Type  
                </label>  
                <p className="mt-1 text-sm text-gray-900">{file.type}</p>  
              </div>  
              <div>  
                <label className="block text-sm font-medium text-gray-700">  
                  File Size  
                </label>  
                <p className="mt-1 text-sm text-gray-900">{formatBytes(file.size)}</p>  
              </div>  
              <div>  
                <label className="block text-sm font-medium text-gray-700">  
                  Upload Date  
                </label>  
                <p className="mt-1 text-sm text-gray-900">  
                  {new Date(file.createdAt).toLocaleDateString()}  
                </p>  
              </div>  
            </div>  

            {/* URL Copy */}  
            <div className="flex items-center space-x-2">  
              <input  
                type="text"  
                value={file.url}  
                readOnly  
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"  
              />  
              <button  
                onClick={handleCopyUrl}  
                className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"  
              >  
                {copySuccess ? 'Copied!' : 'Copy URL'}  
              </button>  
            </div>  

            {/* Actions */}  
            <div className="flex justify-end space-x-3 mt-6">  
              {onDelete && (  
                <button  
                  onClick={handleDelete}  
                  disabled={isDeleting}  
                  className={`px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700  
                    ${isDeleting ? 'opacity-50 cursor-not-allowed' : ''}`}  
                >  
                  {isDeleting ? 'Deleting...' : 'Delete File'}  
                </button>  
              )}  
              <button  
                onClick={onClose}  
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"  
              >  
                Close  
              </button>  
            </div>  
          </div>  
        </div>  
      </div>  
    </div>  
  )  
}  