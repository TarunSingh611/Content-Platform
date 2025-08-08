'use client'

import { useState, useEffect } from 'react'
import { Plus, Upload, Image, Video, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import MediaUpload from '@/components/media/MediaUpload'
import MediaGrid from '@/components/media/MediaGrid'
import MediaFilters from '@/components/media/MediaFilters'
import { MediaFile } from '@/types/media'

export default function MediaPage() {
  const [media, setMedia] = useState<MediaFile[]>([])
  const [filteredMedia, setFilteredMedia] = useState<MediaFile[]>([])
  const [loading, setLoading] = useState(true)
  const [showUpload, setShowUpload] = useState(false)
  const [filters, setFilters] = useState({
    type: 'all',
    search: '',
    view: 'grid' as 'grid' | 'list'
  })
  const [editingMedia, setEditingMedia] = useState<{ id: string; title: string } | null>(null)

  // Fetch media files
  const fetchMedia = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/media')
      if (response.ok) {
        const data = await response.json()
        setMedia(data.media || [])
      }
    } catch (error) {
      console.error('Error fetching media:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMedia()
  }, [])

  // Filter media based on current filters
  useEffect(() => {
    let filtered = media

    // Filter by type
    if (filters.type !== 'all') {
      filtered = filtered.filter(file => file.type === filters.type)
    }

    // Filter by search
    if (filters.search) {
      filtered = filtered.filter(file =>
        file.title.toLowerCase().includes(filters.search.toLowerCase())
      )
    }

    setFilteredMedia(filtered)
  }, [media, filters])

  // Handle upload success
  const handleUploadSuccess = (newMedia: MediaFile) => {
    setMedia(prev => [newMedia, ...prev])
    setShowUpload(false)
  }

  // Handle upload error
  const handleUploadError = (error: string) => {
    console.error('Upload error:', error)
    // You could add a toast notification here
  }

  // Handle media deletion
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this media file?')) {
      return
    }

    try {
      const response = await fetch(`/api/media/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setMedia(prev => prev.filter(file => file.id !== id))
      } else {
        console.error('Failed to delete media')
      }
    } catch (error) {
      console.error('Error deleting media:', error)
    }
  }

  // Handle media edit
  const handleEdit = async (id: string, title: string) => {
    try {
      const response = await fetch(`/api/media/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title }),
      })

      if (response.ok) {
        setMedia(prev =>
          prev.map(file =>
            file.id === id ? { ...file, title } : file
          )
        )
      } else {
        console.error('Failed to update media')
      }
    } catch (error) {
      console.error('Error updating media:', error)
    }
  }

  // Get media statistics
  const getMediaStats = () => {
    const images = media.filter(file => file.type === 'image').length
    const videos = media.filter(file => file.type === 'video').length
    const documents = media.filter(file => file.type === 'document').length
    const totalSize = media.reduce((sum, file) => sum + file.size, 0)

    return { images, videos, documents, totalSize }
  }

  const stats = getMediaStats()

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

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
          <h1 className="mobile-heading font-bold text-gray-900">Media Library</h1>
          <p className="mobile-text text-gray-600 mt-1">Manage your images, videos, and documents</p>
        </div>
        <Button onClick={() => setShowUpload(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Upload Media
        </Button>
      </div>

      {/* Stats */}
      <div className="mobile-grid gap-4">
        <div className="mobile-card">
          <div className="flex items-center">
            <Image className="w-8 h-8 text-blue-500" />
            <div className="ml-3">
              <p className="mobile-text-sm font-medium text-gray-600">Images</p>
              <p className="mobile-text-2xl font-bold text-gray-900">{stats.images}</p>
            </div>
          </div>
        </div>
        <div className="mobile-card">
          <div className="flex items-center">
            <Video className="w-8 h-8 text-green-500" />
            <div className="ml-3">
              <p className="mobile-text-sm font-medium text-gray-600">Videos</p>
              <p className="mobile-text-2xl font-bold text-gray-900">{stats.videos}</p>
            </div>
          </div>
        </div>
        <div className="mobile-card">
          <div className="flex items-center">
            <FileText className="w-8 h-8 text-gray-500" />
            <div className="ml-3">
              <p className="mobile-text-sm font-medium text-gray-600">Documents</p>
              <p className="mobile-text-2xl font-bold text-gray-900">{stats.documents}</p>
            </div>
          </div>
        </div>
        <div className="mobile-card">
          <div className="flex items-center">
            <Upload className="w-8 h-8 text-purple-500" />
            <div className="ml-3">
              <p className="mobile-text-sm font-medium text-gray-600">Total Size</p>
              <p className="mobile-text-2xl font-bold text-gray-900">{formatFileSize(stats.totalSize)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <MediaFilters
        onFilterChange={setFilters}
        totalFiles={filteredMedia.length}
      />

      {/* Media Grid */}
      <MediaGrid
        media={filteredMedia}
        onDelete={handleDelete}
        onEdit={handleEdit}
      />

      {/* Upload Modal */}
      {showUpload && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Upload Media</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowUpload(false)}
                >
                  ×
                </Button>
              </div>
              <MediaUpload
                onUploadSuccess={handleUploadSuccess}
                onUploadError={handleUploadError}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}  