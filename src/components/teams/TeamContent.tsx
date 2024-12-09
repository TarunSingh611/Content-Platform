'use client';
import { useState } from "react";

export default function TeamsContent({ initialTeams }: any) {
    const [teams, setTeams] = useState([
      {
        id: 1,
        name: 'Engineering',
        description: 'Product development team',
        members: [
          { id: 1, name: 'John Doe', role: 'Team Lead', avatar: 'https://placehold.co/32x32' },
          { id: 2, name: 'Jane Smith', role: 'Developer', avatar: 'https://placehold.co/32x32' }
        ]
      },
      {
        id: 2,
        name: 'Marketing',
        description: 'Brand and growth team',
        members: [
          { id: 3, name: 'Mike Johnson', role: 'Marketing Lead', avatar: 'https://placehold.co/32x32' }
        ]
      }
    ]);
    const [showNewTeamModal, setShowNewTeamModal] = useState<any>(false);
    const [showInviteModal, setShowInviteModal] = useState<any>(false);
    const [selectedTeam, setSelectedTeam] = useState<any>(null);
    const [loading, setLoading] = useState<any>(false);
  
    const handleCreateTeam = async (teamData:any) => {
      setLoading(true);
      try {
        // API call simulation
        const newTeam = {
          id: teams.length + 1,
          ...teamData,
          members: []
        };
        setTeams([...teams, newTeam]);
        setShowNewTeamModal(false);
      } catch (error) {
        console.error('Error creating team:', error);
      } finally {
        setLoading(false);
      }
    };
  
    const handleInviteMember = async (email:any, role:any, teamId:any) => {
      setLoading(true);
      try {
        // API call simulation
        const newMember = {
          id: Math.random(),
          name: email.split('@')[0],
          role: role,
          avatar: 'https://placehold.co/32x32'
        };
  
        setTeams(teams.map(team => 
          team.id === teamId 
            ? { ...team, members: [...team.members, newMember] }
            : team
        ));
        setShowInviteModal(false);
      } catch (error) {
        console.error('Error inviting member:', error);
      } finally {
        setLoading(false);
      }
    };
  
    const NewTeamModal = () => (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg max-w-md w-full p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Create New Team</h3>
            <button onClick={() => setShowNewTeamModal(false)} className="text-gray-400 hover:text-gray-500">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <form onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.target as HTMLFormElement);
            handleCreateTeam({
              name: formData.get('name'),
              description: formData.get('description')
            });
          }}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Team Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  name="description"
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowNewTeamModal(false)}
                className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create Team'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  
    const InviteMemberModal = () => (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg max-w-md w-full p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Invite Team Member</h3>
            <button onClick={() => setShowInviteModal(false)} className="text-gray-400 hover:text-gray-500">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <form onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.target as HTMLFormElement);
            handleInviteMember(
              formData.get('email'),
              formData.get('role'),
              selectedTeam.id
            );
          }}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Email Address</label>
                <input
                  type="email"
                  name="email"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Role</label>
                <select
                  name="role"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="Member">Member</option>
                  <option value="Admin">Admin</option>
                  <option value="Owner">Owner</option>
                </select>
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowInviteModal(false)}
                className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Sending...' : 'Send Invitation'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  
    return (
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Teams</h1>
          <button
            onClick={() => setShowNewTeamModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Create New Team
          </button>
        </div>
  
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams.map(team => (
            <div key={team.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{team.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">{team.description}</p>
                </div>
                <button className="text-gray-400 hover:text-gray-500">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                  </svg>
                </button>
              </div>
  
              <div className="mt-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-medium text-gray-700">Team Members</h4>
                  <button
                    onClick={() => {
                      setSelectedTeam(team);
                      setShowInviteModal(true);
                    }}
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    + Add Member
                  </button>
                </div>
                <div className="space-y-3">
                  {team.members.map(member => (
                    <div key={member.id} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <img
                          src={member.avatar}
                          alt={member.name}
                          className="w-8 h-8 rounded-full"
                        />
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">{member.name}</p>
                          <p className="text-xs text-gray-500">{member.role}</p>
                        </div>
                      </div>
                      <button className="text-gray-400 hover:text-gray-500">
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
  
        {showNewTeamModal && <NewTeamModal />}
        {showInviteModal && <InviteMemberModal />}
      </div>
    );
  }