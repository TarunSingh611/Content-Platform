'use client';

import { useState, useEffect } from 'react';
import { FileText, Eye, BarChart2, Users, TrendingUp, Clock, Calendar, Plus, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { StatCard } from '@/components/StackCard';
import AnalyticsDashboard from '@/components/AnalyticDashboard';
import DemoRibbon from '@/components/ui/DemoRibbon';

interface DashboardData {
  overview: {
    totalViews: number;
    totalLikes: number;
    totalShares: number;
    totalComments: number;
    avgEngagement: number;
    growthRate: number;
    publishedContent: number;
    totalContent: number;
    activeUsers: number;
  };
  contentPerformance: Array<{
    id: string;
    title: string;
    views: number;
    likes: number;
    shares: number;
    comments: number;
    engagement: number;
    createdAt: string;
    published: boolean;
    tags: string[];
  }>;
  dailyViews: Array<{
    date: string;
    views: number;
    likes: number;
    shares: number;
    comments: number;
  }>;
  topContent: Array<{
    id: string;
    title: string;
    views: number;
    likes: number;
    shares: number;
    comments: number;
    createdAt: string;
    tags: string[];
  }>;
  topTags: Array<{
    tag: string;
    count: number;
    totalViews: number;
  }>;
  engagementTrends: {
    labels: string[];
    data: number[];
  };
}

interface Content {
  id: string;
  title: string;
  content: string;
  description?: string;
  excerpt?: string;
  coverImage?: string;
  tags: string[];
  published: boolean;
  featured: boolean;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords: string[];
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

export default function DashboardPage() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [recentContent, setRecentContent] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch analytics data
      const analyticsResponse = await fetch('/api/analytics');
      if (!analyticsResponse.ok) {
        throw new Error('Failed to fetch analytics');
      }
      const analyticsData = await analyticsResponse.json();

      // Fetch recent content
      const contentResponse = await fetch('/api/content');
      if (!contentResponse.ok) {
        throw new Error('Failed to fetch content');
      }
      const contentData = await contentResponse.json();

      setDashboardData(analyticsData);
      setRecentContent(contentData.slice(0, 5)); // Get latest 5 content items
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const formatGrowthRate = (rate: number) => {
    const sign = rate >= 0 ? '+' : '';
    return `${sign}${rate.toFixed(1)}%`;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard</h1>
          <DemoRibbon message="Advanced Analytics - Coming Soon!" />
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard</h1>
          <DemoRibbon message="Advanced Analytics - Coming Soon!" />
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
          <button
            onClick={fetchDashboardData}
            className="mt-2 text-red-600 hover:text-red-800 underline"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard</h1>
          <DemoRibbon message="Advanced Analytics - Coming Soon!" />
        </div>
        <div className="text-center py-12">
          <p className="text-gray-500">No data available</p>
        </div>
      </div>
    );
  }

  // Prepare analytics data for charts
  const analyticsData = {
    labels: dashboardData.engagementTrends.labels,
    views: dashboardData.dailyViews.map(d => d.views),
    likes: dashboardData.dailyViews.map(d => d.likes),
    engagement: dashboardData.engagementTrends.data,
    shares: dashboardData.dailyViews.map(d => d.shares),
    comments: dashboardData.dailyViews.map(d => d.comments)
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard</h1>
        <DemoRibbon message="Advanced Analytics - Coming Soon!" />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Content"
          value={dashboardData.overview.totalContent.toString()}
          change={formatGrowthRate(dashboardData.overview.growthRate)}
          icon={FileText}
        />
        <StatCard
          title="Total Views"
          value={formatNumber(dashboardData.overview.totalViews)}
          change={formatGrowthRate(dashboardData.overview.growthRate)}
          icon={Eye}
        />
        <StatCard
          title="Engagement Rate"
          value={`${dashboardData.overview.avgEngagement.toFixed(1)}%`}
          change={formatGrowthRate(dashboardData.overview.growthRate)}
          icon={BarChart2}
        />
        <StatCard
          title="Active Users"
          value={formatNumber(dashboardData.overview.activeUsers)}
          change={formatGrowthRate(dashboardData.overview.growthRate)}
          icon={Users}
        />
      </div>

      {/* Analytics Dashboard */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-semibold mb-4">Performance Analytics</h2>
        <div className="overflow-x-auto">
          <AnalyticsDashboard />
        </div>
      </div>

      {/* Recent Content Performance */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 space-y-2 sm:space-y-0">
          <h2 className="text-lg sm:text-xl font-semibold">Recent Content Performance</h2>
          <DemoRibbon message="Advanced Content Analytics - Coming Soon!" />
        </div>
        
        {recentContent.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Content Title
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Views
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Engagement
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentContent.map((content) => {
                  const engagement = content.likes + content.shares + content.comments;
                  const engagementRate = content.views > 0 ? (engagement / content.views) * 100 : 0;
                  
                  return (
                    <tr key={content.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4">
                        <div className="max-w-xs">
                          <div className="text-sm font-medium text-gray-900 truncate">
                            {content.title}
                          </div>
                          {content.description && (
                            <div className="text-sm text-gray-500 truncate">
                              {content.description}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          content.published
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {content.published ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900">
                        {formatNumber(content.views)}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900">
                        {engagementRate.toFixed(1)}%
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-500">
                        {new Date(content.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No content yet</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by creating your first piece of content.
            </p>
            <div className="mt-6">
              <Link
                href="/dashboard/content/new"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Content
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions & Additional Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold">Quick Actions</h3>
            <Clock className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            <Link
              href="/dashboard/content/new"
              className="flex items-center justify-between w-full p-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <span className="text-sm font-medium">Create New Content</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
            <Link
              href="/dashboard/analytics"
              className="flex items-center justify-between w-full p-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <span className="text-sm font-medium">View Analytics</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
            <Link
              href="/dashboard/media"
              className="flex items-center justify-between w-full p-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <span className="text-sm font-medium">Manage Media</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Top Performing Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold">Top Performing Content</h3>
            <TrendingUp className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {dashboardData.topContent.slice(0, 3).map((content) => (
              <div key={content.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {content.title}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatNumber(content.views)} views
                  </p>
                </div>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                  {formatNumber(content.likes)} likes
                </span>
              </div>
            ))}
            {dashboardData.topContent.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-4">
                No content data available
              </p>
            )}
          </div>
        </div>

        {/* Trending Topics */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold">Trending Topics</h3>
            <TrendingUp className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {dashboardData.topTags.slice(0, 5).map((tag, index) => (
              <div key={tag.tag} className="flex items-center justify-between">
                <span className="text-sm text-gray-900">#{tag.tag}</span>
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                  {formatNumber(tag.totalViews)} views
                </span>
              </div>
            ))}
            {dashboardData.topTags.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-4">
                No trending topics yet
              </p>
            )}
            <DemoRibbon message="AI-Powered Topic Suggestions - Coming Soon!" />
          </div>
        </div>
      </div>
    </div>
  );
}  