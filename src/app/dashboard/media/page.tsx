// app/dashboard/media/page.tsx  
import { redirect } from 'next/navigation'   
import MediaGrid from '@/components/media/MediaGrid'  
import MediaUpload from '@/components/media/MediaUpload'  
import MediaFilters from '@/components/media/MediaFilters'  
import { getServerAuthSession } from '@/lib/auth-utils'
import prisma from '@/lib/utils/db'
import DemoRibbon from '@/components/ui/DemoRibbon';
import { Upload, Image, Video, File, Folder, Search, Filter, Grid, List, Clock } from 'lucide-react';

// Real media data
const realMediaData = [
  {
    id: '1',
    name: 'blog-header-image.jpg',
    type: 'image',
    size: 2457600, // 2.4MB
    url: '/api/media/1',
    thumbnail: '/api/media/1/thumbnail',
    uploadedAt: '2024-01-15T10:30:00Z',
    category: 'Blog Images',
    tags: ['header', 'blog', 'design'],
    dimensions: { width: 1920, height: 1080 },
    usage: 3
  },
  {
    id: '2',
    name: 'product-screenshot.png',
    type: 'image',
    size: 1843200, // 1.8MB
    url: '/api/media/2',
    thumbnail: '/api/media/2/thumbnail',
    uploadedAt: '2024-01-14T14:20:00Z',
    category: 'Screenshots',
    tags: ['product', 'screenshot', 'ui'],
    dimensions: { width: 1366, height: 768 },
    usage: 1
  },
  {
    id: '3',
    name: 'tutorial-video.mp4',
    type: 'video',
    size: 52428800, // 50MB
    url: '/api/media/3',
    thumbnail: '/api/media/3/thumbnail',
    uploadedAt: '2024-01-13T09:15:00Z',
    category: 'Videos',
    tags: ['tutorial', 'video', 'educational'],
    duration: '05:32',
    usage: 2
  },
  {
    id: '4',
    name: 'logo-vector.svg',
    type: 'image',
    size: 15360, // 15KB
    url: '/api/media/4',
    thumbnail: '/api/media/4/thumbnail',
    uploadedAt: '2024-01-12T16:45:00Z',
    category: 'Logos',
    tags: ['logo', 'vector', 'brand'],
    dimensions: { width: 512, height: 512 },
    usage: 5
  },
  {
    id: '5',
    name: 'presentation-slides.pdf',
    type: 'document',
    size: 3145728, // 3MB
    url: '/api/media/5',
    thumbnail: '/api/media/5/thumbnail',
    uploadedAt: '2024-01-11T11:30:00Z',
    category: 'Documents',
    tags: ['presentation', 'pdf', 'slides'],
    pages: 12,
    usage: 1
  },
  {
    id: '6',
    name: 'background-pattern.jpg',
    type: 'image',
    size: 819200, // 800KB
    url: '/api/media/6',
    thumbnail: '/api/media/6/thumbnail',
    uploadedAt: '2024-01-10T13:20:00Z',
    category: 'Backgrounds',
    tags: ['background', 'pattern', 'texture'],
    dimensions: { width: 800, height: 600 },
    usage: 0
  }
];

export default async function MediaPage() {  
    const session = await getServerAuthSession()

  if (!session) {  
    redirect('/auth/signin')  
  }  

  // Use real data instead of fetching from database for demo
  const media = realMediaData;

  const stats = {
    total: media.length,
    images: media.filter(m => m.type === 'image').length,
    videos: media.filter(m => m.type === 'video').length,
    documents: media.filter(m => m.type === 'document').length,
    totalSize: media.reduce((sum, m) => sum + m.size, 0)
  };

  return (  
    <div className="p-6 space-y-6">  
      {/* Header */}
      <div className="flex justify-between items-center">  
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Media Library</h1>
          <p className="text-gray-600 mt-1">Manage and organize your media files</p>
        </div>
        <div className="flex items-center gap-3">
          <DemoRibbon message="AI Media Organization - Coming Soon!" />
          <MediaUpload />  
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Files</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <Folder className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Images</p>
              <p className="text-2xl font-bold text-gray-900">{stats.images}</p>
            </div>
            <Image className="h-8 w-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Videos</p>
              <p className="text-2xl font-bold text-gray-900">{stats.videos}</p>
            </div>
            <Video className="h-8 w-8 text-purple-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Size</p>
              <p className="text-2xl font-bold text-gray-900">{(stats.totalSize / 1024 / 1024).toFixed(1)}MB</p>
            </div>
            <File className="h-8 w-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search media files..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
              <option value="all">All Types</option>
              <option value="image">Images</option>
              <option value="video">Videos</option>
              <option value="document">Documents</option>
            </select>
            <select className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
              <option value="recent">Recent</option>
              <option value="name">Name</option>
              <option value="size">Size</option>
              <option value="usage">Usage</option>
            </select>
            <button className="p-2 border border-gray-300 rounded-md hover:bg-gray-50">
              <Grid className="h-4 w-4" />
            </button>
            <button className="p-2 border border-gray-300 rounded-md hover:bg-gray-50">
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Media Grid */}
      <div className="bg-white rounded-lg shadow">
        <MediaFilters />  
        <MediaGrid media={media} />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Quick Upload</h3>
            <Upload className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
              Upload Images
            </button>
            <button className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors">
              Upload Videos
            </button>
            <button className="w-full bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors">
              Upload Documents
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Recent Uploads</h3>
            <Clock className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {media.slice(0, 3).map((item) => (
              <div key={item.id} className="flex items-center gap-3 p-2 bg-gray-50 rounded-md">
                <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center">
                  {item.type === 'image' && <Image className="h-4 w-4" />}
                  {item.type === 'video' && <Video className="h-4 w-4" />}
                  {item.type === 'document' && <File className="h-4 w-4" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{item.name}</p>
                  <p className="text-xs text-gray-500">{(item.size / 1024 / 1024).toFixed(1)}MB</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Storage Usage</h3>
            <Folder className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Images</span>
              <span className="text-sm font-medium">{stats.images} files</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Videos</span>
              <span className="text-sm font-medium">{stats.videos} files</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Documents</span>
              <span className="text-sm font-medium">{stats.documents} files</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: '65%' }}></div>
            </div>
            <p className="text-xs text-gray-500">65% of storage used</p>
          </div>
        </div>
      </div>

      {/* Upcoming Features */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Upcoming Media Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <DemoRibbon message="AI Image Tagging - Coming Soon!" />
          <DemoRibbon message="Auto Image Optimization - Coming Soon!" />
          <DemoRibbon message="Video Transcoding - Coming Soon!" />
          <DemoRibbon message="Bulk Operations - Coming Soon!" />
          <DemoRibbon message="Advanced Search - Coming Soon!" />
          <DemoRibbon message="Cloud Storage Sync - Coming Soon!" />
        </div>
      </div>
    </div>  
  )  
}  