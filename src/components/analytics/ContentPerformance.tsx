// components/analytics/ContentPerformance.tsx  
'use client'  
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
  }>
}  

export default function ContentPerformance({ data }: ContentPerformanceProps) {  
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
  const labels = data.map(item => item.title.substring(0, 20) + (item.title.length > 20 ? '...' : ''));
  const views = data.map(item => item.views);
  const engagement = data.map(item => item.engagement);

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
        <select className="text-sm border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500">  
          <option>Last 7 days</option>  
          <option>Last 30 days</option>  
          <option>Last 90 days</option>  
        </select>  
      </div>  

      <div className="h-[300px]">  
        <Bar data={chartData} options={options} />  
      </div>  

      <div className="mt-6 grid grid-cols-2 gap-4">  
        <div className="bg-gray-50 p-4 rounded-lg">  
          <p className="text-sm text-gray-600">Best Performing</p>  
          <p className="text-lg font-semibold mt-1">  
            {data[maxViewsIndex]?.title.substring(0, 25) + (data[maxViewsIndex]?.title.length > 25 ? '...' : '')}
          </p>  
          <p className="text-sm text-gray-500">{data[maxViewsIndex]?.views.toLocaleString()} views</p>
        </div>  
        <div className="bg-gray-50 p-4 rounded-lg">  
          <p className="text-sm text-gray-600">Needs Improvement</p>  
          <p className="text-lg font-semibold mt-1">  
            {data[minViewsIndex]?.title.substring(0, 25) + (data[minViewsIndex]?.title.length > 25 ? '...' : '')}
          </p>  
          <p className="text-sm text-gray-500">{data[minViewsIndex]?.views.toLocaleString()} views</p>
        </div>  
      </div>  
    </div>  
  )  
}  