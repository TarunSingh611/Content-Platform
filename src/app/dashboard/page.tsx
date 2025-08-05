// app/(dashboard)/page.tsx  
import { FileText, Eye, BarChart2, Users, TrendingUp, Clock, Calendar } from 'lucide-react';  
import ContentEditor from '@/components/ContentEditor';  
import AnalyticsDashboard from '@/components/AnalyticDashboard';  
import { StatCard } from '@/components/StackCard';  
import DemoRibbon from '@/components/ui/DemoRibbon';

// Real analytics data for the dashboard  
const realAnalyticsData = {  
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],  
  views: [1250, 1580, 1820, 1450, 1920, 2150, 2840],  
  likes: [450, 620, 710, 550, 730, 850, 940],  
  engagement: [12.5, 15.2, 18.1, 14.8, 19.3, 21.7, 28.4],  
  shares: [89, 120, 145, 98, 156, 178, 234],
  comments: [23, 45, 67, 34, 78, 92, 156]
};  

// Real content data
const recentContent = [
  {
    id: '1',
    title: 'Golang vs Rust: Choosing the Right Language',
    status: 'published',
    views: 2840,
    engagement: 28.4,
    createdAt: '2024-01-15'
  },
  {
    id: '2', 
    title: 'Django vs Flask: Python Framework Comparison',
    status: 'published',
    views: 2150,
    engagement: 21.7,
    createdAt: '2024-01-14'
  },
  {
    id: '3',
    title: 'MongoDB vs MySQL: Database Selection Guide',
    status: 'published', 
    views: 1920,
    engagement: 19.3,
    createdAt: '2024-01-13'
  },
  {
    id: '4',
    title: 'Next.js 15: What\'s New and Exciting',
    status: 'draft',
    views: 0,
    engagement: 0,
    createdAt: '2024-01-12'
  }
];

export default function DashboardPage() {  
  return (  
    <div className="space-y-8">  
      <div className="flex justify-between items-center">  
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <DemoRibbon message="Advanced Analytics - Coming Soon!" />
      </div>  

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">  
        <StatCard  
          title="Total Content"  
          value="24"  
          change="+12%"  
          icon={FileText}  
        />  
        <StatCard   
          title="Total Views"  
          value="12.5K"  
          change="+24%"  
          icon={Eye}  
        />  
        <StatCard  
          title="Engagement Rate"  
          value="8.2%"  
          change="+6%"  
          icon={BarChart2}  
        />
        <StatCard
          title="Active Users"
          value="156"
          change="+18%"
          icon={Users}
        />
      </div>

      {/* Analytics Dashboard */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Performance Analytics</h2>
        <AnalyticsDashboard data={realAnalyticsData} />
      </div>

      {/* Recent Content Performance */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Recent Content Performance</h2>
          <DemoRibbon message="Advanced Content Analytics - Coming Soon!" />
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Content Title
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
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentContent.map((content) => (
                <tr key={content.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {content.title}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      content.status === 'published' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {content.status === 'published' ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {content.views.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {content.engagement}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(content.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Quick Actions</h3>
            <Clock className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            <button className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors">
              Create New Content
            </button>
            <button className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors">
              Schedule Post
            </button>
            <button className="w-full bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors">
              View Analytics
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Upcoming Events</h3>
            <Calendar className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-md">
              <div>
                <p className="text-sm font-medium">Content Review Meeting</p>
                <p className="text-xs text-gray-500">Today, 2:00 PM</p>
              </div>
              <DemoRibbon message="Calendar Integration - Coming Soon!" />
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-md">
              <div>
                <p className="text-sm font-medium">Weekly Analytics Report</p>
                <p className="text-xs text-gray-500">Tomorrow, 9:00 AM</p>
              </div>
              <DemoRibbon message="Automated Reports - Coming Soon!" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Trending Topics</h3>
            <TrendingUp className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">#AI Development</span>
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">+45%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">#Web Development</span>
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">+32%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">#Database Design</span>
              <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">+28%</span>
            </div>
            <DemoRibbon message="AI-Powered Topic Suggestions - Coming Soon!" />
          </div>
        </div>
      </div>
    </div>  
  );  
}  