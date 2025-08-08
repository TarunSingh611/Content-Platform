// app/dashboard/layout.tsx  
import { redirect } from 'next/navigation';
import Sidebar from '@/components/dashboard/Sidebar';
import Header from '@/components/dashboard/Header';
import MobileNav from '@/components/dashboard/MobileNav';
import { getServerAuthSession } from '@/lib/auth-utils';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerAuthSession();

  if (!session) {
    redirect('/auth');
  }

  return (
    <div className="layout flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0">
        <Header />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-20 lg:pb-6">{children}</main>
        <MobileNav />
      </div>
    </div>
  );
}  