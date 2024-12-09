// components/dashboard/ContentList.tsx  
import { Content } from '@prisma/client'  
import Link from 'next/link'  

interface ContentListProps {  
  contents: Content[]  
}  

export default function ContentList({ contents }: ContentListProps) {  
  return (  
    <div className="bg-white shadow rounded-lg">  
      <ul className="divide-y divide-gray-200">  
        {contents.map((content) => (  
          <li key={content.id} className="p-4 hover:bg-gray-50">  
            <Link href={`/dashboard/${content.id}`}>  
              <div className="flex items-center justify-between">  
                <div>  
                  <h3 className="text-lg font-medium">{content.title}</h3>  
                  <p className="text-sm text-gray-500">  
                    {new Date(content.createdAt).toLocaleDateString()}  
                  </p>  
                </div>  
                <div className="flex items-center">  
                  <span className={`px-2 py-1 text-xs rounded-full ${  
                    content.published   
                      ? 'bg-green-100 text-green-800'   
                      : 'bg-yellow-100 text-yellow-800'  
                  }`}>  
                    {content.published ? 'Published' : 'Draft'}  
                  </span>  
                </div>  
              </div>  
            </Link>  
          </li>  
        ))}  
      </ul>  
    </div>  
  )  
}  