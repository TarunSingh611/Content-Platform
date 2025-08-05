// components/ContentEditor.tsx  
'use client'  
  
import { useState } from 'react'  
import { useForm } from 'react-hook-form'  
import { zodResolver } from '@hookform/resolvers/zod'  
import * as z from 'zod'  
import toast from 'react-hot-toast'  
import { optimizeContent } from '@/lib/ai/gemini'  
import { useRouter } from 'next/navigation'  
import { Tag, Image, FileText, Eye, EyeOff } from 'lucide-react'
  
const contentSchema = z.object({  
  title: z.string().min(1, 'Title is required'),  
  content: z.string().min(10, 'Content must be at least 10 characters'),  
  description: z.string().optional(),  
  excerpt: z.string().optional(),
  coverImage: z.string().optional(),
  tags: z.array(z.string()).default([]),
  published: z.boolean().default(false),
  featured: z.boolean().default(false)
});  
  
interface ContentEditorProps {  
  initialContent?: {  
    id?: string  
    title: string  
    content: string  
    description?: string  
    excerpt?: string
    coverImage?: string
    tags?: string[]
    published?: boolean  
    featured?: boolean
  };  
  isNew?: boolean  
}  
  
export default function ContentEditor({ initialContent, isNew = true }: ContentEditorProps) {  
  const router = useRouter()  
  const [isOptimizing, setIsOptimizing] = useState(false)  
  const [isSaving, setIsSaving] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [tagInput, setTagInput] = useState('')
  
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({  
    resolver: zodResolver(contentSchema),  
    defaultValues: {  
      title: initialContent?.title || '',  
      content: initialContent?.content || '',  
      description: initialContent?.description || '',  
      excerpt: initialContent?.excerpt || '',
      coverImage: initialContent?.coverImage || '',
      tags: initialContent?.tags || [],
      published: initialContent?.published || false,
      featured: initialContent?.featured || false
    }  
  })  

  const watchedValues = watch()
  
  const handleOptimize = async (data: z.infer<typeof contentSchema>) => {  
    try {  
      setIsOptimizing(true)  
      const optimizedContent = await optimizeContent(data.content)  
      setValue('content', optimizedContent)  
      toast.success('Content optimized successfully!')  
    } catch (error) {  
      toast.error('Failed to optimize content')  
    } finally {  
      setIsOptimizing(false)  
    }  
  }  

  const handleAddTag = () => {
    if (tagInput.trim() && !watchedValues.tags?.includes(tagInput.trim())) {
      setValue('tags', [...(watchedValues.tags || []), tagInput.trim()])
      setTagInput('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setValue('tags', watchedValues.tags?.filter(tag => tag !== tagToRemove) || [])
  }

  const handleSave = async (data: z.infer<typeof contentSchema>) => {  
    try {  
      setIsSaving(true)  
      const endpoint = isNew ? '/api/content' : `/api/content/${initialContent?.id}`  
      const method = isNew ? 'POST' : 'PUT'  
  
      const response = await fetch(endpoint, {  
        method,  
        headers: {  
          'Content-Type': 'application/json',  
        },  
        body: JSON.stringify(data),  
      })  
  
      if (!response.ok) throw new Error('Failed to save content')  
  
      toast.success(isNew ? 'Content created successfully!' : 'Content updated successfully!')  
      router.push('/dashboard/content')  
      router.refresh()  
    } catch (error) {  
      toast.error('Failed to save content')  
    } finally {  
      setIsSaving(false)  
    }  
  }  
  
  return (  
    <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg p-6">  
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{isNew ? 'Create New Content' : 'Edit Content'}</h1>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {showPreview ? 'Hide Preview' : 'Show Preview'}
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit(handleSave)} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <div>  
              <label className="block text-sm font-medium text-gray-700">  
                Title *  
              </label>  
              <input  
                {...register('title')}  
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"  
              />  
              {errors.title && (  
                <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>  
              )}  
            </div>  

            <div>  
              <label className="block text-sm font-medium text-gray-700">  
                Description  
              </label>  
              <input  
                {...register('description')}  
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"  
              />  
            </div>  

            <div>  
              <label className="block text-sm font-medium text-gray-700">  
                Content *  
              </label>  
              <textarea  
                {...register('content')}  
                rows={12}  
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"  
              />  
              {errors.content && (  
                <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>  
              )}  
            </div>  
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Cover Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Image className="inline w-4 h-4 mr-1" />
                Cover Image URL
              </label>
              <input
                {...register('coverImage')}
                placeholder="https://example.com/image.jpg"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
              {watchedValues.coverImage && (
                <img
                  src={watchedValues.coverImage}
                  alt="Cover preview"
                  className="mt-2 w-full h-32 object-cover rounded-md"
                />
              )}
            </div>

            {/* Excerpt */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FileText className="inline w-4 h-4 mr-1" />
                Excerpt
              </label>
              <textarea
                {...register('excerpt')}
                rows={3}
                placeholder="Brief summary of the content..."
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Tag className="inline w-4 h-4 mr-1" />
                Tags
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                  placeholder="Add a tag..."
                  className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-3 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {watchedValues.tags?.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1 text-indigo-600 hover:text-indigo-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Publish Settings */}
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  {...register('published')}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-900">
                  Published
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  {...register('featured')}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-900">
                  Featured
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Preview */}
        {showPreview && (
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium mb-4">Preview</h3>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h1 className="text-2xl font-bold mb-4">{watchedValues.title}</h1>
              {watchedValues.description && (
                <p className="text-gray-600 mb-4">{watchedValues.description}</p>
              )}
              {watchedValues.coverImage && (
                <img
                  src={watchedValues.coverImage}
                  alt="Cover"
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
              )}
              <div className="prose max-w-none">
                <div className="whitespace-pre-wrap">{watchedValues.content}</div>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end space-x-4">  
          <button  
            type="button"  
            onClick={() => router.back()}  
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"  
          >  
            Cancel  
          </button>  
            
          <button  
            type="button"  
            onClick={handleSubmit(handleOptimize)}  
            disabled={isOptimizing}  
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"  
          >  
            {isOptimizing ? 'Optimizing...' : 'Optimize Content'}  
          </button>  

          <button  
            type="submit"  
            disabled={isSaving}  
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"  
          >  
            {isSaving ? 'Saving...' : isNew ? 'Create' : 'Update'}  
          </button>  
        </div>  
      </form>  
    </div>  
  )  
}  