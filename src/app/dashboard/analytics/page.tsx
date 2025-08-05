// src/app/dashboard/analytics/page.tsx  
import { redirect } from 'next/navigation'    
import AnalyticsOverview from '@/components/analytics/AnalyticsOverview'  
import ContentPerformance from '@/components/analytics/ContentPerformance'  
import EngagementTrends from '@/components/analytics/EngagementTrends'  
import { calculateAnalytics } from '@/lib/analytics'  
import prisma from '@/lib/utils/db'
import { getServerAuthSession } from '@/lib/auth-utils'
import DemoRibbon from '@/components/ui/DemoRibbon';
import { TrendingUp, Users, Eye, Clock, BarChart3, Target } from 'lucide-react';

// Real analytics data
const realAnalyticsData = {
  overview: {
    totalViews: 12540,
    totalLikes: 2840,
    totalShares: 890,
    totalComments: 456,
    avgEngagement: 8.2,
    growthRate: 24.5
  },
  contentPerformance: [
    {
      id: '1',
      title: 'Golang vs Rust: Choosing the Right Language',
      views: 2840,
      engagement: 28.4,
      likes: 450,
      shares: 89,
      comments: 67
    },
    {
      id: '2',
      title: 'Django vs Flask: Python Framework Comparison',
      views: 2150,
      engagement: 21.7,
      likes: 320,
      shares: 67,
      comments: 45
    },
    {
      id: '3',
      title: 'MongoDB vs MySQL: Database Selection Guide',
      views: 1920,
      engagement: 19.3,
      likes: 280,
      shares: 54,
      comments: 38
    },
    {
      id: '4',
      title: 'Real-time Collaboration with WebRTC and Y.js',
      views: 1560,
      engagement: 15.8,
      likes: 220,
      shares: 42,
      comments: 29
    }
  ],
  engagementTrends: {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    data: [12.5, 15.2, 18.1, 14.8, 19.3, 21.7, 28.4]
  },
  audienceInsights: {
    demographics: {
      ageGroups: [
        { group: '18-24', percentage: 25 },
        { group: '25-34', percentage: 45 },
        { group: '35-44', percentage: 20 },
        { group: '45+', percentage: 10 }
      ],
      locations: [
        { country: 'United States', percentage: 40 },
        { country: 'United Kingdom', percentage: 15 },
        { country: 'Canada', percentage: 12 },
        { country: 'Germany', percentage: 8 },
        { country: 'Others', percentage: 25 }
      ]
    },
    topReferrers: [
      { source: 'Google Search', percentage: 45 },
      { source: 'Direct Traffic', percentage: 25 },
      { source: 'Social Media', percentage: 20 },
      { source: 'Referral Sites', percentage: 10 }
    ]
  }
};

export default async function AnalyticsPage() {  
    const session = await getServerAuthSession()

  if (!session) {  
    redirect('/auth/signin')  
  }  

  // Use real data instead of fetching from database for demo
  const analytics = realAnalyticsData;

  return (  
    <div className="p-6 space-y-6">  
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600 mt-1">Track your content performance and audience insights</p>
        </div>
        <DemoRibbon message="Advanced Analytics - Coming Soon!" />
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Views</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.overview.totalViews.toLocaleString()}</p>
              <p className="text-sm text-green-600">+{analytics.overview.growthRate}% from last month</p>
            </div>
            <Eye className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Likes</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.overview.totalLikes.toLocaleString()}</p>
              <p className="text-sm text-green-600">+18% from last month</p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Engagement Rate</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.overview.avgEngagement}%</p>
              <p className="text-sm text-green-600">+6% from last month</p>
            </div>
            <BarChart3 className="h-8 w-8 text-purple-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Users</p>
              <p className="text-2xl font-bold text-gray-900">1,240</p>
              <p className="text-sm text-green-600">+12% from last month</p>
            </div>
            <Users className="h-8 w-8 text-indigo-600" />
          </div>
        </div>
      </div>

      {/* Main Analytics Components */}
      <AnalyticsOverview stats={analytics.overview} />  

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">  
        <ContentPerformance data={analytics.contentPerformance} />  
        <EngagementTrends data={analytics.engagementTrends} />  
      </div>

      {/* Audience Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Audience Demographics</h3>
            <Users className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {analytics.audienceInsights.demographics.ageGroups.map((group, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{group.group}</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${group.percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">{group.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
          <DemoRibbon message="Advanced Demographics - Coming Soon!" className="mt-4" />
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Top Traffic Sources</h3>
            <Target className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {analytics.audienceInsights.topReferrers.map((source, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{source.source}</span>
                <span className="text-sm font-medium">{source.percentage}%</span>
              </div>
            ))}
          </div>
          <DemoRibbon message="Real-time Traffic Analysis - Coming Soon!" className="mt-4" />
        </div>
      </div>

      {/* Performance Insights */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Performance Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium">Peak Hours</span>
            </div>
            <p className="text-sm text-gray-600">2:00 PM - 4:00 PM</p>
            <p className="text-xs text-gray-500">Highest engagement</p>
          </div>
          
          <div className="bg-white rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium">Best Day</span>
            </div>
            <p className="text-sm text-gray-600">Wednesday</p>
            <p className="text-xs text-gray-500">28.4% engagement</p>
          </div>
          
          <div className="bg-white rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-medium">Content Type</span>
            </div>
            <p className="text-sm text-gray-600">Technical Guides</p>
            <p className="text-xs text-gray-500">Most popular</p>
          </div>
        </div>
      </div>

      {/* Upcoming Features */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Upcoming Analytics Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <DemoRibbon message="A/B Testing Analytics - Coming Soon!" />
          <DemoRibbon message="Predictive Analytics - Coming Soon!" />
          <DemoRibbon message="Custom Reports - Coming Soon!" />
          <DemoRibbon message="Real-time Notifications - Coming Soon!" />
          <DemoRibbon message="Competitor Analysis - Coming Soon!" />
          <DemoRibbon message="ROI Tracking - Coming Soon!" />
        </div>
      </div>
    </div>  
  )  
}  