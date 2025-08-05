// src/app/dashboard/content/page.tsx
'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Plus, Search, Filter, Eye, Edit, Trash2, Calendar, BarChart3 } from 'lucide-react';
import DemoRibbon from '@/components/ui/DemoRibbon';

interface Content {
  id: string;
  title: string;
  description: string;
  published: boolean;
  createdAt: string;
  views?: number;
  engagement?: number;
  category?: string;
  author?: string;
}

// Real content data
const realContentData: Content[] = [
  {
    id: '1',
    title: 'Golang vs Rust: Choosing the Right Language for Modern Development',
    description: 'A comprehensive comparison of Go and Rust programming languages, exploring their strengths, weaknesses, and ideal use cases for modern software development.',
    published: true,
    createdAt: '2024-01-15',
    views: 2840,
    engagement: 28.4,
    category: 'Programming',
    author: 'John Smith'
  },
  {
    id: '2',
    title: 'Django vs Flask: Choosing the Right Python Framework for Your Web Application',
    description: 'An in-depth analysis of Django and Flask frameworks, helping developers choose the best Python web framework for their specific project requirements.',
    published: true,
    createdAt: '2024-01-14',
    views: 2150,
    engagement: 21.7,
    category: 'Web Development',
    author: 'Sarah Johnson'
  },
  {
    id: '3',
    title: 'MongoDB vs MySQL: Choosing the Right Database for Your Project',
    description: 'A detailed comparison of MongoDB and MySQL databases, covering performance, scalability, and use case scenarios for different types of applications.',
    published: true,
    createdAt: '2024-01-13',
    views: 1920,
    engagement: 19.3,
    category: 'Database',
    author: 'Mike Chen'
  },
  {
    id: '4',
    title: 'Next.js 15: What\'s New and Exciting for Developers',
    description: 'Exploring the latest features and improvements in Next.js 15, including the new App Router, server components, and performance enhancements.',
    published: false,
    createdAt: '2024-01-12',
    views: 0,
    engagement: 0,
    category: 'Frontend',
    author: 'Emily Davis'
  },
  {
    id: '5',
    title: 'TypeScript Best Practices for Large-Scale Applications',
    description: 'Essential TypeScript patterns and practices for building maintainable, scalable applications with proper type safety and code organization.',
    published: false,
    createdAt: '2024-01-11',
    views: 0,
    engagement: 0,
    category: 'Programming',
    author: 'Alex Thompson'
  },
  {
    id: '6',
    title: 'Real-time Collaboration with WebRTC and Y.js',
    description: 'Building collaborative editing features using WebRTC and Y.js for real-time document editing and team collaboration.',
    published: true,
    createdAt: '2024-01-10',
    views: 1560,
    engagement: 15.8,
    category: 'Real-time',
    author: 'David Wilson'
  }
];

export default function ContentPage() {
  const router = useRouter();
  const [contents, setContents] = useState<Content[]>(realContentData);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredContents = contents.filter(content => {
    const matchesSearch = content.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         content.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || 
                         (filterStatus === 'published' && content.published) ||
                         (filterStatus === 'draft' && !content.published);
    return matchesSearch && matchesFilter;
  });

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this content?')) return;

    try {
      setContents(prev => prev.filter(content => content.id !== id));
      toast.success('Content deleted successfully');
    } catch (error) {
      toast.error('Failed to delete content');
    }
  };

  const stats = {
    total: contents.length,
    published: contents.filter(c => c.published).length,
    draft: contents.filter(c => !c.published).length,
    totalViews: contents.reduce((sum, c) => sum + (c.views || 0), 0)
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Content Management</h1>
          <p className="text-gray-600 mt-1">Manage and organize your content effectively</p>
        </div>
        <div className="flex items-center gap-3">
          <DemoRibbon message="AI Content Generation - Coming Soon!" />
          <Link
            href="/dashboard/content/new"
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center gap-2 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Create New Content
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Content</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <BarChart3 className="h-8 w-8 text-indigo-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Published</p>
              <p className="text-2xl font-bold text-green-600">{stats.published}</p>
            </div>
            <Eye className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Drafts</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.draft}</p>
            </div>
            <Edit className="h-8 w-8 text-yellow-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Views</p>
              <p className="text-2xl font-bold text-blue-600">{stats.totalViews.toLocaleString()}</p>
            </div>
            <Eye className="h-8 w-8 text-blue-600" />
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="all">All Content</option>
              <option value="published">Published</option>
              <option value="draft">Drafts</option>
            </select>
          </div>
        </div>
      </div>

      {/* Content Table */}
      <div className="bg-white rounded-lg shadow">
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
                        By {content.author}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {content.category}
                    </span>
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
                    {content.engagement ? `${content.engagement}%` : '0%'}
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
                        <Edit className="h-3 w-3" />
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(content.id)}
                        className="text-red-600 hover:text-red-900 flex items-center gap-1"
                      >
                        <Trash2 className="h-3 w-3" />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredContents.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No content found matching your criteria.</p>
          </div>
        )}
      </div>

      {/* Demo Features */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Upcoming Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <DemoRibbon message="Bulk Content Operations - Coming Soon!" />
          <DemoRibbon message="Content Templates - Coming Soon!" />
          <DemoRibbon message="Advanced Analytics - Coming Soon!" />
        </div>
      </div>
    </div>
  );
}