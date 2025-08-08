'use client'

import { useState, useEffect, useRef } from "react"
import { useSession } from "next-auth/react"
import { 
  User, 
  Shield, 
  Bell,
  Globe,
  Camera,
  Check,
  AlertCircle,
  Eye,
  EyeOff,
  Trash2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface ProfileData {
  name: string
  email: string
  bio: string
  websiteUrl: string
  image: string
}

interface PasswordData {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

interface NotificationPreferences {
  email: boolean
  push: boolean
  marketing: boolean
  content: boolean
  team: boolean
  system: boolean
}

export default function SettingsPage() {
  const { data: session, update } = useSession()
  const [activeTab, setActiveTab] = useState('profile')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [imageUploading, setImageUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  })

  const [profileData, setProfileData] = useState<ProfileData>({
    name: '',
    email: '',
    bio: '',
    websiteUrl: '',
    image: ''
  })

  const [passwordData, setPasswordData] = useState<PasswordData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const [notificationPreferences, setNotificationPreferences] = useState<NotificationPreferences>({
    email: true,
    push: false,
    marketing: true,
    content: true,
    team: true,
    system: true
  })

  // Fetch profile data on component mount
  useEffect(() => {
    fetchProfileData()
  }, [])

  const fetchProfileData = async () => {
    try {
      const response = await fetch('/api/settings/profile')
      if (response.ok) {
        const data = await response.json()
        setProfileData({
          name: data.profile.name || '',
          email: data.profile.email || '',
          bio: data.profile.bio || '',
          websiteUrl: data.profile.websiteUrl || '',
          image: data.profile.image || ''
        })
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
    }
  }

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess(false)

    try {
      const response = await fetch('/api/settings/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update profile')
      }

      // Update session with new data using NextAuth's update method
      await update({
        user: {
          name: profileData.name,
          bio: profileData.bio,
          websiteUrl: profileData.websiteUrl,
          image: profileData.image
        }
      })

      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (error) {
      console.error('Error updating profile:', error)
      setError(error instanceof Error ? error.message : 'Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess(false)

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match')
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/settings/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update password')
      }

      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })

      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (error) {
      console.error('Error updating password:', error)
      setError(error instanceof Error ? error.message : 'Failed to update password')
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = async (file: File) => {
    setImageUploading(true)
    setError('')

    try {
      const formData = new FormData()
      formData.append('image', file)

      const response = await fetch('/api/settings/upload-image', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to upload image')
      }

      setProfileData(prev => ({ ...prev, image: data.imageUrl }))
      
      // Update session with new image
      await update({
        user: {
          image: data.imageUrl
        }
      })

      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (error) {
      console.error('Error uploading image:', error)
      setError(error instanceof Error ? error.message : 'Failed to upload image')
    } finally {
      setImageUploading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleImageUpload(file)
    }
  }

  const removeProfileImage = async () => {
    setProfileData(prev => ({ ...prev, image: '' }))
    
    // Update session to remove image
    await update({
      user: {
        image: null
      }
    })
  }

  const handleNotificationToggle = (key: keyof NotificationPreferences) => {
    setNotificationPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  const handleWebsiteUrlChange = (url: string) => {
    if (!url.startsWith('http://') && !url.startsWith('https://') && url !== '') {
      url = 'https://' + url
    }
    setProfileData(prev => ({ ...prev, websiteUrl: url }))
  }

  const togglePasswordVisibility = (field: keyof typeof showPassword) => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field]
    }))
  }

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield }
  ]

  return (
    <div className="mobile-space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <h1 className="mobile-heading font-bold text-gray-900">Settings</h1>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="mobile-card bg-green-50 border-green-200">
          <div className="flex items-center space-x-2">
            <Check className="h-5 w-5 text-green-600" />
            <span className="mobile-text-sm text-green-800">Settings updated successfully!</span>
          </div>
        </div>
      )}

      {error && (
        <div className="mobile-card bg-red-50 border-red-200">
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <span className="mobile-text-sm text-red-800">{error}</span>
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="mobile-card">
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`mobile-nav-item ${
                  activeTab === tab.id
                    ? 'bg-indigo-50 text-indigo-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Icon size={20} />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="mobile-card">
        {activeTab === 'profile' && (
          <div className="mobile-space-y-6">
            <h2 className="mobile-text-xl font-semibold">Profile Information</h2>
            
            {/* Profile Picture */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
              <div className="relative">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                  {profileData.image ? (
                    <img
                      src={profileData.image}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400" />
                  )}
                </div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute -bottom-1 -right-1 bg-indigo-600 text-white rounded-full p-2 hover:bg-indigo-700 transition-colors touch-target"
                  disabled={imageUploading}
                >
                  <Camera className="w-4 h-4" />
                </button>
                {profileData.image && (
                  <button
                    onClick={removeProfileImage}
                    className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full p-1 hover:bg-red-700 transition-colors touch-target"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>
              
              <div className="flex flex-col space-y-2">
                <p className="mobile-text-sm text-gray-600">
                  Upload a profile picture to personalize your account
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                {imageUploading && (
                  <p className="mobile-text-sm text-indigo-600">Uploading...</p>
                )}
              </div>
            </div>

            {/* Profile Form */}
            <form onSubmit={handleProfileUpdate} className="mobile-space-y-4">
              <div className="mobile-form-group">
                <label className="mobile-label">Name</label>
                <Input
                  type="text"
                  value={profileData.name}
                  onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter your name"
                />
              </div>

              <div className="mobile-form-group">
                <label className="mobile-label">Email</label>
                <Input
                  type="email"
                  value={profileData.email}
                  disabled
                  className="bg-gray-50"
                />
                <p className="mobile-text-xs text-gray-500 mt-1">Email cannot be changed</p>
              </div>

              <div className="mobile-form-group">
                <label className="mobile-label">Website URL</label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    type="url"
                    value={profileData.websiteUrl}
                    onChange={(e) => handleWebsiteUrlChange(e.target.value)}
                    placeholder="https://yourwebsite.com"
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="mobile-form-group">
                <label className="mobile-label">Bio</label>
                <textarea
                  value={profileData.bio}
                  onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                  placeholder="Tell us about yourself..."
                  rows={4}
                  className="mobile-input"
                />
              </div>

              <Button type="submit" disabled={loading} className="w-full sm:w-auto">
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
            </form>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="mobile-space-y-6">
            <h2 className="mobile-text-xl font-semibold">Notification Preferences</h2>
            
            <div className="mobile-space-y-4">
              {Object.entries(notificationPreferences).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-gray-900 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      Receive notifications for {key} activities
                    </p>
                  </div>
                  <button
                    onClick={() => handleNotificationToggle(key as keyof NotificationPreferences)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                      value ? 'bg-indigo-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200 ease-in-out ${
                        value ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="mobile-space-y-6">
            <h2 className="mobile-text-xl font-semibold">Security Settings</h2>
            
            <form onSubmit={handlePasswordUpdate} className="mobile-space-y-4">
              <div className="mobile-form-group">
                <label className="mobile-label">Current Password</label>
                <div className="relative">
                  <Input
                    type={showPassword.current ? 'text' : 'password'}
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                    placeholder="Enter current password"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('current')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 touch-target"
                  >
                    {showPassword.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="mobile-form-group">
                <label className="mobile-label">New Password</label>
                <div className="relative">
                  <Input
                    type={showPassword.new ? 'text' : 'password'}
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('new')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 touch-target"
                  >
                    {showPassword.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="mobile-form-group">
                <label className="mobile-label">Confirm New Password</label>
                <div className="relative">
                  <Input
                    type={showPassword.confirm ? 'text' : 'password'}
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    placeholder="Confirm new password"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('confirm')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 touch-target"
                  >
                    {showPassword.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button type="submit" disabled={loading} className="w-full sm:w-auto">
                {loading ? 'Updating...' : 'Update Password'}
              </Button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}