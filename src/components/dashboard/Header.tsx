'use client'

import { useEffect, useState } from 'react'
import { Bell, Plus, MessageSquare, LogOut, ExternalLink, Settings, Search, Menu } from 'lucide-react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

import { Input } from '@/components/ui/input'

export default function Header() {
  const { data: session, status, update } = useSession()
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const router = useRouter()

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/auth' })
  }

  const handleCreateContent = () => {
    router.push('/dashboard/content/new')
  }

  const handleSettings = () => {
    router.push('/dashboard/settings')
    setShowProfileMenu(false)
  }

  const handleVisitSite = () => {
    if (session?.user?.websiteUrl) {
      window.open(session.user.websiteUrl, '_blank', 'noopener,noreferrer')
    }
    setShowProfileMenu(false)
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showProfileMenu && !(event.target as Element).closest('.profile-menu')) {
        setShowProfileMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showProfileMenu])

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 lg:px-8 sticky top-0 z-20">
      {/* Logo - Hidden on mobile since we have the menu button */}
      <div className="flex items-center">
        <Image src="/logo.svg" alt="AI Content Platform" width={32} height={32} className="w-8 h-8 mr-3" />
        <span className="text-xl font-bold text-gray-800 mobile-only">AI CMS</span>
        <span className="text-xl font-bold text-gray-800 desktop-only">AI Content Platform</span>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center space-x-2 sm:space-x-4">
        {status === 'loading' ? (
          // Skeleton loader for authentication state
          <div className="flex items-center space-x-2 sm:space-x-4">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-200 rounded-lg animate-pulse" />
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-200 rounded-lg animate-pulse" />
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-200 rounded-lg animate-pulse" />
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
              <div className="hidden md:block">
                <div className="w-24 h-4 bg-gray-200 rounded animate-pulse mb-1" />
                <div className="w-32 h-3 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          </div>
        ) : status === 'authenticated' && (
          <>
            {/* Messages */}
            <Link
              href="/dashboard/messages"
              className="relative p-2 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-lg transition-colors touch-target"
            >
              <MessageSquare size={20} />
              <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white" />
            </Link>

            {/* Notifications */}
            <Link
              href="/dashboard/notifications"
              className="relative p-2 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-lg transition-colors touch-target"
            >
              <Bell size={20} />
              <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white" />
            </Link>

            {/* Create Content Button */}
            <button
              onClick={handleCreateContent}
              className="p-2 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-lg transition-colors touch-target"
              title="Create new content"
            >
              <Plus size={20} />
            </button>

            {/* Profile Menu */}
            <div className="relative profile-menu" key={`profile-${session?.user?.name}-${session?.user?.image}`}>
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center space-x-2 sm:space-x-3 focus:outline-none touch-target p-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                  {session?.user?.image ? (
                    <img
                      src={session.user.image}
                      alt={session.user.name || 'User'}
                      className="w-8 h-8 rounded-full object-cover"
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

              {/* Profile Dropdown Menu */}
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 z-50">
                  {session?.user?.websiteUrl && (
                    <button
                      onClick={handleVisitSite}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Visit Site
                    </button>
                  )}
                  <button
                    onClick={handleSettings}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </header>
  )
}