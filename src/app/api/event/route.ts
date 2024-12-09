// app/api/events/route.ts  
import { NextResponse } from 'next/server'  
import { getServerAuthSession } from '@/lib/auth-utils'
import prisma from '@/lib/utils/db'

export async function POST(request: Request) {  
  try {  
    const session = await getServerAuthSession()
    if (!session) {  
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })  
    }  

    const data = await request.json()  

    const event = await prisma.event.create({  
      data: {  
        ...data,  
        userId: session.user.id  
      }  
    })  

    return NextResponse.json(event)  
  } catch (error) {  
    console.error('Event creation error:', error)  
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })  
  }
}