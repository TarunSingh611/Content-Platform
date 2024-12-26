// src/app/auth/verify-email/page.tsx
'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Invalid verification link');
      return;
    }

    const verifyEmail = async () => {
      try {
        const response = await fetch('/api/auth/verify-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error);
        }

        setStatus('success');
        setMessage('Email verified successfully! Redirecting to login...');
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          router.push('/auth');
        }, 3000);
      } catch (error) {
        setStatus('error');
        setMessage(error instanceof Error ? error.message : 'Verification failed');
      }
    };

    verifyEmail();
  }, [token, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-cyan-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full text-center">
        {status === 'loading' && (
          <div className="flex flex-col items-center">
            <LoadingSpinner />
            <p className="mt-4 text-gray-600">Verifying your email...</p>
          </div>
        )}
        
        {status === 'success' && (
          <div>
            <h2 className="text-2xl font-bold text-green-600 mb-4">✓ Email Verified</h2>
            <p className="text-gray-600">{message}</p>
          </div>
        )}
        
        {status === 'error' && (
          <div>
            <h2 className="text-2xl font-bold text-red-600 mb-4">Verification Failed</h2>
            <p className="text-gray-600">{message}</p>
            <button
              onClick={() => {
                // Add resend verification email logic
                router.push('/auth/resend-verification');
              }}
              className="mt-4 text-indigo-600 hover:text-indigo-500"
            >
              Resend verification email
            </button>
          </div>
        )}
      </div>
    </div>
  );
}


export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-cyan-100 flex items-center justify-center p-4">
      <Suspense fallback={<LoadingSpinner/>}>
        <VerifyEmailContent />
      </Suspense>
    </div>
  );
}