// app/dashboard/media/page.tsx  
import { redirect } from 'next/navigation'   
import MediaGrid from '@/components/media/MediaGrid'  
import MediaUpload from '@/components/media/MediaUpload'  
import MediaFilters from '@/components/media/MediaFilters'  
import { getServerAuthSession } from '@/lib/auth-utils'
import prisma from '@/lib/utils/db'

export default async function MediaPage() {  
    const session = await getServerAuthSession()

  if (!session) {  
    redirect('/auth/signin')  
  }  

  const media = await prisma.media.findMany({  
    where: {  
      userId: session.user.id  
    },  
    orderBy: {  
      createdAt: 'desc'  
    }  
  })  

  return (  
    <div className="p-6">  
      <div className="flex justify-between items-center mb-6">  
        <h1 className="text-2xl font-bold">Media Library</h1>  
        <MediaUpload />  
      </div>  

      <MediaFilters />  
      <MediaGrid media={media} />  
    </div>  
  )  
}  