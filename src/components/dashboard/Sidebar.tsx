// src/components/dashboard/Sidebar.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import NextImage from 'next/image'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
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
  ChevronLeft,
  ChevronRight,
  Plus,
} from 'lucide-react'

const menuItems = [
  {
    title: 'Dashboard',
    icon: LayoutDashboard,
    path: '/dashboard',
    badge: null,
  },
  {
    title: 'Content',
    icon: FileText,
    path: '/dashboard/content',
    badge: null,
  },
  {
    title: 'Analytics',
    icon: BarChart2,
    path: '/dashboard/analytics',
    badge: null,
  },
  {
    title: 'Media',
    icon: Image,
    path: '/dashboard/media',
    badge: null,
  },
  {
    title: 'Team',
    icon: Users,
    path: '/dashboard/team',
    badge: null,
  },
  {
    title: 'Calendar',
    icon: Calendar,
    path: '/dashboard/calendar',
    badge: null,
  },
  {
    title: 'Messages',
    icon: MessageSquare,
    path: '/dashboard/messages',
    badge: null,
  },
  {
    title: 'Notifications',
    icon: Bell,
    path: '/dashboard/notifications',
    badge: null,
  },
  {
    title: 'Settings',
    icon: Settings,
    path: '/dashboard/settings',
    badge: null,
  },
]

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const pathname = usePathname()

  return (
    <div
      className={`hidden lg:block sticky top-0 h-screen bg-white border-r border-gray-200 transition-all duration-300 ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      <div className="flex flex-col h-full">
        {/* Logo Section */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
          {!isCollapsed && (
            <Link href="/dashboard" className="flex items-center space-x-3">
              <NextImage src="/logo.svg" alt="AI Content Platform" width={32} height={32} className="w-8 h-8" />
              <span className="text-xl font-semibold text-gray-900">AI CMS</span>
            </Link>
          )}
          {isCollapsed && (
            <Link href="/dashboard" className="flex items-center justify-center">
              <NextImage src="/logo.svg" alt="AI Content Platform" width={32} height={32} className="w-8 h-8" />
            </Link>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-3">
            {menuItems.map((item) => {
              const isActive = pathname === item.path
              const Icon = item.icon

              return (
                <li key={item.path}>
                  <Link
                    href={item.path}
                    className={`flex items-center px-3 py-2 rounded-lg transition-colors ${
                      isCollapsed ? 'justify-center' : 'justify-start'
                    } ${
                      isActive
                        ? 'bg-indigo-50 text-indigo-600'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon size={20} className="flex-shrink-0" />
                    {!isCollapsed && (
                      <span className="ml-3 text-sm font-medium">{item.title}</span>
                    )}
                    {!isCollapsed && item.badge && (
                      <span className="ml-auto bg-indigo-100 text-indigo-600 px-2 py-1 rounded-full text-xs">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* New Content Button */}
        <div className="px-3 py-4 border-t border-gray-200">
          <Link
            href="/dashboard/content/new"
            className={`flex items-center px-3 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors ${
              isCollapsed ? 'justify-center' : 'justify-start'
            }`}
          >
            <Plus size={20} className="flex-shrink-0" />
            {!isCollapsed && (
              <span className="ml-3 text-sm font-medium">New Content</span>
            )}
          </Link>
        </div>
      </div>
    </div>
  )
}