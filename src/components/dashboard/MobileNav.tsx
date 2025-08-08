'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  FileText, 
  BarChart2, 
  Settings, 
  Users, 
  Calendar, 
  MessageSquare, 
  Bell,
  Image,
  Plus
} from 'lucide-react'

const mobileMenuItems = [
  {
    title: 'Dashboard',
    icon: LayoutDashboard,
    path: '/dashboard',
  },
  {
    title: 'Content',
    icon: FileText,
    path: '/dashboard/content',
  },
  {
    title: 'Analytics',
    icon: BarChart2,
    path: '/dashboard/analytics',
  },
  {
    title: 'Media',
    icon: Image,
    path: '/dashboard/media',
  },
  {
    title: 'Team',
    icon: Users,
    path: '/dashboard/team',
  },
  {
    title: 'Calendar',
    icon: Calendar,
    path: '/dashboard/calendar',
  },
  {
    title: 'Messages',
    icon: MessageSquare,
    path: '/dashboard/messages',
  },
  {
    title: 'Notifications',
    icon: Bell,
    path: '/dashboard/notifications',
  },
  {
    title: 'Settings',
    icon: Settings,
    path: '/dashboard/settings',
  },
]

export default function MobileNav() {
  const pathname = usePathname()
  const [showMore, setShowMore] = useState(false)

  const mainItems = mobileMenuItems.slice(0, 4)
  const moreItems = mobileMenuItems.slice(4)

  return (
    <div className="mobile-nav">
      <div className="mobile-nav-items">
        {mainItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.path

          return (
            <Link
              key={item.path}
              href={item.path}
              className={`mobile-nav-item ${isActive ? 'text-indigo-600' : 'text-gray-600'}`}
            >
              <Icon size={20} />
              <span className="mobile-text-xs mt-1">{item.title}</span>
            </Link>
          )
        })}
        
        {/* More button */}
        <button
          onClick={() => setShowMore(!showMore)}
          className="mobile-nav-item text-gray-600"
        >
          <div className="relative">
            <div className="w-5 h-5 flex items-center justify-center">
              <div className="w-1 h-1 bg-gray-600 rounded-full mb-1"></div>
              <div className="w-1 h-1 bg-gray-600 rounded-full mb-1"></div>
              <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
            </div>
          </div>
          <span className="mobile-text-xs mt-1">More</span>
        </button>

        {/* Create Content Button */}
        <Link
          href="/dashboard/content/new"
          className="mobile-nav-item text-indigo-600"
        >
          <Plus size={20} />
          <span className="mobile-text-xs mt-1">Create</span>
        </Link>
      </div>

      {/* More Menu Overlay */}
      {showMore && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden" onClick={() => setShowMore(false)}>
          <div className="absolute bottom-20 left-4 right-4 bg-white rounded-lg shadow-lg p-4" onClick={(e) => e.stopPropagation()}>
            <div className="grid grid-cols-3 gap-4">
              {moreItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.path

                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    onClick={() => setShowMore(false)}
                    className={`flex flex-col items-center p-3 rounded-lg transition-colors ${
                      isActive ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon size={20} />
                    <span className="mobile-text-xs mt-1">{item.title}</span>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
