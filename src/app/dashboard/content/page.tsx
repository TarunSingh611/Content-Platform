// src/app/dashboard/content/page.tsx   
import { redirect } from 'next/navigation'    
import Link from 'next/link'  
import { getServerAuthSession } from '@/lib/auth-utils'
import prisma from '@/lib/utils/db';
  
export default async function ContentPage() {  
    const session = await getServerAuthSession();

    if (!session) {
      redirect('/auth');
    }
  const contents = await prisma.content.findMany({  
    where: {  
      authorId: session.user.id,  
    },  
    orderBy: {  
      createdAt: 'desc'  
    },  
    include: {  
      author: {  
        select: {  
          name: true,  
          email: true,  
        }  
      }  
    }  
  })  
  
  return (  
    <div className="p-6">  
      <div className="flex justify-between items-center mb-6">  
        <h1 className="text-2xl font-bold">Content Management</h1>  
        <Link   
          href="/dashboard/content/new"   
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"  
        >  
          Create New Content  
        </Link>  
      </div>  
  
      <div className="bg-white rounded-lg shadow">  
        <div className="overflow-x-auto">  
          <table className="min-w-full divide-y divide-gray-200">  
            <thead className="bg-gray-50">  
              <tr>  
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">  
                  Title  
                </th>  
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">  
                  Status  
                </th>  
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">  
                  Created  
                </th>  
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">  
                  Actions  
                </th>  
              </tr>  
            </thead>  
            <tbody className="bg-white divide-y divide-gray-200">  
              {contents.map((content:any) => (  
                <tr key={content.id}>  
                  <td className="px-6 py-4 whitespace-nowrap">  
                    <div className="text-sm font-medium text-gray-900">  
                      {content.title}  
                    </div>  
                  </td>  
                  <td className="px-6 py-4 whitespace-nowrap">  
                    <span className={`px-2 py-1 text-xs rounded-full ${  
                      content.published   
                        ? 'bg-green-100 text-green-800'   
                        : 'bg-yellow-100 text-yellow-800'  
                    }`}>  
                      {content.published ? 'Published' : 'Draft'}  
                    </span>  
                  </td>  
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">  
                    {new Date(content.createdAt).toLocaleDateString()}  
                  </td>  
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">  
                    <Link   
                      href={`/dashboard/content/${content.id}`}  
                      className="text-indigo-600 hover:text-indigo-900 mr-4"  
                    >  
                      Edit  
                    </Link>  
                  </td>  
                </tr>  
              ))}  
            </tbody>  
          </table>  
        </div>  
      </div>  
    </div>  
  )  
}  