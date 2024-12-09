'use client'  
  
import { useState } from 'react'  
import { Bell, Search, Plus, MessageSquare } from 'lucide-react'  
import { useSession } from 'next-auth/react'  
  
export default function Header() {  
  const [searchQuery, setSearchQuery] = useState('')  
  const { data: session, status } = useSession()  
  
  return (  
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-20">  
      {/* Search Bar */}  
      <div className="flex-1 max-w-2xl">  
        <div className="relative">  
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />  
          <input  
            type="text"  
            placeholder="Search..."  
            value={searchQuery}  
            onChange={(e) => setSearchQuery(e.target.value)}  
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"  
          />  
        </div>  
      </div>  
  
      {/* Action Buttons */}  
      <div className="flex items-center space-x-4">  
        {status === 'loading' ? (  
          // Skeleton loader for authentication state  
          <div className="flex items-center space-x-4">  
            <div className="w-32 h-10 bg-gray-200 rounded-lg animate-pulse" />  
            <div className="w-10 h-10 bg-gray-200 rounded-lg animate-pulse" />  
            <div className="w-10 h-10 bg-gray-200 rounded-lg animate-pulse" />  
            <div className="flex items-center space-x-3">  
              <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />  
              <div className="hidden md:block">  
                <div className="w-24 h-4 bg-gray-200 rounded animate-pulse mb-1" />  
                <div className="w-32 h-3 bg-gray-200 rounded animate-pulse" />  
              </div>  
            </div>  
          </div>  
        ) : status === 'authenticated' && (  
          <>
  
            <button className="relative p-2 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-lg">  
              <MessageSquare size={20} />  
              <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white" />  
            </button>  
  
            <button className="relative p-2 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-lg">  
              <Bell size={20} />  
              <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white" />  
            </button>  
  
            <div className="relative">  
              <button className="flex items-center space-x-3 focus:outline-none">  
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">  
                  {session?.user?.image ? (  
                    <img  
                      src={session.user.image}  
                      alt={session.user.name || 'User'}  
                      className="w-8 h-8 rounded-full"  
                    />  
                  ) : (  
                    <span className="text-sm font-medium text-gray-600">  
                      {session?.user?.name?.[0] || 'U'}  
                    </span>  
                  )}  
                </div>  
                <div className="hidden md:block text-left">  
                  <p className="text-sm font-medium text-gray-700">  
                    {session?.user?.name || 'User'}  
                  </p>  
                  <p className="text-xs text-gray-500">  
                    {session?.user?.email || 'user@example.com'}  
                  </p>  
                </div>  
              </button>  
            </div>  
          </>  
        )}  
      </div>  
    </header>  
  )  
}  