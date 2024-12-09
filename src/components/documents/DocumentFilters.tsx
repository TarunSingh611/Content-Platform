// components/documents/DocumentFilters.tsx  
'use client'  
import { useState } from 'react'  

export default function DocumentFilters() {  
  const [activeFilter, setActiveFilter] = useState('all')  
  const [sortBy, setSortBy] = useState('recent')  
  const [searchQuery, setSearchQuery] = useState('')  

  const filters = [  
    { id: 'all', label: 'All Documents' },  
    { id: 'doc', label: 'Documents' },  
    { id: 'pdf', label: 'PDFs' },  
    { id: 'sheet', label: 'Spreadsheets' },  
  ]  

  const sortOptions = [  
    { id: 'recent', label: 'Most Recent' },  
    { id: 'oldest', label: 'Oldest' },  
    { id: 'name', label: 'Name' },  
  ]  

  return (  
    <div className="bg-white p-4 rounded-lg shadow mb-6">  
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">  
        {/* Filter Buttons */}  
        <div className="flex flex-wrap gap-2">  
          {filters.map((filter) => (  
            <button  
              key={filter.id}  
              onClick={() => setActiveFilter(filter.id)}  
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors  
                ${activeFilter === filter.id  
                  ? 'bg-indigo-100 text-indigo-700'  
                  : 'text-gray-600 hover:bg-gray-100'  
                }`}  
            >  
              {filter.label}  
            </button>  
          ))}  
        </div>  

        {/* Sort and Search */}  
        <div className="flex flex-col sm:flex-row gap-4">  
          <select  
            value={sortBy}  
            onChange={(e) => setSortBy(e.target.value)}  
            className="px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"  
          >  
            {sortOptions.map((option) => (  
              <option key={option.id} value={option.id}>  
                {option.label}  
              </option>  
            ))}  
          </select>  

          <div className="relative">  
            <input  
              type="text"  
              placeholder="Search documents..."  
              value={searchQuery}  
              onChange={(e) => setSearchQuery(e.target.value)}  
              className="pl-10 pr-4 py-1.5 w-full border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"  
            />  
            <svg  
              className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"  
              fill="none"  
              stroke="currentColor"  
              viewBox="0 0 24 24"  
            >  
              <path  
                strokeLinecap="round"  
                strokeLinejoin="round"  
                strokeWidth={2}  
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"  
              />  
            </svg>  
          </div>  
        </div>  
      </div>  
    </div>  
  )  
}  