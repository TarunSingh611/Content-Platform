// src/app/dashboard/analytics/page.tsx  
import { redirect } from 'next/navigation'    
import AnalyticsOverview from '@/components/analytics/AnalyticsOverview'  
import { getServerAuthSession } from '@/lib/auth-utils'
import DemoRibbon from '@/components/ui/DemoRibbon';

export default async function AnalyticsPage() {  
    const session = await getServerAuthSession()

  if (!session) {  
    redirect('/auth/signin')  
  }  

  return (  
    <div className="p-6 space-y-6">  
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600 mt-1">Track your content performance and audience insights</p>
        </div>
        <DemoRibbon message="Advanced Analytics - Coming Soon!" />
      </div>

      {/* Main Analytics Overview (advanced) */}
      <AnalyticsOverview />

      {/* Upcoming Features */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Upcoming Analytics Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <DemoRibbon message="A/B Testing Analytics - Coming Soon!" />
          <DemoRibbon message="Predictive Analytics - Coming Soon!" />
          <DemoRibbon message="Custom Reports - Coming Soon!" />
          <DemoRibbon message="Real-time Notifications - Coming Soon!" />
          <DemoRibbon message="Competitor Analysis - Coming Soon!" />
          <DemoRibbon message="ROI Tracking - Coming Soon!" />
        </div>
      </div>
    </div>  
  )  
}  