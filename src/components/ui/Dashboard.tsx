// components/ui/Dashboard.tsx  
export function Dashboard() {  
    return (  
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">  
        <div className="col-span-full lg:col-span-2">  
          <div className="rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 p-6 shadow-lg">  
            <h2 className="text-2xl font-bold text-white">Content Performance</h2>  
            <PerformanceChart className="mt-4 h-64" />  
          </div>  
        </div>  
  
        <div className="space-y-4">  
          <MetricsCard />  
          <ActivityFeed />  
        </div>  
      </div>  
    );  
  }  