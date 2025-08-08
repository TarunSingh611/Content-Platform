'use client';
import ContentEditor from '@/components/ContentEditor';

export default function NewContentPage() {
  return (
    <div className="space-y-6">
      <ContentEditor isNew={true} />
    </div>
  );
} 