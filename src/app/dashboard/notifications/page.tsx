'use client'

import { useState, useEffect } from 'react'
import { Bell, Check, X, Eye, Heart, Share, MessageSquare, TrendingUp, Search, Filter, RefreshCw } from 'lucide-react'
import DemoRibbon from '@/components/ui/DemoRibbon'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface NotificationData {
  userId?: string;
  contentId?: string;
  teamId?: string;
  [key: string]: unknown;
}

interface Notification {
  id: string
  type: 'like' | 'comment' | 'share' | 'view' | 'system' | 'team' | 'content'
  title: string
  message: string
  createdAt: string
  isRead: boolean
  data?: NotificationData
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [stats, setStats] = useState({
    total: 0,
    unread: 0,
    read: 0
  })

  // Fetch notifications from API
  const fetchNotifications = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/notifications?filter=${filter}`)
      if (response.ok) {
        const data = await response.json()
        setNotifications(data.notifications || [])
        setStats({
          total: data.total || 0,
          unread: data.unreadCount || 0,
          read: (data.total || 0) - (data.unreadCount || 0)
        })
      }
    } catch (error) {
      console.error('Error fetching notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNotifications()
  }, [filter])

  const markAsRead = async (id: string) => {
    try {
      const response = await fetch(`/api/notifications/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isRead: true }),
      })

      if (response.ok) {
        setNotifications(prev =>
          prev.map(notification =>
            notification.id === id ? { ...notification, isRead: true } : notification
          )
        )
        // Update stats
        setStats(prev => ({
          ...prev,
          unread: prev.unread - 1,
          read: prev.read + 1
        }))
      }
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }

  const markAllAsRead = async () => {
    try {
      const response = await fetch('/api/notifications', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'markAllAsRead' }),
      })

      if (response.ok) {
        setNotifications(prev =>
          prev.map(notification => ({ ...notification, isRead: true }))
        )
        setStats(prev => ({
          ...prev,
          unread: 0,
          read: prev.total
        }))
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error)
    }
  }

  const deleteNotification = async (id: string) => {
    try {
      const response = await fetch(`/api/notifications/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        const deletedNotification = notifications.find(n => n.id === id)
        setNotifications(prev => prev.filter(notification => notification.id !== id))
        
        // Update stats
        if (deletedNotification && !deletedNotification.isRead) {
          setStats(prev => ({
            ...prev,
            total: prev.total - 1,
            unread: prev.unread - 1
          }))
        } else if (deletedNotification) {
          setStats(prev => ({
            ...prev,
            total: prev.total - 1,
            read: prev.read - 1
          }))
        }
      }
    } catch (error) {
      console.error('Error deleting notification:', error)
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'like':
        return <Heart className="w-5 h-5 text-red-500" />
      case 'comment':
        return <MessageSquare className="w-5 h-5 text-blue-500" />
      case 'share':
        return <Share className="w-5 h-5 text-green-500" />
      case 'view':
        return <Eye className="w-5 h-5 text-purple-500" />
      case 'system':
        return <TrendingUp className="w-5 h-5 text-indigo-500" />
      case 'team':
        return <Bell className="w-5 h-5 text-orange-500" />
      case 'content':
        return <MessageSquare className="w-5 h-5 text-teal-500" />
      default:
        return <Bell className="w-5 h-5 text-gray-500" />
    }
  }

  const formatTimeAgo = (dateString: string) => {
    const now = new Date()
    const date = new Date(dateString)
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) return 'Just now'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`
    return date.toLocaleDateString()
  }

  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  return (
    <div className="mobile-space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="mobile-heading font-bold text-gray-900">Notifications</h1>
          <p className="mobile-text text-gray-600 mt-1">Stay updated with your content performance and interactions</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={fetchNotifications}
            variant="outline"
            size="sm"
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <DemoRibbon message="Real-time Notifications - Coming Soon!" />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="mobile-grid gap-4">
        <div className="mobile-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="mobile-text-sm font-medium text-gray-600">Total Notifications</p>
              <p className="mobile-text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <Bell className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        
        <div className="mobile-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="mobile-text-sm font-medium text-gray-600">Unread</p>
              <p className="mobile-text-2xl font-bold text-gray-900">{stats.unread}</p>
            </div>
            <Eye className="h-8 w-8 text-orange-600" />
          </div>
        </div>
        
        <div className="mobile-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="mobile-text-sm font-medium text-gray-600">Read</p>
              <p className="mobile-text-2xl font-bold text-gray-900">{stats.read}</p>
            </div>
            <Check className="h-8 w-8 text-green-600" />
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="mobile-card">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <Input
              type="text"
              placeholder="Search notifications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="mobile-input pl-10"
            />
          </div>

          {/* Filter */}
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="text-sm border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="all">All ({stats.total})</option>
              <option value="unread">Unread ({stats.unread})</option>
              <option value="read">Read ({stats.read})</option>
            </select>
          </div>

          {/* Mark all as read */}
          {stats.unread > 0 && (
            <Button
              onClick={markAllAsRead}
              variant="outline"
              size="sm"
            >
              Mark all as read
            </Button>
          )}
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {filteredNotifications.length === 0 ? (
          <div className="p-8 text-center">
            <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications</h3>
            <p className="text-gray-500">
              {filter === 'unread' 
                ? 'You\'re all caught up! No unread notifications.'
                : searchTerm 
                ? 'No notifications match your search.'
                : 'No notifications to show.'
              }
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 hover:bg-gray-50 transition-colors ${
                  !notification.isRead ? 'bg-blue-50' : ''
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className={`text-sm font-medium ${
                          !notification.isRead ? 'text-gray-900' : 'text-gray-700'
                        }`}>
                          {notification.title}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-400 mt-2">
                          {formatTimeAgo(notification.createdAt)}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {!notification.isRead && (
                          <Button
                            onClick={() => markAsRead(notification.id)}
                            variant="ghost"
                            size="sm"
                            className="p-1 text-gray-400 hover:text-green-600"
                            title="Mark as read"
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                        )}
                        <Button
                          onClick={() => deleteNotification(notification.id)}
                          variant="ghost"
                          size="sm"
                          className="p-1 text-gray-400 hover:text-red-600"
                          title="Delete notification"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Notification Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <DemoRibbon message="Push Notifications - Coming Soon!" />
          <DemoRibbon message="Email Notifications - Coming Soon!" />
          <DemoRibbon message="Custom Alert Settings - Coming Soon!" />
          <DemoRibbon message="Notification Preferences - Coming Soon!" />
          <DemoRibbon message="Smart Notifications - Coming Soon!" />
          <DemoRibbon message="Notification History - Coming Soon!" />
        </div>
      </div>
    </div>
  )
}
