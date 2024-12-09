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
  data: {  
    labels: string[]  
    views: number[]  
    engagement: number[]  
  }  
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

  const chartData = {  
    labels: data.labels,  
    datasets: [  
      {  
        label: 'Views',  
        data: data.views,  
        backgroundColor: 'rgba(79, 70, 229, 0.6)',  
        borderColor: 'rgb(79, 70, 229)',  
        borderWidth: 1,  
        borderRadius: 4,  
      },  
      {  
        label: 'Engagement',  
        data: data.engagement,  
        backgroundColor: 'rgba(16, 185, 129, 0.6)',  
        borderColor: 'rgb(16, 185, 129)',  
        borderWidth: 1,  
        borderRadius: 4,  
      },  
    ],  
  }  

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
            {data.labels[data.views.indexOf(Math.max(...data.views))]}  
          </p>  
        </div>  
        <div className="bg-gray-50 p-4 rounded-lg">  
          <p className="text-sm text-gray-600">Needs Improvement</p>  
          <p className="text-lg font-semibold mt-1">  
            {data.labels[data.views.indexOf(Math.min(...data.views))]}  
          </p>  
        </div>  
      </div>  
    </div>  
  )  
}  