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
    trends: number[]  
  }  
}  

export default function EngagementTrends({ data }: EngagementTrendsProps) {  
  const chartData = {  
    labels: data.labels,  
    datasets: [  
      {  
        label: 'Engagement Trend',  
        data: data.trends,  
        borderColor: 'rgb(99, 102, 241)',  
        backgroundColor: 'rgba(99, 102, 241, 0.1)',  
        fill: true,  
      },  
    ],  
  }  

  return (  
    <div className="bg-white rounded-lg shadow p-6">  
      <h2 className="text-lg font-semibold mb-4">Engagement Trends</h2>  
      <Line   
        data={chartData}  
        options={{  
          responsive: true,  
          scales: {  
            y: {  
              beginAtZero: true,  
            },  
          },  
        }}  
      />  
    </div>  
  )  
}  