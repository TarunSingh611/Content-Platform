// components/analytics/AnalyticsOverview.tsx  
'use client'  
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/solid'  

interface AnalyticsOverviewProps {  
  stats: {  
    totalViews: number
    totalLikes: number
    totalShares: number
    totalComments: number
    avgEngagement: number
    growthRate: number
  }  
}  

export default function AnalyticsOverview({ stats }: AnalyticsOverviewProps) {  
  return (  
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">  
      <div className="bg-white rounded-lg shadow p-6">  
        <div className="flex items-center justify-between">  
          <div>  
            <p className="text-sm font-medium text-gray-600">Total Views</p>  
            <p className="text-2xl font-semibold mt-2">{stats.totalViews.toLocaleString()}</p>  
          </div>  
          <div className="flex items-center text-green-500">  
            <ArrowUpIcon className="w-4 h-4" />  
            <span className="ml-1">{stats.growthRate}%</span>  
          </div>  
        </div>  
      </div>  

      <div className="bg-white rounded-lg shadow p-6">  
        <div className="flex items-center justify-between">  
          <div>  
            <p className="text-sm font-medium text-gray-600">Total Likes</p>  
            <p className="text-2xl font-semibold mt-2">{stats.totalLikes.toLocaleString()}</p>  
          </div>  
          <div className="flex items-center text-green-500">  
            <ArrowUpIcon className="w-4 h-4" />  
            <span className="ml-1">18%</span>  
          </div>  
        </div>  
      </div>  

      <div className="bg-white rounded-lg shadow p-6">  
        <div className="flex items-center justify-between">  
          <div>  
            <p className="text-sm font-medium text-gray-600">Engagement Rate</p>  
            <p className="text-2xl font-semibold mt-2">{stats.avgEngagement}%</p>  
          </div>  
          <div className="flex items-center text-green-500">  
            <ArrowUpIcon className="w-4 h-4" />  
            <span className="ml-1">6%</span>  
          </div>  
        </div>  
      </div>  
    </div>  
  )  
}  