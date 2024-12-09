// app/api/documents/route.ts  
import { getServerAuthSession } from '@/lib/auth-utils'
import prisma from '@/lib/utils/db'
import { NextResponse } from 'next/server'  

export async function POST(request: Request) {  
  try {  
    const session = await getServerAuthSession()
    if (!session) {  
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })  
    }  

    const data = await request.json()  

    const document = await prisma.document.create({  
      data: {  
        ...data,  
        userId: session.user.id  
      }  
    })  

    return NextResponse.json(document)  
  } catch (error) {  
    console.error('Document creation error:', error)  
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })  
  }  
}  