// src/app/dashboard/teams/page.tsx  
import { redirect } from 'next/navigation'  
import { getServerAuthSession } from '@/lib/auth-utils'  
import TeamsContent from '@/components/teams/TeamContent'  
import prisma from '@/lib/utils/db'

export default async function TeamsPage() {  
  const session = await getServerAuthSession()  

  if (!session) {  
    redirect('/auth/signin')  
  }  

  const teams = await prisma.team.findMany({  
    where: {  
      members: {  
        some: {  
          userId: session.user.id  
        }  
      }  
    },  
    include: {  
      members: {  
        include: {  
          user: true  
        }  
      }  
    }  
  })  

  return <TeamsContent initialTeams={teams} />  
}  


