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
    <div className="mobile-card hover:shadow-lg transition-shadow duration-200 touch-target relative md:flex  flex-col md:flex-row">  
      <div className="flex items-center justify-between">  
        <div className="flex items-center">  
          <div className="rounded-full bg-indigo-100 p-1 sm:p-2">  
            <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-indigo-600" />  
          </div>  
          <h3 className="ml-2 sm:ml-3 mobile-text-base font-medium text-gray-900">{title}</h3>  
        </div>  
        <span  
          className={`absolute right-1 top-1 rounded-full px-1 py-0.2 sm:px-1.5 sm:py-0.2 mobile-text-xs font-medium ${  
            isPositive  
              ? 'bg-green-100 text-green-800'  
              : 'bg-red-100 text-red-800'  
          }`}  
        >  
          {change}  
        </span>  
      </div>  
      <p className="mt-4 mobile-text-lg font-semibold text-gray-900 ml-4">{value}</p>  
    </div>  
  );  
}  