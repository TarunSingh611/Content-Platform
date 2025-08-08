'use client'

import { useState, useEffect } from 'react'
import { Plus, Users, Settings, MessageSquare, Crown, UserPlus, Trash2, Edit } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

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

interface TeamManagementProps {
  onTeamCreated?: (team: Team) => void
  onMemberInvited?: (teamId: string, member: TeamMember) => void
}

export default function TeamManagement({ onTeamCreated, onMemberInvited }: TeamManagementProps) {
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null)
  const [creating, setCreating] = useState(false)
  const [inviting, setInviting] = useState(false)

  // Fetch teams
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

  // Create team
  const handleCreateTeam = async (formData: FormData) => {
    try {
      setCreating(true)
      const name = formData.get('name') as string
      const description = formData.get('description') as string

      const response = await fetch('/api/teams', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, description }),
      })

      if (response.ok) {
        const data = await response.json()
        setTeams(prev => [data.team, ...prev])
        setShowCreateModal(false)
        onTeamCreated?.(data.team)
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to create team')
      }
    } catch (error) {
      console.error('Error creating team:', error)
      alert('Failed to create team')
    } finally {
      setCreating(false)
    }
  }

  // Invite member
  const handleInviteMember = async (formData: FormData) => {
    if (!selectedTeam) return

    try {
      setInviting(true)
      const email = formData.get('email') as string
      const role = formData.get('role') as string

      const response = await fetch(`/api/teams/${selectedTeam.id}/members`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, role }),
      })

      if (response.ok) {
        const data = await response.json()
        // Refresh teams to get updated member list
        await fetchTeams()
        setShowInviteModal(false)
        setSelectedTeam(null)
        onMemberInvited?.(selectedTeam.id, data)
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to invite member')
      }
    } catch (error) {
      console.error('Error inviting member:', error)
      alert('Failed to invite member')
    } finally {
      setInviting(false)
    }
  }

  // Get role badge color
  const getRoleColor = (role: string) => {
    switch (role) {
      case 'OWNER':
        return 'bg-yellow-100 text-yellow-800'
      case 'ADMIN':
        return 'bg-blue-100 text-blue-800'
      case 'MEMBER':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  // Get role icon
  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'OWNER':
        return <Crown className="w-3 h-3" />
      case 'ADMIN':
        return <Settings className="w-3 h-3" />
      default:
        return <Users className="w-3 h-3" />
    }
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
          <h2 className="text-2xl font-bold text-gray-900">Team Management</h2>
          <p className="text-gray-600 mt-1">Manage your teams and collaborate effectively</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Create Team
        </Button>
      </div>

      {/* Teams Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teams.map((team) => (
          <div key={team.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{team.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{team.description}</p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedTeam(team)
                    setShowInviteModal(true)
                  }}
                >
                  <UserPlus className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <MessageSquare className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Team Stats */}
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <p className="text-xs font-bold text-gray-900">{team.members.length}</p>
                <p className="text-xs text-gray-600">Members</p>
              </div>
              <div className="text-center">
                <p className="text-xs font-bold text-gray-900">
                  {team.members.filter(m => m.role === 'OWNER' || m.role === 'ADMIN').length}
                </p>
                <p className="text-xs text-gray-600">Admins</p>
              </div>
              <div className="text-center">
                <p className="text-xs font-bold text-gray-900">
                  {new Date(team.createdAt).toLocaleDateString()}
                </p>
                <p className="text-xs text-gray-600">Created</p>
              </div>
            </div>

            {/* Team Members */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-gray-700">Team Members</h4>
              <div className="space-y-2">
                {team.members.slice(0, 3).map((member) => (
                  <div key={member.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                        {member.user.image ? (
                          <img
                            src={member.user.image}
                            alt={member.user.name}
                            className="w-8 h-8 rounded-full"
                          />
                        ) : (
                          <span className="text-sm font-medium text-gray-600">
                            {member.user.name?.charAt(0) || 'U'}
                          </span>
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-1"><p className="text-sm font-medium text-gray-900">{member.user.name}</p><div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${getRoleColor(member.role)}`}> {getRoleIcon(member.role)} </div></div>
                        <p className="text-xs text-gray-500">{member.user.email}</p>
                      </div>
                    </div>
    
                  </div>
                ))}
                {team.members.length > 3 && (
                  <div className="text-center">
                    <p className="text-sm text-gray-500">+{team.members.length - 3} more members</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {teams.length === 0 && (
        <div className="text-center py-12">
          <Users className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No teams yet</h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by creating your first team.
          </p>
          <div className="mt-6">
            <Button onClick={() => setShowCreateModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Team
            </Button>
          </div>
        </div>
      )}

      {/* Create Team Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Create New Team</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowCreateModal(false)}
                >
                  ×
                </Button>
              </div>
              <form onSubmit={(e) => {
                e.preventDefault()
                handleCreateTeam(new FormData(e.currentTarget))
              }}>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="team-name" className="block text-sm font-medium text-gray-700">
                      Team Name
                    </label>
                    <Input
                      id="team-name"
                      name="name"
                      type="text"
                      required
                      placeholder="Enter team name"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label htmlFor="team-description" className="block text-sm font-medium text-gray-700">
                      Description
                    </label>
                    <textarea
                      id="team-description"
                      name="description"
                      rows={3}
                      required
                      placeholder="Describe your team's purpose"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowCreateModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={creating}>
                    {creating ? 'Creating...' : 'Create Team'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Invite Member Modal */}
      {showInviteModal && selectedTeam && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Invite Member to {selectedTeam.name}</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowInviteModal(false)
                    setSelectedTeam(null)
                  }}
                >
                  ×
                </Button>
              </div>
              <form onSubmit={(e) => {
                e.preventDefault()
                handleInviteMember(new FormData(e.currentTarget))
              }}>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="member-email" className="block text-sm font-medium text-gray-700">
                      Email Address
                    </label>
                    <Input
                      id="member-email"
                      name="email"
                      type="email"
                      required
                      placeholder="Enter email address"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label htmlFor="member-role" className="block text-sm font-medium text-gray-700">
                      Role
                    </label>
                    <select
                      id="member-role"
                      name="role"
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    >
                      <option value="MEMBER">Member</option>
                      <option value="ADMIN">Admin</option>
                      <option value="OWNER">Owner</option>
                    </select>
                  </div>
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowInviteModal(false)
                      setSelectedTeam(null)
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={inviting}>
                    {inviting ? 'Sending...' : 'Send Invitation'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
