// app/api/media/route.ts  
import { getServerAuthSession } from '@/lib/auth-utils'
import { uploadToStorage } from '@/lib/utils/storage'
import prisma from '@/lib/utils/db'
import { NextResponse } from 'next/server'   

export async function POST(request: Request) {  
  try {  
    const session = await getServerAuthSession() 
    if (!session) {  
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })  
    }  

    const formData = await request.formData()  
    const file = formData.get('file') as File  

    // Handle file upload to your storage service  
    const uploadedFile = await uploadToStorage(file)  

    const media = await prisma.media.create({  
      data: {  
        title: file.name,  
        type: file.type,  
        url: uploadedFile.url,  
        thumbnail: uploadedFile.thumbnail,  
        size: file.size,  
        format: file.type,  
        userId: session.user.id  
      }  
    })  

    return NextResponse.json(media)  
  } catch (error) {  
    console.error('Media upload error:', error)  
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })  
  }  
}  