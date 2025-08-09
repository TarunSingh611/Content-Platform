'use client'

import { useEffect, useState } from 'react'
import { ArrowUpIcon, ArrowDownIcon, EyeIcon, HeartIcon, ShareIcon, ChatBubbleLeftRightIcon, ArrowTrendingUpIcon, DocumentTextIcon, UsersIcon } from '@heroicons/react/24/solid'
import { Line, Bar, Doughnut } from 'react-chartjs-2'
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
  audienceInsights: {
    demographics: {
      ageGroups: Array<{ group: string; percentage: number }>
      locations: Array<{ country: string; percentage: number }>
    }
    topReferrers: Array<{ source: string; percentage: number }>
  }
  performanceInsights: {
    peakHours: string
    bestDay: string
    bestDayEngagement: number
    mostPopularContentType: string
    avgReadingTime: number
  }
  reactionsSummary: {
    upvotes: number
    downvotes: number
    favorites: number
    bookmarks: number
  }
  ratingSummary: {
    average: number
    count: number
  }
  dailyReactions: Array<{
    date: string
    upvotes: number
    downvotes: number
    favorites: number
    bookmarks: number
  }>
}

export default function AnalyticsOverview() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState('all') // Default to all time

  useEffect(() => {
    fetchAnalytics()
  }, [period])

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/analytics?period=${period}&mode=advanced`)
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

  const { overview, dailyViews, topContent, topTags, engagementTrends, audienceInsights, performanceInsights, reactionsSummary, ratingSummary, dailyReactions } = data

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
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        borderColor: 'rgb(99, 102, 241)',
        tension: 0.4,
      },
    ],
  }

  // Chart data for top content performance
  const contentChartData = {
    labels: topContent.length > 0 
      ? topContent.slice(0, 5).map(item => item.title.substring(0, 20) + '...')
      : ['No content'],
    datasets: [
      {
        label: 'Views',
        data: topContent.length > 0 
          ? topContent.slice(0, 5).map(item => item.views)
          : [0],
        backgroundColor: 'rgba(99, 102, 241, 0.8)',
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

  // Engagement trends chart
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

  // Daily reactions chart (stacked bars)
  const reactionsChartData = {
    labels: dailyReactions.length > 0
      ? dailyReactions.map(r => new Date(r.date).toLocaleDateString())
      : ['No data'],
    datasets: [
      {
        label: 'Upvotes',
        data: dailyReactions.length > 0 ? dailyReactions.map(r => r.upvotes) : [0],
        backgroundColor: 'rgba(34,197,94,0.7)',
        borderColor: 'rgb(34,197,94)'
      },
      {
        label: 'Downvotes',
        data: dailyReactions.length > 0 ? dailyReactions.map(r => r.downvotes) : [0],
        backgroundColor: 'rgba(239,68,68,0.7)',
        borderColor: 'rgb(239,68,68)'
      },
      {
        label: 'Favorites',
        data: dailyReactions.length > 0 ? dailyReactions.map(r => r.favorites) : [0],
        backgroundColor: 'rgba(99,102,241,0.7)',
        borderColor: 'rgb(99,102,241)'
      },
      {
        label: 'Bookmarks',
        data: dailyReactions.length > 0 ? dailyReactions.map(r => r.bookmarks) : [0],
        backgroundColor: 'rgba(234,179,8,0.7)',
        borderColor: 'rgb(234,179,8)'
      },
    ],
  }

  const stats = [
    {
      name: 'Total Views',
      value: overview.totalViews.toLocaleString(),
      icon: EyeIcon,
      change: overview.growthRate,
      changeType: overview.growthRate >= 0 ? 'increase' : 'decrease',
    },
    {
      name: 'Upvotes',
      value: reactionsSummary.upvotes.toLocaleString(),
      icon: ArrowUpIcon,
      change: 12.5,
      changeType: 'increase',
    },
    {
      name: 'Engagement Rate',
      value: `${overview.avgEngagement}%`,
      icon: ArrowTrendingUpIcon,
      change: 5.7,
      changeType: 'increase',
    },
    {
      name: 'Active Users',
      value: overview.activeUsers.toLocaleString(),
      icon: UsersIcon,
      change: 8.2,
      changeType: 'increase',
    },
    {
      name: 'Published Content',
      value: `${overview.publishedContent}/${overview.totalContent}`,
      icon: DocumentTextIcon,
      change: 0,
      changeType: 'neutral',
    },
    {
      name: 'Avg Reading Time',
      value: `${performanceInsights.avgReadingTime} min`,
      icon: DocumentTextIcon,
      change: 0,
      changeType: 'neutral',
    },
  ]

  // Derived tag insights: avg views/post per tag
  const tagAverages = topTags.map(t => ({ tag: t.tag, avg: t.count ? Math.round((t.totalViews / t.count) * 10) / 10 : 0 }))
  const topTagAverage = tagAverages.sort((a, b) => b.avg - a.avg)[0]

  // Derived overall save rate from reactions and views
  const overallSaveRate = overview.totalViews > 0
    ? Math.round(((reactionsSummary.favorites + reactionsSummary.bookmarks) / overview.totalViews) * 1000) / 10
    : 0

  // Identify low-engagement candidates among high-view posts
  const lowEngagementCandidates = [...data.contentPerformance]
    .sort((a, b) => b.views - a.views)
    .slice(0, 10)
    .sort((a, b) => a.engagement - b.engagement)
    .slice(0, 3)

  return (
    <div className="space-y-6">
      {/* Period Selector */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Analytics Overview</h2>
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
              </div>
              <div className="flex items-center">
                {stat.changeType === 'increase' ? (
                  <ArrowUpIcon className="w-4 h-4 text-green-500" />
                ) : stat.changeType === 'decrease' ? (
                  <ArrowDownIcon className="w-4 h-4 text-red-500" />
                ) : null}
                <span className={`ml-1 text-sm ${
                  stat.changeType === 'increase' ? 'text-green-500' :
                  stat.changeType === 'decrease' ? 'text-red-500' : 'text-gray-500'
                }`}>
                  {stat.change > 0 ? '+' : ''}{stat.change}%
                </span>
              </div>
            </div>
            <div className="mt-4">
              <stat.icon className="w-8 h-8 text-indigo-600" />
            </div>
          </div>
        ))}
      </div>

      {/* Quick Insights Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Best Day</p>
          <p className="text-lg font-semibold">{performanceInsights.bestDay}</p>
          <p className="text-xs text-gray-500">{performanceInsights.bestDayEngagement}% engagement</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Peak Hours</p>
          <p className="text-lg font-semibold">{performanceInsights.peakHours}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Top Tag (avg views)</p>
          <p className="text-lg font-semibold">{topTagAverage ? `${topTagAverage.tag} · ${topTagAverage.avg}` : 'N/A'}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Rating</p>
          <p className="text-lg font-semibold">{ratingSummary.average.toFixed(1)} / 5</p>
          <p className="text-xs text-gray-500">{ratingSummary.count} votes</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Views Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium mb-4">Daily Views</h3>
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

      {/* Reactions Summary */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium mb-4">Audience Reactions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-50 rounded p-4">
            <p className="text-sm text-gray-600">Upvotes</p>
            <p className="text-xl font-semibold">{reactionsSummary.upvotes.toLocaleString()}</p>
          </div>
          <div className="bg-gray-50 rounded p-4">
            <p className="text-sm text-gray-600">Downvotes</p>
            <p className="text-xl font-semibold">{reactionsSummary.downvotes.toLocaleString()}</p>
          </div>
          <div className="bg-gray-50 rounded p-4">
            <p className="text-sm text-gray-600">Favorites</p>
            <p className="text-xl font-semibold">{reactionsSummary.favorites.toLocaleString()}</p>
          </div>
          <div className="bg-gray-50 rounded p-4">
            <p className="text-sm text-gray-600">Bookmarks</p>
            <p className="text-xl font-semibold">{reactionsSummary.bookmarks.toLocaleString()}</p>
          </div>
        </div>
        <div className="h-72">
          <Bar
            data={reactionsChartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { position: 'bottom' },
              },
              scales: {
                x: { stacked: true },
                y: { stacked: true, beginAtZero: true },
              },
            }}
          />
        </div>
      </div>

      {/* Top Content and Tags */}
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
                      <p className="text-xs text-gray-500">
                        {new Date(content.createdAt).toLocaleDateString()} · {data.contentPerformance.find(c => c.id === content.id)?.engagement ?? 0}% engagement
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

      {/* Actionable Insights */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Actionable Insights</h3>
        <ul className="list-disc pl-6 space-y-2 text-sm text-gray-700">
          <li>
            Overall save rate (favorites + bookmarks): <span className="font-semibold">{overallSaveRate}%</span>
          </li>
          <li>
            Best performing tag by avg views/post: <span className="font-semibold">{topTagAverage ? `${topTagAverage.tag} (${topTagAverage.avg})` : 'N/A'}</span>
          </li>
          {lowEngagementCandidates.map((c) => (
            <li key={c.id}>
              Consider updating <span className="font-semibold">{c.title}</span>: {c.views.toLocaleString()} views but low engagement at {c.engagement}%
            </li>
          ))}
        </ul>
      </div>

      {/* Performance Insights */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Performance Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <EyeIcon className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium">Peak Hours</span>
            </div>
            <p className="text-sm text-gray-600">{performanceInsights.peakHours}</p>
            <p className="text-xs text-gray-500">Highest engagement</p>
          </div>
          
          <div className="bg-white rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <ArrowTrendingUpIcon className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium">Best Day</span>
            </div>
            <p className="text-sm text-gray-600">{performanceInsights.bestDay}</p>
            <p className="text-xs text-gray-500">{performanceInsights.bestDayEngagement}% engagement</p>
          </div>
          
          <div className="bg-white rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <DocumentTextIcon className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-medium">Content Type</span>
            </div>
            <p className="text-sm text-gray-600">{performanceInsights.mostPopularContentType}</p>
            <p className="text-xs text-gray-500">Most popular</p>
          </div>
        </div>
      </div>
    </div>
  )
}  