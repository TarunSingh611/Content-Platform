// src/components/ContentEditor.tsx
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

const contentSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(10, 'Content must be at least 10 characters'),
  description: z.string().optional(),
  published: z.boolean().default(false)
});

interface ContentEditorProps {
  initialContent?: {
    id?: string;
    title: string;
    content: string;
    description?: string;
    published?: boolean;
  };
  isNew?: boolean;
}

export default function ContentEditor({ initialContent, isNew = true }: ContentEditorProps) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(contentSchema),
    defaultValues: {
      title: initialContent?.title || '',
      content: initialContent?.content || '',
      description: initialContent?.description || '',
      published: initialContent?.published || false
    }
  });

  const handleSave = async (data: z.infer<typeof contentSchema>) => {
    try {
      setIsSaving(true);
      const endpoint = isNew ? '/api/content' : `/api/content/${initialContent?.id}`;
      const method = isNew ? 'POST' : 'PUT';

      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Failed to save content');

      toast.success(isNew ? 'Content created successfully!' : 'Content updated successfully!');
      router.push('/dashboard/content');
      router.refresh();
    } catch (error) {
      toast.error('Failed to save content');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">  
    <form onSubmit={handleSubmit(handleSave)}>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Title
        </label>
        <input
          {...register('title')}
          className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100/80 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
          className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100/80 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Content
        </label>
        <textarea
          {...register('content')}
          rows={10}
          className="mt-1 block w-full rounded-md border-gray-300 p-2 bg-gray-100/80 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
        {errors.content && (
          <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>
        )}
      </div>

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

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Cancel
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
  );
}