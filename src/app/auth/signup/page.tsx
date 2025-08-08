'use client';  

import { motion } from 'framer-motion';  
import SignupForm from '@/components/auth/SignupForm';  
import Link from 'next/link';  
import { ArrowLeft } from 'lucide-react';

export default function SignupPage() {  
  return (  
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-cyan-100 flex items-center justify-center p-4">  
      {/* Back Button */}
      <Link
        href="/"
        className="absolute top-4 left-4 flex items-center text-gray-600 hover:text-gray-800 transition-colors"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        <span className="text-sm font-medium">Back to Home</span>
      </Link>

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
        <div className="px-8 py-6">  
          <div className="text-center mb-8">  
            <img
              src="/AILogo.jpeg?v=1"
              alt="Logo"  
              className="mx-auto mb-4 w-15 h-15 rounded-full"  
            />  
            <h2 className="text-2xl font-bold text-gray-800">Create an account</h2>  
            <p className="text-gray-600 mt-2">Join us today</p>  
          </div>  

          <SignupForm />  

          <div className="mt-6 text-center">  
            <p className="text-sm text-gray-600">  
              Already have an account?{' '}  
              <Link   
                href="/auth"   
                className="text-indigo-600 hover:text-indigo-500 font-semibold"  
              >  
                Sign in  
              </Link>  
            </p>  
          </div>  
        </div>  
      </motion.div>  
    </div>  
  );  
}  