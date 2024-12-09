// src/app/api/teams/route.ts  
import { NextResponse } from 'next/server'  
import { getServerAuthSession } from '@/lib/auth-utils'  
import prisma from '@/lib/utils/db'


export async function POST(req: Request) {  
  try {  
    const session = await getServerAuthSession()  
    if (!session) {  
      return new NextResponse('Unauthorized', { status: 401 })  
    }  

    const data = await req.json()  
    const { name, description } = data  

    const team = await prisma.team.create({  
      data: {  
        name,  
        description,  
        members: {  
          create: {  
            userId: session.user.id,  
            role: 'OWNER'  
          }  
        }  
      }  
    })  

    return NextResponse.json(team)  
  } catch (error) {  
    console.error('Error creating team:', error)  
    return new NextResponse('Internal Server Error', { status: 500 })  
  }  
}  
