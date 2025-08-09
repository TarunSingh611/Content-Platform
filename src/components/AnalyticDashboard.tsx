'use client'

import { useEffect, useState } from 'react'
import { 
  TrendingUp, 
  Users, 
  Eye, 
  MessageSquare,
  Share2,
  Heart,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react'
import { Line, Doughnut } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
)

interface AnalyticsData {
  overview: {
    totalViews: number
    totalLikes: number
    totalShares: number
    totalComments: number
    avgEngagement: number
    growthRate: number
    publishedContent: number
    totalContent: number
    activeUsers: number
  }
  contentPerformance: Array<{
    id: string
    title: string
    views: number
    likes: number
    shares: number
    comments: number
    engagement: number
    createdAt: string
    tags: string[]
  }>
  dailyViews: Array<{
    date: string
    views: number
    likes: number
    shares: number
    comments: number
  }>
  topContent: Array<{
    id: string
    title: string
    views: number
    likes: number
    shares: number
    comments: number
    createdAt: string
    tags: string[]
  }>
  topTags: Array<{
    tag: string
    count: number
    totalViews: number
  }>
  engagementTrends: {
    labels: string[]
    data: number[]
  }
}

export default function AnalyticDashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState('all') // Default to all time
  const [refreshInterval, setRefreshInterval] = useState<NodeJS.Timeout | null>(null)

  useEffect(() => {
    fetchAnalytics()
    
    // Set up auto-refresh every 5 minutes
    const interval = setInterval(() => {
      fetchAnalytics()
    }, 5 * 60 * 1000)
    
    setRefreshInterval(interval)

    return () => {
      if (refreshInterval) {
        clearInterval(refreshInterval)
      }
    }
  }, [period])

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/analytics?period=${period}&mode=basic`)
      if (response.ok) {
        const analyticsData = await response.json()
        setData(analyticsData)
      }
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No analytics data available</p>
      </div>
    )
  }

  const { overview, dailyViews, topContent, topTags, engagementTrends } = data

  // Chart data for daily views
  const viewsChartData = {
    labels: dailyViews.length > 0 
      ? dailyViews.map(item => new Date(item.date).toLocaleDateString())
      : ['No data'],
    datasets: [
      {
        label: 'Daily Views',
        data: dailyViews.length > 0 
          ? dailyViews.map(item => item.views)
          : [0],
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        tension: 0.4,
      },
    ],
  }

  // Chart data for engagement trends
  const engagementChartData = {
    labels: engagementTrends.labels.length > 0 
      ? engagementTrends.labels
      : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Engagement Rate (%)',
        data: engagementTrends.data.length > 0 
          ? engagementTrends.data
          : [0, 0, 0, 0, 0, 0, 0],
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  }

  // Chart data for tags (Top 10 + Others)
  const tagsChartData = (() => {
    if (topTags.length === 0) {
      return {
        labels: ['No tags'],
        datasets: [
          {
            data: [1],
            backgroundColor: ['#9CA3AF'],
          },
        ],
      }
    }

    const sortedByViews = [...topTags].sort((a, b) => (b.totalViews ?? 0) - (a.totalViews ?? 0))
    const topTen = sortedByViews.slice(0, 10)
    const others = sortedByViews.slice(10)
    const othersTotalViews = others.reduce((sum, t) => sum + (t.totalViews ?? 0), 0)

    const labels = [...topTen.map(t => t.tag), ...(others.length ? ['Others'] : [])]
    const data = [...topTen.map(t => t.totalViews), ...(others.length ? [othersTotalViews] : [])]

    const baseColors = [
      '#3B82F6',
      '#10B981',
      '#F59E0B',
      '#EF4444',
      '#8B5CF6',
      '#06B6D4',
      '#84CC16',
      '#F97316',
      '#EC4899',
      '#6366F1',
    ]
    const backgroundColor = others.length ? [...baseColors, '#9CA3AF'] : baseColors

    return {
      labels,
      datasets: [
        {
          data,
          backgroundColor,
        },
      ],
    }
  })()

  const stats = [
    {
      name: 'Total Views',
      value: overview.totalViews.toLocaleString(),
      icon: Eye,
      change: overview.growthRate,
      changeType: overview.growthRate >= 0 ? 'increase' : 'decrease',
      color: 'text-blue-600',
    },
    {
      name: 'Total Likes',
      value: overview.totalLikes.toLocaleString(),
      icon: Heart,
      change: 0, // Will be calculated from real data
      changeType: 'increase',
      color: 'text-red-600',
    },
    {
      name: 'Total Shares',
      value: overview.totalShares.toLocaleString(),
      icon: Share2,
      change: 0, // Will be calculated from real data
      changeType: 'increase',
      color: 'text-green-600',
    },
    {
      name: 'Total Comments',
      value: overview.totalComments.toLocaleString(),
      icon: MessageSquare,
      change: 0, // Will be calculated from real data
      changeType: 'increase',
      color: 'text-purple-600',
    },
    {
      name: 'Engagement Rate',
      value: `${overview.avgEngagement}%`,
      icon: TrendingUp,
      change: 0, // Will be calculated from real data
      changeType: 'increase',
      color: 'text-indigo-600',
    },
    {
      name: 'Active Users',
      value: overview.activeUsers.toLocaleString(),
      icon: Users,
      change: 0, // Will be calculated from real data
      changeType: 'increase',
      color: 'text-orange-600',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header with Period Selector */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Analytics</h2>
          <p className="text-gray-600 mt-1">Real-time performance metrics and insights</p>
        </div>
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="all">All Time</option>
          <option value="7">Last 7 days</option>
          <option value="30">Last 30 days</option>
          <option value="90">Last 90 days</option>
          <option value="365">Last year</option>
        </select>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-semibold mt-2">{stat.value}</p>
                {stat.change > 0 && (
                  <div className="flex items-center mt-2">
                    {stat.changeType === 'increase' ? (
                      <ArrowUpRight className="w-4 h-4 text-green-500" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4 text-red-500" />
                    )}
                    <span className={`ml-1 text-sm ${
                      stat.changeType === 'increase' ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {stat.change > 0 ? '+' : ''}{stat.change}%
                    </span>
                  </div>
                )}
              </div>
              <div className={`${stat.color}`}>
                <stat.icon className="w-8 h-8" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Views Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium mb-4">Daily Views Trend</h3>
          <div className="h-64">
            <Line
              data={viewsChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                  },
                },
              }}
            />
          </div>
        </div>

        {/* Engagement Trends Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium mb-4">Engagement Trends</h3>
          <div className="h-64">
            <Line
              data={engagementChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    max: Math.max(...engagementTrends.data, 1) * 1.2,
                  },
                },
              }}
            />
          </div>
        </div>
      </div>

      {/* Content Performance and Tags */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Content List */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium mb-4">Top Performing Content</h3>
          {topContent.length > 0 ? (
            <div className="space-y-4">
              {topContent.slice(0, 5).map((content, index) => (
                <div key={content.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <span className="text-lg font-bold text-indigo-600 mr-3">#{index + 1}</span>
                    <div>
                      <p className="font-medium text-gray-900">{content.title}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(content.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{content.views.toLocaleString()}</p>
                    <p className="text-sm text-gray-500">views</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No content data available</p>
            </div>
          )}
        </div>

        {/* Tags Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium mb-4">Content by Tags</h3>
          <div className="h-5/6">
            <Doughnut
              data={tagsChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom',
                  },
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}  