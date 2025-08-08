// components/analytics/ContentPerformance.tsx  
'use client'  
import { useEffect, useState } from 'react'
import { Bar } from 'react-chartjs-2'  
import {  
  Chart as ChartJS,  
  CategoryScale,  
  LinearScale,  
  BarElement,  
  Title,  
  Tooltip,  
  Legend  
} from 'chart.js'  

ChartJS.register(  
  CategoryScale,  
  LinearScale,  
  BarElement,  
  Title,  
  Tooltip,  
  Legend  
)  

interface ContentPerformanceProps {  
  data: Array<{
    id: string;
    title: string;
    views: number;
    engagement: number;
    likes: number;
    shares: number;
    comments: number;
    createdAt: string;
    tags: string[];
  }>
}  

export default function ContentPerformance({ data }: ContentPerformanceProps) {  
  const [contentData, setContentData] = useState(data);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('all'); // Default to all time

  useEffect(() => {
    fetchContentPerformance();
  }, [period]);

  const fetchContentPerformance = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/analytics?period=${period}`);
      if (response.ok) {
        const analyticsData = await response.json();
        setContentData(analyticsData.contentPerformance || []);
      }
    } catch (error) {
      console.error('Error fetching content performance:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    );
  }

  if (!contentData || contentData.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="text-center py-8">
          <p className="text-gray-500">No content performance data available</p>
        </div>
      </div>
    );
  }

  const options = {  
    responsive: true,  
    plugins: {  
      legend: {  
        position: 'top' as const,  
      },  
      title: {  
        display: false,  
      },  
    },  
    scales: {  
      x: {  
        grid: {  
          display: false,  
        },  
      },  
      y: {  
        beginAtZero: true,  
        grid: {  
          color: 'rgba(0, 0, 0, 0.1)',  
        },  
      },  
    },  
    maintainAspectRatio: false,  
  }  

  // Transform data for chart
  const labels = contentData.map(item => item.title.substring(0, 20) + (item.title.length > 20 ? '...' : ''));
  const views = contentData.map(item => item.views);
  const engagement = contentData.map(item => item.engagement);

  const chartData = {  
    labels: labels,  
    datasets: [  
      {  
        label: 'Views',  
        data: views,  
        backgroundColor: 'rgba(79, 70, 229, 0.6)',  
        borderColor: 'rgb(79, 70, 229)',  
        borderWidth: 1,  
        borderRadius: 4,  
      },  
      {  
        label: 'Engagement (%)',  
        data: engagement,  
        backgroundColor: 'rgba(16, 185, 129, 0.6)',  
        borderColor: 'rgb(16, 185, 129)',  
        borderWidth: 1,  
        borderRadius: 4,  
      },  
    ],  
  }  

  // Find best and worst performing content
  const maxViewsIndex = views.indexOf(Math.max(...views));
  const minViewsIndex = views.indexOf(Math.min(...views));

  return (  
    <div className="bg-white rounded-lg shadow-lg p-6">  
      <div className="flex items-center justify-between mb-6">  
        <h2 className="text-lg font-semibold text-gray-900">Content Performance</h2>  
        <select 
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="text-sm border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >  
          <option value="all">All Time</option>
          <option value="7">Last 7 days</option>  
          <option value="30">Last 30 days</option>  
          <option value="90">Last 90 days</option>  
        </select>  
      </div>  

      <div className="h-[300px]">  
        <Bar data={chartData} options={options} />  
      </div>  

      <div className="mt-6 grid grid-cols-2 gap-4">  
        <div className="bg-gray-50 p-4 rounded-lg">  
          <p className="text-sm text-gray-600">Best Performing</p>  
          <p className="text-lg font-semibold mt-1">  
            {contentData[maxViewsIndex]?.title.substring(0, 25) + (contentData[maxViewsIndex]?.title.length > 25 ? '...' : '')}
          </p>  
          <p className="text-sm text-gray-500">{contentData[maxViewsIndex]?.views.toLocaleString()} views</p>
          <p className="text-xs text-green-600">{contentData[maxViewsIndex]?.engagement}% engagement</p>
        </div>  
        <div className="bg-gray-50 p-4 rounded-lg">  
          <p className="text-sm text-gray-600">Needs Improvement</p>  
          <p className="text-lg font-semibold mt-1">  
            {contentData[minViewsIndex]?.title.substring(0, 25) + (contentData[minViewsIndex]?.title.length > 25 ? '...' : '')}
          </p>  
          <p className="text-sm text-gray-500">{contentData[minViewsIndex]?.views.toLocaleString()} views</p>
          <p className="text-xs text-red-600">{contentData[minViewsIndex]?.engagement}% engagement</p>
        </div>  
      </div>  

      {/* Content Details */}
      <div className="mt-6">
        <h3 className="text-md font-medium mb-3">Top Content Details</h3>
        <div className="space-y-2">
          {contentData.slice(0, 3).map((content, index) => (
            <div key={content.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <span className="text-sm font-bold text-indigo-600 mr-2">#{index + 1}</span>
                <div>
                  <p className="text-sm font-medium text-gray-900">{content.title}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(content.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-900">{content.views.toLocaleString()}</p>
                <p className="text-xs text-gray-500">{content.engagement}% engagement</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>  
  )  
}  