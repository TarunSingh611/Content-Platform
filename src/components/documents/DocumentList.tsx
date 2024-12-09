// components/documents/DocumentList.tsx  
'use client'  
import { useState } from 'react'  
import {   
  DocumentIcon,   
  PencilIcon,   
  TrashIcon   
} from '@heroicons/react/24/outline'  
import DocumentModal from './DocumentModal'

export default function DocumentList({ documents }:any) {  
  const [selectedDoc, setSelectedDoc] = useState(null)  

  const handleDelete = async (id:any) => {  
    if (confirm('Are you sure you want to delete this document?')) {  
      try {  
        await fetch(`/api/documents/${id}`, {  
          method: 'DELETE'  
        })  
        // Refresh the list  
        window.location.reload()  
      } catch (error) {  
        console.error('Failed to delete document:', error)  
      }  
    }  
  }  

  return (  
    <div className="bg-white rounded-lg shadow">  
      <table className="min-w-full divide-y divide-gray-200">  
        <thead className="bg-gray-50">  
          <tr>  
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">  
              Title  
            </th>  
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">  
              Type  
            </th>  
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">  
              Status  
            </th>  
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">  
              Last Modified  
            </th>  
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">  
              Actions  
            </th>  
          </tr>  
        </thead>  
        <tbody className="bg-white divide-y divide-gray-200">  
          {documents.map((doc:any) => (  
            <tr key={doc.id}>  
              <td className="px-6 py-4 whitespace-nowrap">  
                <div className="flex items-center">  
                  <DocumentIcon className="h-5 w-5 text-gray-400 mr-2" />  
                  <span className="text-sm font-medium text-gray-900">{doc.title}</span>  
                </div>  
              </td>  
              <td className="px-6 py-4 whitespace-nowrap">  
                <span className="text-sm text-gray-500">{doc.type}</span>  
              </td>  
              <td className="px-6 py-4 whitespace-nowrap">  
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${  
                  doc.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'  
                }`}>  
                  {doc.status}  
                </span>  
              </td>  
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">  
                {new Date(doc.updatedAt).toLocaleDateString()}  
              </td>  
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">  
                <button  
                  onClick={() => setSelectedDoc(doc)}  
                  className="text-indigo-600 hover:text-indigo-900 mr-4"  
                >  
                  <PencilIcon className="h-5 w-5" />  
                </button>  
                <button  
                  onClick={() => handleDelete(doc.id)}  
                  className="text-red-600 hover:text-red-900"  
                >  
                  <TrashIcon className="h-5 w-5" />  
                </button>  
              </td>  
            </tr>  
          ))}  
        </tbody>  
      </table>  

      {selectedDoc && (  
        <DocumentModal document={selectedDoc} onClose={() => setSelectedDoc(null)} />  
      )}  
    </div>  
  )  
}  