'use client';
import { useState } from "react";

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState('profile');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
  
    const [profileData, setProfileData] = useState({
      name: 'John Doe',
      email: 'john@example.com',
      avatar: 'https://placehold.co/100x100',
      bio: 'Full-stack developer',
      notifications: {
        email: true,
        push: false,
        marketing: true
      },
      theme: 'light'
    });
  
    const handleProfileUpdate = async (e:any) => {
      e.preventDefault();
      setLoading(true);
      try {
        const response = await fetch('/api/settings/profile', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(profileData)
        });
  
        if (!response.ok) throw new Error('Failed to update profile');
  
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } catch (error) {
        console.error('Error updating profile:', error);
      } finally {
        setLoading(false);
      }
    };
  
    const handleNotificationToggle = (key:any) => {
      setProfileData((prev:any) => ({
        ...prev,
        notifications: {
          ...prev.notifications,
          [key]: !prev.notifications[key]
        }
      }));
    };
  
    const handleThemeChange = (theme:any) => {
      setProfileData(prev => ({ ...prev, theme }));
      // Implement theme change logic here
    };
  
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Settings</h1>
        </div>
  
        <div className="bg-white rounded-lg shadow">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              {['profile', 'notifications', 'security', 'appearance'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-6 text-sm font-medium border-b-2 ${
                    activeTab === tab
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </nav>
          </div>
  
          <div className="p-6">
            {activeTab === 'profile' && (
              <form onSubmit={handleProfileUpdate} className="space-y-6">
                <div className="flex items-center space-x-6">
                  <div className="relative">
                    <img
                      src={profileData.avatar}
                      alt="Profile"
                      className="w-20 h-20 rounded-full"
                    />
                    <button
                      type="button"
                      className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow-lg"
                    >
                      <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">Profile Picture</h3>
                    <p className="text-sm text-gray-500">JPG, GIF or PNG. Max size of 800K</p>
                  </div>
                </div>
  
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
  
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Bio</label>
                    <textarea
                      value={profileData.bio}
                      onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                      rows={3}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>
  
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 
                      ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
  
                {success && (
                  <div className="mt-4 p-4 bg-green-50 text-green-800 rounded-md">
                    Profile updated successfully!
                  </div>
                )}
              </form>
            )}
  
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium">Notification Preferences</h3>
                <div className="space-y-4">
                  {Object.entries(profileData.notifications).map(([key, enabled]) => (
                    <div key={key} className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">
                          {key.charAt(0).toUpperCase() + key.slice(1)} Notifications
                        </h4>
                        <p className="text-sm text-gray-500">
                          Receive notifications via {key}
                        </p>
                      </div>
                      <button
                        onClick={() => handleNotificationToggle(key)}
                        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                          enabled ? 'bg-blue-600' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-5 w-5 transform rounded-full bg-white transition duration-200 ease-in-out ${
                            enabled ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
  
            {activeTab === 'security' && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium">Security Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Current Password</label>
                    <input
                      type="password"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">New Password</label>
                    <input
                      type="password"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                    <input
                      type="password"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                    Update Password
                  </button>
                </div>
              </div>
            )}
  
            {activeTab === 'appearance' && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium">Appearance Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Theme</label>
                    <div className="mt-2 space-x-4">
                      {['light', 'dark', 'system'].map((theme) => (
                        <button
                          key={theme}
                          onClick={() => handleThemeChange(theme)}
                          className={`px-4 py-2 rounded-md ${
                            profileData.theme === theme
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {theme.charAt(0).toUpperCase() + theme.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }