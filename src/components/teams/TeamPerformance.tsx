'use client'

import { useState, useEffect } from 'react'
import { TrendingUp, Users, Calendar, Target } from 'lucide-react'

interface TeamPerformance {
  teamId: string
  teamName: string
  productivity: number
  contentQuality: number
  collaborationScore: number
  memberCount: number
  activeMembers: number
  lastActivity: string
  totalContent: number
  totalViews: number
  totalLikes: number
  totalShares: number
  totalComments: number
}

interface TeamPerformanceProps {
  teamId?: string
}

export default function TeamPerformance({ teamId }: TeamPerformanceProps) {
  const [performance, setPerformance] = useState<TeamPerformance[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch real performance data
  const fetchPerformance = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/teams/performance')
      if (response.ok) {
        const data = await response.json()
        const filteredPerformance = teamId 
          ? data.performance.filter((p: TeamPerformance) => p.teamId === teamId)
          : data.performance
        setPerformance(filteredPerformance)
      }
    } catch (error) {
      console.error('Error fetching team performance:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPerformance()
  }, [teamId])

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600'
    if (score >= 80) return 'text-blue-600'
    if (score >= 70) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreBgColor = (score: number) => {
    if (score >= 90) return 'bg-green-100'
    if (score >= 80) return 'bg-blue-100'
    if (score >= 70) return 'bg-yellow-100'
    return 'bg-red-100'
  }

  const formatLastActivity = (timestamp: string) => {
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
        <h3 className="text-lg font-semibold">Team Performance</h3>
        <TrendingUp className="h-5 w-5 text-gray-400" />
      </div>

      {performance.length === 0 ? (
        <div className="text-center py-8">
          <Target className="mx-auto h-8 w-8 text-gray-400" />
          <p className="text-sm text-gray-500 mt-2">No performance data available</p>
        </div>
      ) : (
        <div className="space-y-4">
          {performance.map((team) => (
            <div key={team.teamId} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-900">{team.teamName}</h4>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Users className="w-4 h-4" />
                  <span>{team.activeMembers}/{team.memberCount} active</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full ${getScoreBgColor(team.productivity)}`}>
                    <span className={`text-lg font-bold ${getScoreColor(team.productivity)}`}>
                      {team.productivity}%
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">Productivity</p>
                </div>

                <div className="text-center">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full ${getScoreBgColor(team.contentQuality)}`}>
                    <span className={`text-lg font-bold ${getScoreColor(team.contentQuality)}`}>
                      {team.contentQuality}%
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">Content Quality</p>
                </div>

                <div className="text-center">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full ${getScoreBgColor(team.collaborationScore)}`}>
                    <span className={`text-lg font-bold ${getScoreColor(team.collaborationScore)}`}>
                      {team.collaborationScore}%
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">Collaboration</p>
                </div>
              </div>

              <div className="mt-3 text-xs text-gray-500">
                Last activity: {formatLastActivity(team.lastActivity)}
              </div>

              {/* Additional metrics */}
              <div className="mt-3 grid grid-cols-4 gap-2 text-xs">
                <div className="text-center">
                  <span className="font-medium">{team.totalContent}</span>
                  <p className="text-gray-500">Content</p>
                </div>
                <div className="text-center">
                  <span className="font-medium">{team.totalViews}</span>
                  <p className="text-gray-500">Views</p>
                </div>
                <div className="text-center">
                  <span className="font-medium">{team.totalLikes}</span>
                  <p className="text-gray-500">Likes</p>
                </div>
                <div className="text-center">
                  <span className="font-medium">{team.totalComments}</span>
                  <p className="text-gray-500">Comments</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {performance.length > 0 && (
        <div className="mt-4 text-center">
          <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
            View detailed analytics
          </button>
        </div>
      )}
    </div>
  )
}
