// components/dashboard/DashboardStats.tsx  
interface DashboardStatsProps {  
    stats: {  
      totalContent: number  
      publishedContent: number  
      totalViews: number  
      engagementRate: string  
    }  
  }  
  
  export default function DashboardStats({ stats }: DashboardStatsProps) {  
    return (  
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">  
        <div className="bg-white p-6 rounded-lg shadow">  
          <h3 className="text-sm font-medium text-gray-500">Total Content</h3>  
          <p className="mt-2 text-3xl font-semibold">{stats.totalContent}</p>  
        </div>  
        <div className="bg-white p-6 rounded-lg shadow">  
          <h3 className="text-sm font-medium text-gray-500">Published</h3>  
          <p className="mt-2 text-3xl font-semibold">{stats.publishedContent}</p>  
        </div>  
        <div className="bg-white p-6 rounded-lg shadow">  
          <h3 className="text-sm font-medium text-gray-500">Total Views</h3>  
          <p className="mt-2 text-3xl font-semibold">{stats.totalViews}</p>  
        </div>  
        <div className="bg-white p-6 rounded-lg shadow">  
          <h3 className="text-sm font-medium text-gray-500">Engagement Rate</h3>  
          <p className="mt-2 text-3xl font-semibold">{stats.engagementRate}</p>  
        </div>  
      </div>  
    )  
  }  