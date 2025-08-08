// src/app/forgot-password/page.tsx
import ForgotPasswordForm from '@/components/auth/forgotPasswordForm';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-cyan-100 flex items-center justify-center p-4">
      {/* Back Button */}
      <Link
        href="/auth"
        className="absolute top-4 left-4 flex items-center text-gray-600 hover:text-gray-800 transition-colors"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        <span className="text-sm font-medium">Back to Login</span>
      </Link>

      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden">
        <div className="px-8 py-6">
          <div className="text-center mb-8">
            <img
              src="/AILogo.jpeg"
              alt="Logo"
              className="mx-auto mb-4 w-15 h-15 rounded-full"
            />
            <h2 className="text-2xl font-bold text-gray-800">
              Forgot your password?
            </h2>
            <p className="text-gray-600 mt-2">
              Enter your email address and we'll send you a link to reset your password.
            </p>
          </div>

          <ForgotPasswordForm />

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Remember your password?{' '}
              <Link
                href="/auth"
                className="text-indigo-600 hover:text-indigo-500 font-semibold transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}