// app/(dashboard)/page.tsx  
import { FileText, Eye, BarChart2 } from 'lucide-react';  
import ContentEditor from '@/components/ContentEditor';  
import AnalyticsDashboard from '@/components/AnalyticDashboard';  
import { StatCard } from '@/components/StackCard';  

// Mock analytics data for the dashboard  
const mockAnalyticsData = {  
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],  
  views: [120, 150, 180, 145, 190, 210, 280],  
  likes: [45, 62, 71, 55, 73, 85, 94],  
  engagement: [12, 15, 18, 14, 19, 21, 28],  
};  

export default function DashboardPage() {  
  
  return (  
    <div className="space-y-8">  
      <div className="flex justify-between items-center">  
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>  
        <button className="btn-primary">New Content</button>  
      </div>  

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">  
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
      </div>  

      <ContentEditor />  
      <AnalyticsDashboard data={mockAnalyticsData} />  
    </div>  
  );  
}  