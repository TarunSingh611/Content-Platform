// src/app/dashboard/analytics/page.tsx  
import { redirect } from 'next/navigation'    
import AnalyticsOverview from '@/components/analytics/AnalyticsOverview'  
import ContentPerformance from '@/components/analytics/ContentPerformance'  
import EngagementTrends from '@/components/analytics/EngagementTrends'  
import { calculateAnalytics } from '@/lib/analytics'  
import prisma from '@/lib/utils/db'
import { getServerAuthSession } from '@/lib/auth-utils'

export default async function AnalyticsPage() {  
    const session = await getServerAuthSession()

  if (!session) {  
    redirect('/auth/signin')  
  }  

  // Fetch user's content with analytics data  
  const contents = await prisma.content.findMany({  
    where: {  
      authorId: session.user.id,  
    },  
    orderBy: {  
      createdAt: 'desc'  
    },  
    include: {  
      author: {  
        select: {  
          name: true,  
          email: true,  
        }  
      }  
    }  
  })  

  const analytics = await calculateAnalytics(contents)  

  return (  
    <div className="p-6">  
      <h1 className="text-2xl font-bold mb-6">Analytics Dashboard</h1>  

      <AnalyticsOverview stats={analytics.overview} />  

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">  
        <ContentPerformance data={analytics.contentPerformance} />  
        <EngagementTrends data={analytics.engagementTrends} />  
      </div>  
    </div>  
  )  
}  