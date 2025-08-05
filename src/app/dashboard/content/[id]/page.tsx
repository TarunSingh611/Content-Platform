'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ContentEditor from '@/components/ContentEditor';
import toast from 'react-hot-toast';

interface Content {
  id: string;
  title: string;
  content: string;
  description?: string;
  excerpt?: string;
  coverImage?: string;
  tags?: string[];
  published: boolean;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function EditContentPage() {
  const params = useParams();
  const router = useRouter();
  const [content, setContent] = useState<Content | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetchContent();
    }
  }, [params.id]);

  const fetchContent = async () => {
    try {
      const response = await fetch(`/api/content/${params.id}`);
      if (!response.ok) throw new Error('Failed to fetch content');
      const data = await response.json();
      setContent(data);
    } catch (error) {
      toast.error('Failed to load content');
      router.push('/dashboard/content');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">Content not found</h2>
          <p className="text-gray-600 mt-2">The content you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <ContentEditor initialContent={content} isNew={false} />
    </div>
  );
}  