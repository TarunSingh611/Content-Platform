// src/app/dashboard/content/page.tsx
'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { Plus, Search, Filter, Eye, Edit, Trash2, Calendar, BarChart3 } from 'lucide-react';
import DemoRibbon from '@/components/ui/DemoRibbon';

interface Content {
  id: string;
  title: string;
  content: string;
  description?: string;
  excerpt?: string;
  coverImage?: string;
  tags?: string[];
  published: boolean;
  featured: boolean;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  slug: string;
  readingTime: number;
  views: number;
  likes: number;
  shares: number;
  comments: number;
  createdAt: string;
  updatedAt: string;
  author?: {
    name: string;
    email: string;
  };
}

export default function ContentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [contents, setContents] = useState<Content[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchContents();
  }, []);

  useEffect(() => {
    const searchQuery = searchParams.get('search');
    if (searchQuery) {
      setSearchTerm(searchQuery);
    }
  }, [searchParams]);

  const fetchContents = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/content');
      if (response.ok) {
        const data = await response.json();
        setContents(data);
      } else {
        toast.error('Failed to fetch content');
      }
    } catch (error) {
      toast.error('Failed to fetch content');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredContents = contents.filter(content => {
    const matchesSearch = content.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (content.description?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || 
                         (filterStatus === 'published' && content.published) ||
                         (filterStatus === 'draft' && !content.published);
    return matchesSearch && matchesFilter;
  });

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this content?')) return;

    try {
      const response = await fetch(`/api/content/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setContents(prev => prev.filter(content => content.id !== id));
        toast.success('Content deleted successfully');
      } else {
        toast.error('Failed to delete content');
      }
    } catch (error) {
      toast.error('Failed to delete content');
    }
  };

  const stats = {
    total: contents.length,
    published: contents.filter(c => c.published).length,
    draft: contents.filter(c => !c.published).length,
    totalViews: contents.reduce((sum, c) => sum + (c.views || 0), 0),
    totalLikes: contents.reduce((sum, c) => sum + (c.likes || 0), 0)
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Content Management</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">Manage and organize your content effectively</p>
        </div>
        <div className="flex items-center gap-3">
          <DemoRibbon message="AI Content Generation - Coming Soon!" />
          <Link
            href="/dashboard/content/new"
            className="bg-indigo-600 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-md hover:bg-indigo-700 flex items-center gap-2 transition-colors text-sm sm:text-base"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Create New Content</span>
            <span className="sm:hidden">New</span>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600">Total</p>
              <p className="text-lg sm:text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <BarChart3 className="h-6 w-6 sm:h-8 sm:w-8 text-indigo-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600">Published</p>
              <p className="text-lg sm:text-2xl font-bold text-green-600">{stats.published}</p>
            </div>
            <Eye className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600">Drafts</p>
              <p className="text-lg sm:text-2xl font-bold text-yellow-600">{stats.draft}</p>
            </div>
            <Edit className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600">Views</p>
              <p className="text-lg sm:text-2xl font-bold text-blue-600">{stats.totalViews.toLocaleString()}</p>
            </div>
            <Eye className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4 col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600">Likes</p>
              <p className="text-lg sm:text-2xl font-bold text-red-600">{stats.totalLikes.toLocaleString()}</p>
            </div>
            <BarChart3 className="h-6 w-6 sm:h-8 sm:w-8 text-red-600" />
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm sm:text-base"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm sm:text-base"
            >
              <option value="all">All Content</option>
              <option value="published">Published</option>
              <option value="draft">Drafts</option>
            </select>
          </div>
        </div>
      </div>

      {/* Content List - Mobile Responsive */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {/* Desktop Table */}
        <div className="hidden lg:block">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Content
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Views
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Engagement
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredContents.map((content) => (
                  <tr key={content.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="max-w-xs">
                        <div className="text-sm font-medium text-gray-900 truncate">
                          {content.title}
                        </div>
                        <div className="text-sm text-gray-500 truncate">
                          {content.description}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          By {content.author?.name || 'Unknown'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-wrap gap-1">
                        {content.tags?.slice(0, 2).map((tag, index) => (
                          <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {tag}
                          </span>
                        ))}
                        {content.tags && content.tags.length > 2 && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            +{content.tags.length - 2}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        content.published
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {content.published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {content.views?.toLocaleString() || '0'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {content.likes || 0} likes
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(content.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/dashboard/content/${content.id}`}
                          className="text-indigo-600 hover:text-indigo-900 flex items-center gap-1"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(content.id)}
                          className="text-red-600 hover:text-red-900 flex items-center gap-1"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile Cards */}
        <div className="lg:hidden">
          <div className="divide-y divide-gray-200">
            {filteredContents.map((content) => (
              <div key={content.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {content.title}
                      </h3>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        content.published
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {content.published ? 'Published' : 'Draft'}
                      </span>
                    </div>
                    
                    {content.description && (
                      <p className="text-sm text-gray-500 mb-2 line-clamp-2">
                        {content.description}
                      </p>
                    )}
                    
                    <div className="flex flex-wrap gap-1 mb-2">
                      {content.tags?.slice(0, 3).map((tag, index) => (
                        <span key={index} className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {tag}
                        </span>
                      ))}
                      {content.tags && content.tags.length > 3 && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          +{content.tags.length - 3}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {content.views?.toLocaleString() || '0'}
                      </span>
                      <span className="flex items-center gap-1">
                        <BarChart3 className="h-3 w-3" />
                        {content.likes || 0} likes
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(content.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2 ml-4">
                    <Link
                      href={`/dashboard/content/${content.id}`}
                      className="text-indigo-600 hover:text-indigo-900 flex items-center gap-1 text-sm"
                    >
                      <Edit className="h-3 w-3" />
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(content.id)}
                      className="text-red-600 hover:text-red-900 flex items-center gap-1 text-sm"
                    >
                      <Trash2 className="h-3 w-3" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {filteredContents.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No content found matching your criteria.</p>
          </div>
        )}
      </div>

      {/* Demo Features */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4 sm:p-6">
        <h3 className="text-lg font-semibold mb-4">Upcoming Features</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <DemoRibbon message="Bulk Content Operations - Coming Soon!" />
          <DemoRibbon message="Content Templates - Coming Soon!" />
          <DemoRibbon message="Advanced Analytics - Coming Soon!" />
        </div>
      </div>
    </div>
  );
}