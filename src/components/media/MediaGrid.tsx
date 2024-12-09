// components/media/MediaGrid.tsx  
'use client'  
import Image from 'next/image'  
import { useState } from 'react'  
import MediaModal from './MediaModel'
import { formatBytes } from '@/lib/utils'  

export default function MediaGrid({ media }:any) {  
  const [selectedMedia, setSelectedMedia] = useState(null)  

  return (  
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">  
      {media.map((item:any) => (  
        <div   
          key={item.id}   
          className="relative group cursor-pointer rounded-lg overflow-hidden"  
          onClick={() => setSelectedMedia(item)}  
        >  
          <Image  
            src={item.thumbnail || item.url}  
            alt={item.title}  
            width={300}  
            height={200}  
            className="object-cover w-full h-48"  
          />  
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all">  
            <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-all">  
              <p className="font-medium">{item.title}</p>  
              <p className="text-sm">{formatBytes(item.size)}</p>  
            </div>  
          </div>  
        </div>  
      ))}  

      {selectedMedia && (  
        <MediaModal file={selectedMedia} onClose={() => setSelectedMedia(null)} />  
      )}  
    </div>  
  )  
}  