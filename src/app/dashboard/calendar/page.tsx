// app/dashboard/calendar/page.tsx  
import { redirect } from 'next/navigation'  
import { getServerAuthSession } from '@/lib/auth-utils'  
import prisma from '@/lib/utils/db'  
import CalendarContent from './CalenderContent'  

export default async function CalendarPage() {  
  const session = await getServerAuthSession()  

  if (!session) {  
    redirect('/auth/signin')  
  }  

  const events = await prisma.event.findMany({  
    where: {  
      userId: session.user.id  
    }  
  })  

  return <CalendarContent initialEvents={events} />  
}  