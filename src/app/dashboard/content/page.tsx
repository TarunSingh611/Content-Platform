// src/app/dashboard/content/page.tsx
'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface Content {
  id: string;
  title: string;
  description: string;
  published: boolean;
  createdAt: string;
}

export default function ContentPage() {
  const router = useRouter();
  const [contents, setContents] = useState<Content[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchContents();
  }, []);

  const fetchContents = async () => {
    try {
      const response = await fetch('/api/content');
      if (!response.ok) throw new Error('Failed to fetch contents');
      const data = await response.json();
      setContents(data);
    } catch (error) {
      toast.error('Failed to load contents');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this content?')) return;

    try {
      const response = await fetch(`/api/content/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete content');

      toast.success('Content deleted successfully');
      fetchContents(); // Refresh the list
    } catch (error) {
      toast.error('Failed to delete content');
    }
  };

  if (isLoading) {
    return <div className="p-6">Loading...</div>;
  }

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
                  Description
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
              {contents.map((content) => (
                <tr key={content.id}>
                  <td className="px-6 py-4 whitespace-nowrap overflow-hidden text-ellipsis max-w-[150px]">
                    <div className="text-sm font-medium text-gray-900">
                      {content.title}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap overflow-hidden text-ellipsis max-w-[150px]">
                    <div className="text-sm text-gray-500">
                      {content.description}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap overflow-hidden text-ellipsis max-w-[80px]">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        content.published
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {content.published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap overflow-hidden text-ellipsis max-w-[100px] text-sm text-gray-500">
                    {new Date(content.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap overflow-hidden text-ellipsis max-w-[200px] text-sm font-medium">
                    <Link
                      href={`/dashboard/content/${content.id}`}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(content.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}