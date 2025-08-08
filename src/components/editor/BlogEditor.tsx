'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Youtube from '@tiptap/extension-youtube'
import CodeBlock from '@tiptap/extension-code-block'
import Highlight from '@tiptap/extension-highlight'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import Placeholder from '@tiptap/extension-placeholder'
import { useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { 
  Bold, 
  Italic, 
  Underline as UnderlineIcon, 
  Strikethrough, 
  Code, 
  Quote, 
  List, 
  ListOrdered, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  AlignJustify,
  Image as ImageIcon,
  Link as LinkIcon,
  Youtube as YoutubeIcon,
  Palette,
  Undo,
  Redo
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface BlogEditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
}

export default function BlogEditor({ content, onChange, placeholder = "Start writing your blog post..." }: BlogEditorProps) {
  const [showLinkMenu, setShowLinkMenu] = useState(false)
  const [linkUrl, setLinkUrl] = useState('')
  const [showImageMenu, setShowImageMenu] = useState(false)
  const [imageUrl, setImageUrl] = useState('')
  const [showYoutubeMenu, setShowYoutubeMenu] = useState(false)
  const [youtubeUrl, setYoutubeUrl] = useState('')

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 underline cursor-pointer',
        },
      }),
      Youtube.configure({
        inline: false,
        width: 640,
        height: 480,
      }),
      CodeBlock.configure({
        HTMLAttributes: {
          class: 'bg-gray-100 rounded-md p-4 font-mono text-sm',
        },
      }),
      Highlight.configure({
        HTMLAttributes: {
          class: 'bg-yellow-200',
        },
      }),
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
  })

  const addLink = useCallback(() => {
    if (linkUrl) {
      editor?.chain().focus().setLink({ href: linkUrl }).run()
      setLinkUrl('')
      setShowLinkMenu(false)
    }
  }, [editor, linkUrl])

  const addImage = useCallback(() => {
    if (imageUrl) {
      editor?.chain().focus().setImage({ src: imageUrl }).run()
      setImageUrl('')
      setShowImageMenu(false)
    }
  }, [editor, imageUrl])

  const addYoutube = useCallback(() => {
    if (youtubeUrl) {
      // Extract video ID from YouTube URL
      const videoId = youtubeUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)?.[1]
      if (videoId) {
        editor?.chain().focus().setYoutubeVideo({ src: `https://www.youtube.com/embed/${videoId}` }).run()
        setYoutubeUrl('')
        setShowYoutubeMenu(false)
      }
    }
  }, [editor, youtubeUrl])

  if (!editor) {
    return null
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="border-b bg-gray-50 p-2 flex flex-wrap gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={cn(editor.isActive('bold') && 'bg-gray-200')}
        >
          <Bold className="w-4 h-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={cn(editor.isActive('italic') && 'bg-gray-200')}
        >
          <Italic className="w-4 h-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={cn(editor.isActive('underline') && 'bg-gray-200')}
        >
          <UnderlineIcon className="w-4 h-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={cn(editor.isActive('strike') && 'bg-gray-200')}
        >
          <Strikethrough className="w-4 h-4" />
        </Button>
        
        <div className="w-px h-6 bg-gray-300 mx-1" />
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={cn(editor.isActive('heading', { level: 1 }) && 'bg-gray-200')}
        >
          H1
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={cn(editor.isActive('heading', { level: 2 }) && 'bg-gray-200')}
        >
          H2
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={cn(editor.isActive('heading', { level: 3 }) && 'bg-gray-200')}
        >
          H3
        </Button>
        
        <div className="w-px h-6 bg-gray-300 mx-1" />
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={cn(editor.isActive('bulletList') && 'bg-gray-200')}
        >
          <List className="w-4 h-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={cn(editor.isActive('orderedList') && 'bg-gray-200')}
        >
          <ListOrdered className="w-4 h-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={cn(editor.isActive('blockquote') && 'bg-gray-200')}
        >
          <Quote className="w-4 h-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={cn(editor.isActive('codeBlock') && 'bg-gray-200')}
        >
          <Code className="w-4 h-4" />
        </Button>
        
        <div className="w-px h-6 bg-gray-300 mx-1" />
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          className={cn(editor.isActive({ textAlign: 'left' }) && 'bg-gray-200')}
        >
          <AlignLeft className="w-4 h-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          className={cn(editor.isActive({ textAlign: 'center' }) && 'bg-gray-200')}
        >
          <AlignCenter className="w-4 h-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          className={cn(editor.isActive({ textAlign: 'right' }) && 'bg-gray-200')}
        >
          <AlignRight className="w-4 h-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().setTextAlign('justify').run()}
          className={cn(editor.isActive({ textAlign: 'justify' }) && 'bg-gray-200')}
        >
          <AlignJustify className="w-4 h-4" />
        </Button>
        
        <div className="w-px h-6 bg-gray-300 mx-1" />
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowLinkMenu(!showLinkMenu)}
        >
          <LinkIcon className="w-4 h-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowImageMenu(!showImageMenu)}
        >
          <ImageIcon className="w-4 h-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowYoutubeMenu(!showYoutubeMenu)}
        >
          <YoutubeIcon className="w-4 h-4" />
        </Button>
        
        <div className="w-px h-6 bg-gray-300 mx-1" />
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
        >
          <Undo className="w-4 h-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
        >
          <Redo className="w-4 h-4" />
        </Button>
      </div>

      {/* Link Menu */}
      {showLinkMenu && (
        <div className="border-b bg-gray-50 p-2 flex gap-2">
          <input
            type="url"
            placeholder="Enter URL..."
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            className="flex-1 px-3 py-1 border rounded text-sm"
            onKeyPress={(e) => e.key === 'Enter' && addLink()}
          />
          <Button size="sm" onClick={addLink}>Add</Button>
          <Button variant="outline" size="sm" onClick={() => setShowLinkMenu(false)}>Cancel</Button>
        </div>
      )}

      {/* Image Menu */}
      {showImageMenu && (
        <div className="border-b bg-gray-50 p-2 flex gap-2">
          <input
            type="url"
            placeholder="Enter image URL..."
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="flex-1 px-3 py-1 border rounded text-sm"
            onKeyPress={(e) => e.key === 'Enter' && addImage()}
          />
          <Button size="sm" onClick={addImage}>Add</Button>
          <Button variant="outline" size="sm" onClick={() => setShowImageMenu(false)}>Cancel</Button>
        </div>
      )}

      {/* YouTube Menu */}
      {showYoutubeMenu && (
        <div className="border-b bg-gray-50 p-2 flex gap-2">
          <input
            type="url"
            placeholder="Enter YouTube URL..."
            value={youtubeUrl}
            onChange={(e) => setYoutubeUrl(e.target.value)}
            className="flex-1 px-3 py-1 border rounded text-sm"
            onKeyPress={(e) => e.key === 'Enter' && addYoutube()}
          />
          <Button size="sm" onClick={addYoutube}>Add</Button>
          <Button variant="outline" size="sm" onClick={() => setShowYoutubeMenu(false)}>Cancel</Button>
        </div>
      )}

      {/* Editor Content */}
      <div className="p-4 min-h-[400px]">
        <EditorContent editor={editor} className="prose max-w-none" />
      </div>
    </div>
  )
}
