'use client'

import { useState, useEffect } from 'react'
import { Users, UserPlus, Crown, Settings, MessageSquare } from 'lucide-react'

interface TeamActivity {
  id: string
  type: 'team_created' | 'member_joined' | 'member_left' | 'role_changed' | 'content_published'
  description: string
  userId?: string
  userName?: string
  teamId: string
  teamName: string
  timestamp: string
}

interface TeamActivityProps {
  teamId?: string
}

export default function TeamActivity({ teamId }: TeamActivityProps) {
  const [activities, setActivities] = useState<TeamActivity[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch real activity data
  const fetchActivities = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/teams/activity')
      if (response.ok) {
        const data = await response.json()
        const filteredActivities = teamId 
          ? data.activities.filter((activity: TeamActivity) => activity.teamId === teamId)
          : data.activities
        setActivities(filteredActivities)
      }
    } catch (error) {
      console.error('Error fetching team activities:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchActivities()
  }, [teamId])

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'team_created':
        return <Users className="w-4 h-4 text-blue-600" />
      case 'member_joined':
        return <UserPlus className="w-4 h-4 text-green-600" />
      case 'member_left':
        return <Users className="w-4 h-4 text-red-600" />
      case 'role_changed':
        return <Crown className="w-4 h-4 text-yellow-600" />
      case 'content_published':
        return <MessageSquare className="w-4 h-4 text-purple-600" />
      default:
        return <Settings className="w-4 h-4 text-gray-600" />
    }
  }

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'team_created':
        return 'bg-blue-50 border-blue-200'
      case 'member_joined':
        return 'bg-green-50 border-green-200'
      case 'member_left':
        return 'bg-red-50 border-red-200'
      case 'role_changed':
        return 'bg-yellow-50 border-yellow-200'
      case 'content_published':
        return 'bg-purple-50 border-purple-200'
      default:
        return 'bg-gray-50 border-gray-200'
    }
  }

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date()
    const activityTime = new Date(timestamp)
    const diffInHours = Math.floor((now.getTime() - activityTime.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) {
      return 'Just now'
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`
    } else {
      const diffInDays = Math.floor(diffInHours / 24)
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Recent Team Activity</h3>
        <div className="text-sm text-gray-500">
          {activities.length} activities
        </div>
      </div>

      {activities.length === 0 ? (
        <div className="text-center py-8">
          <Users className="mx-auto h-8 w-8 text-gray-400" />
          <p className="text-sm text-gray-500 mt-2">No recent activity</p>
        </div>
      ) : (
        <div className="space-y-4">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className={`flex items-center gap-3 p-3 rounded-lg border ${getActivityColor(activity.type)}`}
            >
              <div className="flex-shrink-0">
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">
                  <span className="font-semibold">{activity.userName}</span>{' '}
                  {activity.description}
                  {!teamId && (
                    <span className="text-gray-600"> in {activity.teamName}</span>
                  )}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {formatTimeAgo(activity.timestamp)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {activities.length > 0 && (
        <div className="mt-4 text-center">
          <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
            View all activities
          </button>
        </div>
      )}
    </div>
  )
}
