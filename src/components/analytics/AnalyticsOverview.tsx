// components/analytics/AnalyticsOverview.tsx  
'use client'  
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/solid'  

interface AnalyticsOverviewProps {  
  stats: {  
    totalContent: number  
    totalViews: number  
    engagementRate: number  
    contentGrowth: number  
    viewsGrowth: number  
    engagementGrowth: number  
  }  
}  

export default function AnalyticsOverview({ stats }: AnalyticsOverviewProps) {  
  return (  
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">  
      <div className="bg-white rounded-lg shadow p-6">  
        <div className="flex items-center justify-between">  
          <div>  
            <p className="text-sm font-medium text-gray-600">Total Content</p>  
            <p className="text-2xl font-semibold mt-2">{stats.totalContent}</p>  
          </div>  
          <div className={`flex items-center ${stats.contentGrowth >= 0 ? 'text-green-500' : 'text-red-500'}`}>  
            {stats.contentGrowth >= 0 ? <ArrowUpIcon className="w-4 h-4" /> : <ArrowDownIcon className="w-4 h-4" />}  
            <span className="ml-1">{Math.abs(stats.contentGrowth)}%</span>  
          </div>  
        </div>  
      </div>  

      <div className="bg-white rounded-lg shadow p-6">  
        <div className="flex items-center justify-between">  
          <div>  
            <p className="text-sm font-medium text-gray-600">Total Views</p>  
            <p className="text-2xl font-semibold mt-2">{stats.totalViews}</p>  
          </div>  
          <div className={`flex items-center ${stats.viewsGrowth >= 0 ? 'text-green-500' : 'text-red-500'}`}>  
            {stats.viewsGrowth >= 0 ? <ArrowUpIcon className="w-4 h-4" /> : <ArrowDownIcon className="w-4 h-4" />}  
            <span className="ml-1">{Math.abs(stats.viewsGrowth)}%</span>  
          </div>  
        </div>  
      </div>  

      <div className="bg-white rounded-lg shadow p-6">  
        <div className="flex items-center justify-between">  
          <div>  
            <p className="text-sm font-medium text-gray-600">Engagement Rate</p>  
            <p className="text-2xl font-semibold mt-2">{stats.engagementRate}%</p>  
          </div>  
          <div className={`flex items-center ${stats.engagementGrowth >= 0 ? 'text-green-500' : 'text-red-500'}`}>  
            {stats.engagementGrowth >= 0 ? <ArrowUpIcon className="w-4 h-4" /> : <ArrowDownIcon className="w-4 h-4" />}  
            <span className="ml-1">{Math.abs(stats.engagementGrowth)}%</span>  
          </div>  
        </div>  
      </div>  
    </div>  
  )  
}  