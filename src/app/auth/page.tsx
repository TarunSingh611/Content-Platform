'use client';

import LoginForm from '@/components/auth/LoginForm';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LoginPage() {
  const router = useRouter();
  const [demoError, setDemoError] = useState<string>('');
  const [demoLoading, setDemoLoading] = useState<boolean>(false);

  const handleDemoLogin = async () => {
    try {
      const demoEmail = process.env.NEXT_PUBLIC_DEMO_EMAIL;
      const demoPassword = process.env.NEXT_PUBLIC_DEMO_PASSWORD;
      
      if (!demoEmail || !demoPassword) {
        setDemoError('Demo credentials not configured. Please check environment variables.');
        console.error('Demo credentials missing:', { demoEmail: !!demoEmail, demoPassword: !!demoPassword });
        return;
      }
      
      console.log('Attempting demo login with:', demoEmail);
      
      const result = await signIn('credentials', {
        email: demoEmail,
        password: demoPassword,
        redirect: false,
      });

      console.log('Demo login result:', result);

      if (result?.error) {
        console.error('Demo login failed:', result.error);
        setDemoError(result.error);
      } else if (result?.ok) {
        console.log('Demo login successful, redirecting to dashboard');
        router.push('/dashboard');
        router.refresh();
      } else {
        console.log('Demo login result:', result);
        setDemoError('Login failed. Please check the console for details.');
      }
    } catch (error) {
      console.error('Demo login error:', error);
      setDemoError('An unexpected error occurred during demo login.');
    } finally {
      setDemoLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-cyan-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}  
        animate={{ opacity: 1, y: 0 }}  
        transition={{ duration: 0.5 }}  
        style={{  
          background: 'white',  
          width: '100%',  
          maxWidth: '28rem',  
          borderRadius: '1rem',  
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',  
          overflow: 'hidden'  
        }} 
      >
        <div className="px-6 py-8 sm:px-8">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <Image
                src="/AILogo.jpeg"
                alt="Logo"
                width={60}
                height={60}
                className="rounded-full"
              />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Welcome back
            </h2>
            <p className="text-gray-600">
              Please sign in to your account
            </p>
          </div>

          <LoginForm />

          <div className="mt-4 text-center">
            <button
              onClick={handleDemoLogin}
              disabled={demoLoading}
              className={`w-full py-2 px-4 font-medium rounded-md shadow-sm transition-colors duration-200 ${
                demoLoading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              {demoLoading ? 'Logging in...' : 'Demo Login'}
            </button>
            {demoError && (
              <div className="mt-2 text-sm text-red-600">
                {demoError}
              </div>
            )}
          </div>

          <div className="mt-6 space-y-2 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link
                href="/auth/signup"
                className="text-indigo-600 hover:text-indigo-500 font-semibold transition-colors"
              >
                Sign up
              </Link>
            </p>
            <p className="text-sm text-gray-600">
              Forgot your password?{' '}
              <Link
                href="/auth/forgot-password"
                className="text-indigo-600 hover:text-indigo-500 font-semibold transition-colors"
              >
                Reset password
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}