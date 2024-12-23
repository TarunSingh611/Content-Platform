// src/app/settings/change-password/page.tsx
import { getServerAuthSession } from '@/lib/auth-utils';
import { redirect } from 'next/navigation';
import ChangePasswordForm from '@/components/auth/changePasswordForm';

export default async function ChangePasswordPage() {
  const session = await getServerAuthSession();
  
  if (!session) {
    redirect('/auth');
  }

  return (
    <div className="max-w-md mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Change Password</h2>
      <ChangePasswordForm />
    </div>
  );
}