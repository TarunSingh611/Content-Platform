// components/StatCard.tsx  
import { LucideIcon } from 'lucide-react';  

interface StatCardProps {  
  title: string;  
  value: string;  
  change: string;  
  icon: LucideIcon;  
}  

export function StatCard({ title, value, change, icon: Icon }: StatCardProps) {  
  const isPositive = change.startsWith('+');  

  return (  
    <div className="rounded-lg bg-white p-6 shadow-lg">  
      <div className="flex items-center justify-between">  
        <div className="flex items-center">  
          <div className="rounded-full bg-indigo-100 p-3">  
            <Icon className="h-6 w-6 text-indigo-600" />  
          </div>  
          <h3 className="ml-3 text-lg font-medium text-gray-900">{title}</h3>  
        </div>  
        <span  
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${  
            isPositive  
              ? 'bg-green-100 text-green-800'  
              : 'bg-red-100 text-red-800'  
          }`}  
        >  
          {change}  
        </span>  
      </div>  
      <p className="mt-4 text-3xl font-semibold text-gray-900">{value}</p>  
    </div>  
  );  
}  