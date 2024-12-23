// app/api/analytics/route.ts  
import { calculateAnalytics } from '@/lib/analytics';
import { getServerAuthSession } from '@/lib/auth-utils';
import prisma from '@/lib/utils/db';
import { redirect } from 'next/navigation';
import { NextResponse } from 'next/server'   

export async function GET() {  
  try {  
    const session = await getServerAuthSession();

    if (!session) {
      redirect('/auth');
    }

    if (!session) {  
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })  
    }  

    const contents = await prisma.content.findMany({  
      where: {  
        authorId: session.user.id,  
      },  
      orderBy: {  
        createdAt: 'desc'  
      }  
    })  

    const analytics = await calculateAnalytics(contents)  

    return NextResponse.json(analytics)  
  } catch (error) {  
    console.error('Analytics API Error:', error)  
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })  
  }  
}  