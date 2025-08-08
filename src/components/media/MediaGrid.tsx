'use client'

import { useState, useRef } from 'react'
import { Image, Video, FileText, MoreVertical, Edit, Trash2, Eye, Copy, Play, Pause, Volume2, VolumeX } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MediaFile } from '@/types/media'

interface MediaGridProps {
  media: MediaFile[]
  onDelete: (id: string) => void
  onEdit: (id: string, title: string) => void
}

export default function MediaGrid({ media, onDelete, onEdit }: MediaGridProps) {
  const [playingVideos, setPlayingVideos] = useState<Set<string>>(new Set())
  const [mutedVideos, setMutedVideos] = useState<Set<string>>(new Set())
  const videoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({})

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <Image className="w-4 h-4 sm:w-6 sm:h-6 text-blue-500" />
      case 'video':
        return <Video className="w-4 h-4 sm:w-6 sm:h-6 text-green-500" />
      case 'document':
        return <FileText className="w-4 h-4 sm:w-6 sm:h-6 text-gray-500" />
      default:
        return <FileText className="w-4 h-4 sm:w-6 sm:h-6 text-gray-500" />
    }
  }

  const copyToClipboard = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url)
      // You could add a toast notification here
    } catch (error) {
      console.error('Failed to copy URL:', error)
    }
  }

  const toggleVideoPlay = (videoId: string) => {
    const video = videoRefs.current[videoId]
    if (!video) return

    if (playingVideos.has(videoId)) {
      video.pause()
      setPlayingVideos(prev => {
        const newSet = new Set(prev)
        newSet.delete(videoId)
        return newSet
      })
    } else {
      // Pause all other videos first
      playingVideos.forEach(id => {
        const otherVideo = videoRefs.current[id]
        if (otherVideo) otherVideo.pause()
      })
      
      video.play()
      setPlayingVideos(new Set([videoId]))
    }
  }

  const toggleVideoMute = (videoId: string) => {
    const video = videoRefs.current[videoId]
    if (!video) return

    video.muted = !video.muted
    setMutedVideos(prev => {
      const newSet = new Set(prev)
      if (video.muted) {
        newSet.add(videoId)
      } else {
        newSet.delete(videoId)
      }
      return newSet
    })
  }

  const handleVideoEnded = (videoId: string) => {
    setPlayingVideos(prev => {
      const newSet = new Set(prev)
      newSet.delete(videoId)
      return newSet
    })
  }

  if (media.length === 0) {
    return (
      <div className="text-center py-12 px-4">
        <FileText className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No media files</h3>
        <p className="mt-1 text-sm text-gray-500">
          Get started by uploading your first media file.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {media.map((file) => (
        <div
          key={file.id}
          className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
        >
          {/* Media Preview */}
          <div className="relative aspect-square bg-gray-100">
            {file.type === 'image' ? (
              <img
                src={file.thumbnail || file.url}
                alt={file.title}
                className="w-full h-full object-cover"
              />
            ) : file.type === 'video' ? (
              <div className="w-full h-full relative group">
                {file.thumbnail ? (
                  <img
                    src={file.thumbnail}
                    alt={file.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <Video className="w-12 h-12 text-gray-400" />
                  </div>
                )}
                
                {/* Video Player */}
                <video
                  ref={(el) => { videoRefs.current[file.id] = el }}
                  src={file.url}
                  className="absolute inset-0 w-full h-full object-cover"
                  muted={mutedVideos.has(file.id)}
                  onEnded={() => handleVideoEnded(file.id)}
                  playsInline
                  loop
                />
                
                {/* Video Controls Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => toggleVideoPlay(file.id)}
                      className="bg-white text-gray-900 hover:bg-gray-100 h-8 w-8 p-0 rounded-full"
                    >
                      {playingVideos.has(file.id) ? (
                        <Pause className="w-4 h-4" />
                      ) : (
                        <Play className="w-4 h-4" />
                      )}
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => toggleVideoMute(file.id)}
                      className="bg-white text-gray-900 hover:bg-gray-100 h-8 w-8 p-0 rounded-full"
                    >
                      {mutedVideos.has(file.id) ? (
                        <VolumeX className="w-4 h-4" />
                      ) : (
                        <Volume2 className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <FileText className="w-12 h-12 text-gray-400" />
              </div>
            )}
          </div>

          {/* Media Info */}
          <div className="p-3 sm:p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-2">
                  {getFileIcon(file.type)}
                  <h3 className="text-sm font-medium text-gray-900 truncate">
                    {file.title}
                  </h3>
                </div>
                <p className="text-xs text-gray-500">
                  {formatFileSize(file.size)} • {file.format}
                </p>
                {file.width && file.height && (
                  <p className="text-xs text-gray-500">
                    {file.width} × {file.height}
                  </p>
                )}
                <p className="text-xs text-gray-500">
                  {new Date(file.createdAt).toLocaleDateString()}
                </p>
              </div>

              {/* Actions Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => copyToClipboard(file.url)}>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy URL
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onEdit(file.id, file.title)}>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => onDelete(file.id)}
                    className="text-red-600"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}  