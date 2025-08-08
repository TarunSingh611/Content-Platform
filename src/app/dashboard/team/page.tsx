'use client'

import { useState, useEffect } from 'react'
import { Users, UserPlus, TrendingUp, Calendar } from 'lucide-react'
import TeamManagement from '@/components/teams/TeamManagement'
import TeamActivity from '@/components/teams/TeamActivity'
import TeamPerformance from '@/components/teams/TeamPerformance'
import DemoRibbon from '@/components/ui/DemoRibbon'

interface TeamMember {
  id: string
  user: {
    id: string
    name: string
    email: string
    image?: string
  }
  role: 'OWNER' | 'ADMIN' | 'MEMBER'
  joinedAt: string
}

interface Team {
  id: string
  name: string
  description: string
  createdAt: string
  updatedAt: string
  members: TeamMember[]
}

export default function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch teams for stats
  const fetchTeams = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/teams')
      if (response.ok) {
        const data = await response.json()
        setTeams(data.teams || [])
      }
    } catch (error) {
      console.error('Error fetching teams:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTeams()
  }, [])

  // Calculate stats
  const stats = {
    totalTeams: teams.length,
    totalMembers: teams.reduce((sum, team) => sum + team.members.length, 0),
    totalAdmins: teams.reduce((sum, team) => 
      sum + team.members.filter((m: TeamMember) => m.role === 'OWNER' || m.role === 'ADMIN').length, 0
    ),
    activeTeams: teams.filter(team => team.members.length > 1).length
  }

  // Handle team created
  const handleTeamCreated = (newTeam: Team) => {
    setTeams(prev => [newTeam, ...prev])
  }

  // Handle member invited
  const handleMemberInvited = (teamId: string, member: TeamMember) => {
    setTeams(prev => prev.map(team => 
      team.id === teamId 
        ? { ...team, members: [...team.members, member] }
        : team
    ))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Team Management</h1>
          <p className="text-gray-600 mt-1">Collaborate with your team members effectively</p>
        </div>
        <div className="flex items-center gap-3">
          <DemoRibbon message="Advanced Team Analytics - Coming Soon!" />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Teams</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalTeams}</p>
            </div>
            <Users className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Team Members</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalMembers}</p>
            </div>
            <UserPlus className="h-8 w-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Team Admins</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalAdmins}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-purple-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Teams</p>
              <p className="text-2xl font-bold text-gray-900">{stats.activeTeams}</p>
            </div>
            <Calendar className="h-8 w-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Team Management Component */}
      <TeamManagement 
        onTeamCreated={handleTeamCreated}
        onMemberInvited={handleMemberInvited}
      />

      {/* Team Performance and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TeamPerformance />
        <TeamActivity />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Team Actions</h3>
            <Users className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
              Create New Team
            </button>
            <button className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors">
              Invite Members
            </button>
            <button className="w-full bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors">
              Schedule Meeting
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Permissions</h3>
            <div className="h-5 w-5 text-gray-400">🛡️</div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Admin Access</span>
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Active</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Content Management</span>
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Active</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Analytics Access</span>
              <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">Limited</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Team Overview</h3>
            <TrendingUp className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Total Teams</span>
              <span className="text-sm font-medium text-blue-600">{stats.totalTeams}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Total Members</span>
              <span className="text-sm font-medium text-green-600">{stats.totalMembers}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Active Teams</span>
              <span className="text-sm font-medium text-purple-600">{stats.activeTeams}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Features */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Upcoming Team Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <DemoRibbon message="Real-time Chat - Coming Soon!" />
          <DemoRibbon message="Video Meetings - Coming Soon!" />
          <DemoRibbon message="Task Management - Coming Soon!" />
          <DemoRibbon message="Team Analytics - Coming Soon!" />
          <DemoRibbon message="File Sharing - Coming Soon!" />
          <DemoRibbon message="Time Tracking - Coming Soon!" />
        </div>
      </div>
    </div>
  )
}  


