// components/analytics/EngagementTrends.tsx  
'use client'  
import { useEffect, useState } from 'react'
import { Line } from 'react-chartjs-2'  
import {  
  Chart as ChartJS,  
  CategoryScale,  
  LinearScale,  
  PointElement,  
  LineElement,  
  Title,  
  Tooltip,  
  Legend  
} from 'chart.js'  

ChartJS.register(  
  CategoryScale,  
  LinearScale,  
  PointElement,  
  LineElement,  
  Title,  
  Tooltip,  
  Legend  
)  

interface EngagementTrendsProps {  
  data: {  
    labels: string[]  
    data: number[]  
  }  
}  

export default function EngagementTrends({ data }: EngagementTrendsProps) {  
  const [engagementData, setEngagementData] = useState(data);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('all'); // Default to all time

  useEffect(() => {
    fetchEngagementTrends();
  }, [period]);

  const fetchEngagementTrends = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/analytics?period=${period}`);
      if (response.ok) {
        const analyticsData = await response.json();
        setEngagementData(analyticsData.engagementTrends || { labels: [], data: [] });
      }
    } catch (error) {
      console.error('Error fetching engagement trends:', error);
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

  if (!engagementData || engagementData.data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="text-center py-8">
          <p className="text-gray-500">No engagement trends data available</p>
        </div>
      </div>
    );
  }

  const chartData = {  
    labels: engagementData.labels,  
    datasets: [  
      {  
        label: 'Engagement Trend',  
        data: engagementData.data,  
        borderColor: 'rgb(99, 102, 241)',  
        backgroundColor: 'rgba(99, 102, 241, 0.1)',  
        fill: true,  
        tension: 0.4,
      },  
    ],  
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
  };

  // Calculate engagement metrics
  const maxEngagement = Math.max(...engagementData.data);
  const minEngagement = Math.min(...engagementData.data);
  const avgEngagement = engagementData.data.reduce((sum, val) => sum + val, 0) / engagementData.data.length;
  const growthRate = engagementData.data.length > 1 
    ? ((engagementData.data[engagementData.data.length - 1] - engagementData.data[0]) / engagementData.data[0] * 100)
    : 0;

  return (  
    <div className="bg-white rounded-lg shadow-lg p-6">  
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Engagement Trends</h2>
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
        <Line data={chartData} options={options} />
      </div>
      <div className="mt-4 grid grid-cols-4 gap-4">
        <div className="text-center">
          <p className="text-2xl font-bold text-indigo-600">{maxEngagement.toFixed(1)}%</p>
          <p className="text-sm text-gray-600">Peak</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-600">{minEngagement.toFixed(1)}%</p>
          <p className="text-sm text-gray-600">Lowest</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-green-600">{avgEngagement.toFixed(1)}%</p>
          <p className="text-sm text-gray-600">Average</p>
        </div>
        <div className="text-center">
          <p className={`text-2xl font-bold ${growthRate >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {growthRate >= 0 ? '+' : ''}{growthRate.toFixed(1)}%
          </p>
          <p className="text-sm text-gray-600">Growth</p>
        </div>
      </div>

      {/* Engagement Insights */}
      <div className="mt-6">
        <h3 className="text-md font-medium mb-3">Engagement Insights</h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
            <div>
              <p className="text-sm font-medium text-green-800">Best Day</p>
              <p className="text-xs text-green-600">
                {engagementData.labels[engagementData.data.indexOf(maxEngagement)]} - {maxEngagement.toFixed(1)}% engagement
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-green-800">Peak Performance</p>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
            <div>
              <p className="text-sm font-medium text-blue-800">Average Engagement</p>
              <p className="text-xs text-blue-600">{avgEngagement.toFixed(1)}% over {engagementData.labels.length} days</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-blue-800">Consistent</p>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
            <div>
              <p className="text-sm font-medium text-yellow-800">Growth Trend</p>
              <p className="text-xs text-yellow-600">
                {growthRate >= 0 ? 'Positive' : 'Negative'} growth over period
              </p>
            </div>
            <div className="text-right">
              <p className={`text-sm font-semibold ${growthRate >= 0 ? 'text-green-800' : 'text-red-800'}`}>
                {growthRate >= 0 ? 'Improving' : 'Declining'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>  
  )  
}  