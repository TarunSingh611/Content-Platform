// src/app/dashboard/content/[id]/page.tsx  
import { redirect, notFound } from 'next/navigation';  
import ContentEditor from '@/components/ContentEditor';  
import { getServerAuthSession } from '@/lib/auth-utils';  
import prisma from '@/lib/utils/db';  

interface PageProps {  
  params: Promise<{ id: string }>; // Change to Promise  
}  

export default async function ContentDetailPage({ params }: PageProps) {  
  const session = await getServerAuthSession();  

  if (!session) {  
    redirect('/auth/login');  
  }  

  // Await the params to resolve the promise  
  const resolvedParams = await params;  

  // Handle new content creation  
  if (resolvedParams.id === 'new') {  
    return (  
      <div className="p-6">  
        <div className="mb-6">  
          <h1 className="text-2xl font-bold">Create New Content</h1>  
        </div>  
        <ContentEditor  
          initialContent={{  
            title: '',  
            content: '',  
            description: '',  
            published: false,  
          }}  
          isNew={true}  
        />  
      </div>  
    );  
  }  

  // Fetch existing content  
  const content = await prisma.content.findUnique({  
    where: {  
      id: resolvedParams.id,  
    },  
    include: {  
      author: {  
        select: {  
          id: true,  
          name: true,  
          email: true,  
        },  
      },  
    },  
  });  

  if (!content) {  
    notFound();  
  }  

  // Check if user is the author  
  if (content.authorId !== session.user.id) {  
    redirect('/dashboard/content');  
  }  

  return (  
    <div className="p-6">  
      <div className="mb-6">  
        <h1 className="text-2xl font-bold">Edit Content</h1>  
      </div>  
      <ContentEditor  
        initialContent={{  
          id: content.id,  
          title: content.title,  
          content: content.content,  
          description: content.description || '',  
          published: content.published,  
        }}  
        isNew={false}  
      />  
    </div>  
  );  
}  