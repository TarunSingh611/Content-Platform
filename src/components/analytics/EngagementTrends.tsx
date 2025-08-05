// components/analytics/EngagementTrends.tsx  
'use client'  
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
  const chartData = {  
    labels: data.labels,  
    datasets: [  
      {  
        label: 'Engagement Trend',  
        data: data.data,  
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

  return (  
    <div className="bg-white rounded-lg shadow-lg p-6">  
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Engagement Trends</h2>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
          <span className="text-sm text-gray-600">Weekly Average</span>
        </div>
      </div>
      <div className="h-[300px]">
        <Line data={chartData} options={options} />
      </div>
      <div className="mt-4 grid grid-cols-3 gap-4">
        <div className="text-center">
          <p className="text-2xl font-bold text-indigo-600">{Math.max(...data.data)}%</p>
          <p className="text-sm text-gray-600">Peak</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-600">{Math.min(...data.data)}%</p>
          <p className="text-sm text-gray-600">Lowest</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-green-600">
            {((data.data[data.data.length - 1] - data.data[0]) / data.data[0] * 100).toFixed(1)}%
          </p>
          <p className="text-sm text-gray-600">Growth</p>
        </div>
      </div>
    </div>  
  )  
}  