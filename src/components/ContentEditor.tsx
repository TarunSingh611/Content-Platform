// components/ContentEditor.tsx  
'use client'  
  
import { useState } from 'react'  
import { useForm } from 'react-hook-form'  
import { zodResolver } from '@hookform/resolvers/zod'  
import * as z from 'zod'  
import toast from 'react-hot-toast'  
import { optimizeContent } from '@/lib/ai/gemini'  
import { useRouter } from 'next/navigation'  
import { Tag, Image, FileText, Eye, EyeOff, Save, Download, Share2, Settings, ArrowLeft, Menu } from 'lucide-react'
import BlogEditor from './editor/BlogEditor'
import { Button } from './ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
  
const contentSchema = z.object({  
  title: z.string().min(1, 'Title is required'),  
  content: z.string().min(10, 'Content must be at least 10 characters'),  
  description: z.string().optional(),  
  excerpt: z.string().optional(),
  coverImage: z.string().optional(),
  tags: z.array(z.string()).default([]),
  published: z.boolean().default(false),
  featured: z.boolean().default(false),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  seoKeywords: z.array(z.string()).default([])
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
    seoTitle?: string
    seoDescription?: string
    seoKeywords?: string[]
  };  
  isNew?: boolean  
}  
  
export default function ContentEditor({ initialContent, isNew = true }: ContentEditorProps) {  
  const router = useRouter()  
  const [isOptimizing, setIsOptimizing] = useState(false)  
  const [isSaving, setIsSaving] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [tagInput, setTagInput] = useState('')
  const [seoKeywordInput, setSeoKeywordInput] = useState('')
  const [activeTab, setActiveTab] = useState<'content' | 'settings' | 'seo'>('content')
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  
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
      featured: initialContent?.featured || false,
      seoTitle: initialContent?.seoTitle || '',
      seoDescription: initialContent?.seoDescription || '',
      seoKeywords: initialContent?.seoKeywords || []
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

  const handleAddSeoKeyword = () => {
    if (seoKeywordInput.trim() && !watchedValues.seoKeywords?.includes(seoKeywordInput.trim())) {
      setValue('seoKeywords', [...(watchedValues.seoKeywords || []), seoKeywordInput.trim()])
      setSeoKeywordInput('')
    }
  }

  const handleRemoveSeoKeyword = (keywordToRemove: string) => {
    setValue('seoKeywords', watchedValues.seoKeywords?.filter(keyword => keyword !== keywordToRemove) || [])
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
    <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="border-b p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="p-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold">{isNew ? 'Create New Content' : 'Edit Content'}</h1>
              <p className="text-sm text-gray-600 mt-1">Write and publish your content</p>
            </div>
          </div>
          
          {/* Mobile Menu Button */}
          <div className="flex items-center space-x-2 sm:hidden">
            <Button
              variant="outline"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="p-2"
            >
              <Menu className="w-5 h-5" />
            </Button>
          </div>
          
          {/* Desktop Actions */}
          <div className="hidden sm:flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowPreview(!showPreview)}
              className="flex items-center gap-2"
            >
              {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              <span className="hidden lg:inline">{showPreview ? 'Hide Preview' : 'Show Preview'}</span>
            </Button>
            <Button
              type="submit"
              disabled={isSaving}
              onClick={handleSubmit(handleSave)}
              className="flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span className="hidden lg:inline">{isSaving ? 'Saving...' : isNew ? 'Create' : 'Update'}</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="sm:hidden border-b p-4 bg-gray-50">
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              onClick={() => setShowPreview(!showPreview)}
              size="sm"
              className="flex items-center gap-2"
            >
              {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {showPreview ? 'Hide Preview' : 'Preview'}
            </Button>
            <Button
              type="submit"
              disabled={isSaving}
              onClick={handleSubmit(handleSave)}
              size="sm"
              className="flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {isSaving ? 'Saving...' : isNew ? 'Create' : 'Update'}
            </Button>
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="border-b">
        <div className="flex overflow-x-auto">
          <button
            onClick={() => setActiveTab('content')}
            className={cn(
              "flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap",
              activeTab === 'content' 
                ? "border-indigo-500 text-indigo-600 bg-indigo-50" 
                : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            )}
          >
            <FileText className="w-4 h-4" />
            <span className="hidden sm:inline">Content</span>
            <span className="sm:hidden">Write</span>
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={cn(
              "flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap",
              activeTab === 'settings' 
                ? "border-indigo-500 text-indigo-600 bg-indigo-50" 
                : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            )}
          >
            <Settings className="w-4 h-4" />
            <span className="hidden sm:inline">Settings</span>
            <span className="sm:hidden">Settings</span>
          </button>
          <button
            onClick={() => setActiveTab('seo')}
            className={cn(
              "flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap",
              activeTab === 'seo' 
                ? "border-indigo-500 text-indigo-600 bg-indigo-50" 
                : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            )}
          >
            <Share2 className="w-4 h-4" />
            <span className="hidden sm:inline">SEO</span>
            <span className="sm:hidden">SEO</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit(handleSave)} className="p-4 sm:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {activeTab === 'content' && (
              <>
                <div>  
                  <label className="block text-sm font-medium text-gray-700 mb-2">  
                    Title *  
                  </label>  
                  <Input  
                    {...register('title')}  
                    placeholder="Enter your content title..."
                    className="text-base"
                  />  
                  {errors.title && (  
                    <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>  
                  )}  
                </div>  

                <div>  
                  <label className="block text-sm font-medium text-gray-700 mb-2">  
                    Description  
                  </label>  
                  <Input  
                    {...register('description')}  
                    placeholder="Brief description of your content..."
                    className="text-base"
                  />  
                </div>  

                <div>  
                  <label className="block text-sm font-medium text-gray-700 mb-2">  
                    Content *  
                  </label>  
                  <BlogEditor
                    content={watchedValues.content}
                    onChange={(content) => setValue('content', content)}
                    placeholder="Start writing your blog post..."
                  />
                  {errors.content && (  
                    <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>  
                  )}  
                </div>  
              </>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-6">
                {/* Cover Image */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Image className="inline w-4 h-4 mr-1" />
                    Cover Image URL
                  </label>
                  <Input
                    {...register('coverImage')}
                    placeholder="https://example.com/image.jpg"
                    className="text-base"
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
                    className="block w-full rounded-md border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-base text-gray-900 dark:text-gray-100 ring-offset-white dark:ring-offset-gray-900 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                  />
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Tag className="inline w-4 h-4 mr-1" />
                    Tags
                  </label>
                  <div className="flex flex-col sm:flex-row gap-2 mb-2">
                    <Input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                      placeholder="Add a tag..."
                      className="flex-1 text-base"
                    />
                    <Button
                      type="button"
                      onClick={handleAddTag}
                      size="sm"
                      className="whitespace-nowrap"
                    >
                      Add Tag
                    </Button>
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
            )}

            {activeTab === 'seo' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SEO Title
                  </label>
                  <Input
                    {...register('seoTitle')}
                    placeholder="SEO optimized title..."
                    className="text-base"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SEO Description
                  </label>
                  <textarea
                    {...register('seoDescription')}
                    rows={3}
                    placeholder="SEO meta description..."
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-base"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SEO Keywords
                  </label>
                  <div className="flex flex-col sm:flex-row gap-2 mb-2">
                    <input
                      type="text"
                      value={seoKeywordInput}
                      onChange={(e) => setSeoKeywordInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSeoKeyword())}
                      placeholder="Add a keyword..."
                      className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-base"
                    />
                    <Button
                      type="button"
                      onClick={handleAddSeoKeyword}
                      size="sm"
                      className="whitespace-nowrap"
                    >
                      Add Keyword
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {watchedValues.seoKeywords?.map((keyword, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"
                      >
                        {keyword}
                        <button
                          type="button"
                          onClick={() => handleRemoveSeoKeyword(keyword)}
                          className="ml-1 text-green-600 hover:text-green-800"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <Button
                  type="button"
                  onClick={handleSubmit(handleOptimize)}
                  disabled={isOptimizing}
                  variant="outline"
                  className="w-full"
                >
                  {isOptimizing ? 'Optimizing...' : 'Optimize Content'}
                </Button>
                <Button
                  type="submit"
                  disabled={isSaving}
                  className="w-full"
                >
                  {isSaving ? 'Saving...' : isNew ? 'Create Content' : 'Update Content'}
                </Button>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium mb-4">Content Stats</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Words:</span>
                  <span>{watchedValues.content.split(/\s+/).filter(word => word.length > 0).length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Characters:</span>
                  <span>{watchedValues.content.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tags:</span>
                  <span>{watchedValues.tags?.length || 0}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Preview */}
        {showPreview && (
          <div className="border-t pt-6 mt-6">
            <h3 className="text-lg font-medium mb-4">Preview</h3>
            <div className="bg-gray-50 p-4 sm:p-6 rounded-lg">
              <h1 className="text-xl sm:text-2xl font-bold mb-4">{watchedValues.title}</h1>
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
                <div dangerouslySetInnerHTML={{ __html: watchedValues.content }} />
              </div>
            </div>
          </div>
        )}

        {/* Mobile Action Bar */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 lg:hidden z-50">
          <div className="flex justify-between items-center">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              size="sm"
            >  
              Cancel  
            </Button>  
              
            <Button
              type="submit"
              disabled={isSaving}
              size="sm"
            >  
              {isSaving ? 'Saving...' : isNew ? 'Create' : 'Update'}  
            </Button>  
          </div>
        </div>

        {/* Desktop Action Bar */}
        <div className="hidden lg:flex justify-end space-x-4 mt-6 pt-6 border-t">  
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >  
            Cancel  
          </Button>  
            
          <Button
            type="submit"
            disabled={isSaving}
          >  
            {isSaving ? 'Saving...' : isNew ? 'Create' : 'Update'}  
          </Button>  
        </div>  
      </form>  
    </div>  
  )  
}  