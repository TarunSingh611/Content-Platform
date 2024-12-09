// app/dashboard/documents/page.tsx   
import { redirect } from 'next/navigation'  
import DocumentList from '@/components/documents/DocumentList'  
import DocumentCreate from '@/components/documents/DocumentCreate'  
import DocumentFilters from '@/components/documents/DocumentFilters'  
import { getServerAuthSession } from '@/lib/auth-utils'
import prisma from '@/lib/utils/db'

export default async function DocumentsPage() {  
    const session = await getServerAuthSession() 

  if (!session) {  
    redirect('/auth/signin')  
  }  

  const documents = await prisma.document.findMany({  
    where: {  
      userId: session.user.id  
    },  
    orderBy: {  
      updatedAt: 'desc'  
    }  
  })  

  return (  
    <div className="p-6">  
      <div className="flex justify-between items-center mb-6">  
        <h1 className="text-2xl font-bold">Documents</h1>  
        <DocumentCreate />  
      </div>  

      <DocumentFilters />  
      <DocumentList documents={documents} />  
    </div>  
  )  
}  