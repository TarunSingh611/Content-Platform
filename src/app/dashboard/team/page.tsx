// src/app/dashboard/teams/page.tsx  
import { redirect } from 'next/navigation'  
import { getServerAuthSession } from '@/lib/auth-utils'  
import TeamsContent from '@/components/teams/TeamContent'  
import prisma from '@/lib/utils/db'
import DemoRibbon from '@/components/ui/DemoRibbon';
import { Users, UserPlus, Settings, MessageSquare, Calendar, TrendingUp, Shield, Crown } from 'lucide-react';

// Real team data
const realTeamData = [
  {
    id: '1',
    name: 'Content Creation Team',
    description: 'Focused on creating high-quality technical content and tutorials',
    members: [
      {
        id: '1',
        name: 'John Smith',
        email: 'john@example.com',
        role: 'Team Lead',
        avatar: '/avatars/john.jpg',
        status: 'online',
        lastActive: '2024-01-15T14:30:00Z',
        contributions: 45
      },
      {
        id: '2',
        name: 'Sarah Johnson',
        email: 'sarah@example.com',
        role: 'Content Writer',
        avatar: '/avatars/sarah.jpg',
        status: 'online',
        lastActive: '2024-01-15T15:20:00Z',
        contributions: 32
      },
      {
        id: '3',
        name: 'Mike Chen',
        email: 'mike@example.com',
        role: 'Technical Writer',
        avatar: '/avatars/mike.jpg',
        status: 'away',
        lastActive: '2024-01-15T12:45:00Z',
        contributions: 28
      },
      {
        id: '4',
        name: 'Emily Davis',
        email: 'emily@example.com',
        role: 'Editor',
        avatar: '/avatars/emily.jpg',
        status: 'offline',
        lastActive: '2024-01-14T18:30:00Z',
        contributions: 19
      }
    ],
    projects: 12,
    activeTasks: 8,
    completedTasks: 156,
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    name: 'Design & Development',
    description: 'Building and maintaining the platform infrastructure',
    members: [
      {
        id: '5',
        name: 'Alex Thompson',
        email: 'alex@example.com',
        role: 'Senior Developer',
        avatar: '/avatars/alex.jpg',
        status: 'online',
        lastActive: '2024-01-15T16:10:00Z',
        contributions: 67
      },
      {
        id: '6',
        name: 'David Wilson',
        email: 'david@example.com',
        role: 'UI/UX Designer',
        avatar: '/avatars/david.jpg',
        status: 'online',
        lastActive: '2024-01-15T15:45:00Z',
        contributions: 41
      },
      {
        id: '7',
        name: 'Lisa Brown',
        email: 'lisa@example.com',
        role: 'Frontend Developer',
        avatar: '/avatars/lisa.jpg',
        status: 'away',
        lastActive: '2024-01-15T13:20:00Z',
        contributions: 38
      }
    ],
    projects: 8,
    activeTasks: 5,
    completedTasks: 89,
    createdAt: '2024-01-05T00:00:00Z'
  },
  {
    id: '3',
    name: 'Marketing & Analytics',
    description: 'Driving growth and analyzing content performance',
    members: [
      {
        id: '8',
        name: 'Rachel Green',
        email: 'rachel@example.com',
        role: 'Marketing Manager',
        avatar: '/avatars/rachel.jpg',
        status: 'online',
        lastActive: '2024-01-15T16:30:00Z',
        contributions: 52
      },
      {
        id: '9',
        name: 'Tom Anderson',
        email: 'tom@example.com',
        role: 'Data Analyst',
        avatar: '/avatars/tom.jpg',
        status: 'offline',
        lastActive: '2024-01-15T10:15:00Z',
        contributions: 29
      }
    ],
    projects: 6,
    activeTasks: 3,
    completedTasks: 73,
    createdAt: '2024-01-10T00:00:00Z'
  }
];

export default async function TeamsPage() {  
  const session = await getServerAuthSession()  

  if (!session) {  
    redirect('/auth/signin')  
  }  

  // Use real data instead of fetching from database for demo
  const teams = realTeamData;

  const stats = {
    totalTeams: teams.length,
    totalMembers: teams.reduce((sum, team) => sum + team.members.length, 0),
    totalProjects: teams.reduce((sum, team) => sum + team.projects, 0),
    activeTasks: teams.reduce((sum, team) => sum + team.activeTasks, 0)
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Team Management</h1>
          <p className="text-gray-600 mt-1">Collaborate with your team members effectively</p>
        </div>
        <div className="flex items-center gap-3">
          <DemoRibbon message="Advanced Team Analytics - Coming Soon!" />
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center gap-2 transition-colors">
            <UserPlus className="h-4 w-4" />
            Invite Member
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Teams</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalTeams}</p>
            </div>
            <Users className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Team Members</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalMembers}</p>
            </div>
            <UserPlus className="h-8 w-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Projects</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalProjects}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-purple-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Tasks</p>
              <p className="text-2xl font-bold text-gray-900">{stats.activeTasks}</p>
            </div>
            <Calendar className="h-8 w-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Team Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {teams.map((team) => (
          <div key={team.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold">{team.name}</h3>
                <p className="text-sm text-gray-600">{team.description}</p>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 text-gray-400 hover:text-gray-600">
                  <Settings className="h-4 w-4" />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600">
                  <MessageSquare className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Members</span>
                <span className="font-medium">{team.members.length}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Projects</span>
                <span className="font-medium">{team.projects}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Active Tasks</span>
                <span className="font-medium">{team.activeTasks}</span>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-medium text-gray-600">Team Members</p>
              <div className="flex flex-wrap gap-2">
                {team.members.slice(0, 3).map((member) => (
                  <div key={member.id} className="flex items-center gap-2 bg-gray-50 px-2 py-1 rounded-full">
                    <div className={`w-2 h-2 rounded-full ${
                      member.status === 'online' ? 'bg-green-500' :
                      member.status === 'away' ? 'bg-yellow-500' : 'bg-gray-400'
                    }`}></div>
                    <span className="text-xs font-medium">{member.name}</span>
                    {member.role === 'Team Lead' && <Crown className="h-3 w-3 text-yellow-500" />}
                  </div>
                ))}
                {team.members.length > 3 && (
                  <div className="flex items-center gap-2 bg-gray-50 px-2 py-1 rounded-full">
                    <span className="text-xs font-medium">+{team.members.length - 3} more</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Team Activity */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Recent Team Activity</h3>
          <DemoRibbon message="Real-time Activity Feed - Coming Soon!" />
        </div>
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">JS</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">John Smith published "Golang vs Rust"</p>
              <p className="text-xs text-gray-500">2 hours ago</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
            <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">SJ</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">Sarah Johnson completed content review</p>
              <p className="text-xs text-gray-500">4 hours ago</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
            <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">MC</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">Mike Chen joined the team</p>
              <p className="text-xs text-gray-500">1 day ago</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
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

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Permissions</h3>
            <Shield className="h-5 w-5 text-gray-400" />
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

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Performance</h3>
            <TrendingUp className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Team Productivity</span>
              <span className="text-sm font-medium text-green-600">+15%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Content Quality</span>
              <span className="text-sm font-medium text-green-600">+8%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Collaboration Score</span>
              <span className="text-sm font-medium text-blue-600">92%</span>
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
  );
}  


