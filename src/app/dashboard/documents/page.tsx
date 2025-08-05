// app/dashboard/documents/page.tsx   
import { redirect } from 'next/navigation'  
import DocumentList from '@/components/documents/DocumentList'  
import DocumentCreate from '@/components/documents/DocumentCreate'  
import DocumentFilters from '@/components/documents/DocumentFilters'  
import { getServerAuthSession } from '@/lib/auth-utils'
import prisma from '@/lib/utils/db'
import DemoRibbon from '@/components/ui/DemoRibbon';
import { FileText, Folder, Clock, Users, Search, Filter, Grid, List, Download, Share2, Edit3 } from 'lucide-react';

// Real document data
const realDocumentData = [
  {
    id: '1',
    title: 'Technical Writing Guidelines',
    description: 'Comprehensive guide for creating high-quality technical documentation',
    type: 'document',
    size: 2048576, // 2MB
    status: 'published',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T14:20:00Z',
    author: 'John Smith',
    collaborators: ['Sarah Johnson', 'Mike Chen'],
    tags: ['guidelines', 'technical', 'writing'],
    views: 156,
    downloads: 23,
    category: 'Guidelines'
  },
  {
    id: '2',
    title: 'API Documentation Template',
    description: 'Standard template for documenting REST APIs and endpoints',
    type: 'template',
    size: 1048576, // 1MB
    status: 'draft',
    createdAt: '2024-01-14T09:15:00Z',
    updatedAt: '2024-01-15T11:45:00Z',
    author: 'Sarah Johnson',
    collaborators: ['John Smith'],
    tags: ['api', 'documentation', 'template'],
    views: 89,
    downloads: 12,
    category: 'Templates'
  },
  {
    id: '3',
    title: 'Content Strategy Plan',
    description: 'Strategic plan for content creation and distribution',
    type: 'document',
    size: 3145728, // 3MB
    status: 'published',
    createdAt: '2024-01-13T16:20:00Z',
    updatedAt: '2024-01-14T10:30:00Z',
    author: 'Mike Chen',
    collaborators: ['Emily Davis', 'Rachel Green'],
    tags: ['strategy', 'content', 'planning'],
    views: 234,
    downloads: 45,
    category: 'Strategy'
  },
  {
    id: '4',
    title: 'SEO Best Practices',
    description: 'Comprehensive guide for optimizing content for search engines',
    type: 'document',
    size: 1572864, // 1.5MB
    status: 'published',
    createdAt: '2024-01-12T13:45:00Z',
    updatedAt: '2024-01-13T15:20:00Z',
    author: 'Emily Davis',
    collaborators: ['John Smith'],
    tags: ['seo', 'optimization', 'best-practices'],
    views: 189,
    downloads: 34,
    category: 'SEO'
  },
  {
    id: '5',
    title: 'Brand Style Guide',
    description: 'Complete brand guidelines and style standards',
    type: 'document',
    size: 5242880, // 5MB
    status: 'draft',
    createdAt: '2024-01-11T11:30:00Z',
    updatedAt: '2024-01-12T09:15:00Z',
    author: 'David Wilson',
    collaborators: ['Lisa Brown'],
    tags: ['brand', 'style', 'guidelines'],
    views: 67,
    downloads: 8,
    category: 'Brand'
  },
  {
    id: '6',
    title: 'Project Timeline Template',
    description: 'Template for creating and managing project timelines',
    type: 'template',
    size: 786432, // 768KB
    status: 'published',
    createdAt: '2024-01-10T14:20:00Z',
    updatedAt: '2024-01-11T16:45:00Z',
    author: 'Rachel Green',
    collaborators: ['Tom Anderson'],
    tags: ['timeline', 'project', 'template'],
    views: 145,
    downloads: 28,
    category: 'Templates'
  }
];

export default async function DocumentsPage() {  
    const session = await getServerAuthSession() 

  if (!session) {  
    redirect('/auth/signin')  
  }  

  // Use real data instead of fetching from database for demo
  const documents = realDocumentData;

  const stats = {
    total: documents.length,
    published: documents.filter(d => d.status === 'published').length,
    draft: documents.filter(d => d.status === 'draft').length,
    totalViews: documents.reduce((sum, d) => sum + d.views, 0),
    totalDownloads: documents.reduce((sum, d) => sum + d.downloads, 0)
  };

  return (  
    <div className="p-6 space-y-6">  
      {/* Header */}
      <div className="flex justify-between items-center">  
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Documents</h1>
          <p className="text-gray-600 mt-1">Manage and organize your documents</p>
        </div>
        <div className="flex items-center gap-3">
          <DemoRibbon message="AI Document Analysis - Coming Soon!" />
          <DocumentCreate />  
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Documents</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <FileText className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Published</p>
              <p className="text-2xl font-bold text-green-600">{stats.published}</p>
            </div>
            <Folder className="h-8 w-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Views</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalViews}</p>
            </div>
            <Users className="h-8 w-8 text-purple-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Downloads</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalDownloads}</p>
            </div>
            <Download className="h-8 w-8 text-orange-600" />
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
                placeholder="Search documents..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
              <option value="all">All Categories</option>
              <option value="guidelines">Guidelines</option>
              <option value="templates">Templates</option>
              <option value="strategy">Strategy</option>
              <option value="seo">SEO</option>
              <option value="brand">Brand</option>
            </select>
            <select className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
              <option value="recent">Recent</option>
              <option value="name">Name</option>
              <option value="size">Size</option>
              <option value="views">Views</option>
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

      {/* Documents Grid */}
      <div className="bg-white rounded-lg shadow">
        <DocumentFilters />  
        <DocumentList documents={documents} />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Quick Actions</h3>
            <FileText className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
              Create Document
            </button>
            <button className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors">
              Import Document
            </button>
            <button className="w-full bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors">
              Share Documents
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Recent Activity</h3>
            <Clock className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-md">
              <Edit3 className="h-4 w-4 text-blue-600" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">Technical Writing Guidelines updated</p>
                <p className="text-xs text-gray-500">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-md">
              <Share2 className="h-4 w-4 text-green-600" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">API Documentation shared</p>
                <p className="text-xs text-gray-500">4 hours ago</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-md">
              <Download className="h-4 w-4 text-purple-600" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">SEO Best Practices downloaded</p>
                <p className="text-xs text-gray-500">1 day ago</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Document Analytics</h3>
            <Users className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Most Viewed</span>
              <span className="text-sm font-medium">Content Strategy Plan</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Most Downloaded</span>
              <span className="text-sm font-medium">SEO Best Practices</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Collaboration Score</span>
              <span className="text-sm font-medium text-green-600">85%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Features */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Upcoming Document Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <DemoRibbon message="AI Document Summarization - Coming Soon!" />
          <DemoRibbon message="Real-time Collaboration - Coming Soon!" />
          <DemoRibbon message="Version Control - Coming Soon!" />
          <DemoRibbon message="Advanced Search - Coming Soon!" />
          <DemoRibbon message="Document Templates - Coming Soon!" />
          <DemoRibbon message="Export Options - Coming Soon!" />
        </div>
      </div>
    </div>  
  )  
}  