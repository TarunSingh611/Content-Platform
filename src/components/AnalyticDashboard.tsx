// components/AnalyticsDashboard.tsx  
'use client'  

import { Bar, Line } from 'react-chartjs-2'  
import {  
  Chart as ChartJS,  
  CategoryScale,  
  LinearScale,  
  BarElement,  
  LineElement,  
  Title,  
  Tooltip,  
  Legend,  
  PointElement,  
} from 'chart.js'  

ChartJS.register(  
  CategoryScale,  
  LinearScale,  
  BarElement,  
  LineElement,  
  Title,  
  Tooltip,  
  Legend,  
  PointElement  
)  

export default function AnalyticsDashboard({ data }:any) {  
  return (  
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">  
      <div className="bg-white p-6 rounded-lg shadow">  
        <h3 className="text-lg font-medium mb-4">Content Performance</h3>  
        <Bar  
          data={{  
            labels: data.labels,  
            datasets: [  
              {  
                label: 'Views',  
                data: data.views,  
                backgroundColor: 'rgba(99, 102, 241, 0.5)',  
              },  
              {  
                label: 'Likes',  
                data: data.likes,  
                backgroundColor: 'rgba(244, 63, 94, 0.5)',  
              },  
            ],  
          }}  
        />  
      </div>  

      <div className="bg-white p-6 rounded-lg shadow">  
        <h3 className="text-lg font-medium mb-4">Engagement Trends</h3>  
        <Line  
          data={{  
            labels: data.labels,  
            datasets: [  
              {  
                label: 'Engagement Rate',  
                data: data.engagement,  
                borderColor: 'rgba(99, 102, 241)',  
                tension: 0.4,  
              },  
            ],  
          }}  
        />  
      </div>  
    </div>  
  )  
}  