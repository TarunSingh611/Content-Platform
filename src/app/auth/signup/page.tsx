'use client';  

import { motion } from 'framer-motion';  
import SignupForm from '@/components/auth/SignupForm';  
import Link from 'next/link';  
import Image from 'next/image';  

export default function SignupPage() {  
  return (  
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-cyan-100 flex items-center justify-center p-4">  
      <motion.div  
        initial={{ opacity: 0, y: 20 }}  
        animate={{ opacity: 1, y: 0 }}  
        transition={{ duration: 0.5 }}  
        // className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden"  
      >  
        <div className="px-8 py-6">  
          <div className="text-center mb-8">  
            <Image  
              src="/AILogo.jpeg" // Add your logo  
              alt="Logo"  
              width={60}  
              height={60}  
              className="mx-auto mb-4"  
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