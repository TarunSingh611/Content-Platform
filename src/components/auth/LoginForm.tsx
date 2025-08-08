'use client';  

import { signIn } from 'next-auth/react';  
import { useState } from 'react';  
import { useRouter } from 'next/navigation';  
import { Eye, EyeOff } from 'lucide-react';  

interface LoginFormProps {  
  callbackUrl?: string;  
}  

export default function LoginForm({ callbackUrl = '/dashboard' }: LoginFormProps) {  
  const router = useRouter();  
  const [error, setError] = useState<string>('');  
  const [loading, setLoading] = useState<boolean>(false);  
  const [showPassword, setShowPassword] = useState<boolean>(false);  

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {  
    e.preventDefault();  
    setLoading(true);  
    setError('');  

    const formData = new FormData(e.currentTarget);  
    const email = formData.get('email')?.toString().trim();  
    const password = formData.get('password')?.toString();  

    if (!email || !password) {  
      setError('Please fill in all fields');  
      setLoading(false);  
      return;  
    }  

    try {  
      const result = await signIn('credentials', {  
        email,  
        password,  
        redirect: false,  
      });  

      if (result?.error) {  
        setError(result?.error);  
      } else {  
        router.push(callbackUrl);  
        router.refresh();  
      }  
    } catch (error) {  
      setError('An error occurred during login');  
      console.error('Login error:', error);  
    } finally {  
      setLoading(false);  
    }  
  };  

  

      return (  
      <form  
        onSubmit={handleSubmit}  
        className="flex flex-col gap-5 opacity-100 transition-opacity duration-300 ease-in-out"  
      >  
      <div>  
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">  
          Email  
        </label>  
        <div className="w-full">  
          <input  
            id="email"  
            type="email"  
            name="email"  
            required  
            autoComplete="email"  
            className="w-full px-3 py-3 rounded-md border border-gray-300 bg-white text-gray-900 mt-1 outline-none transition-all duration-200 ease-in-out focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"  
            disabled={loading}  
          />  
        </div>  
      </div>  

      <div>  
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">  
          Password  
        </label>  
        <div className="relative">  
          <div className="w-full">  
            <input  
              id="password"  
              type={showPassword ? 'text' : 'password'}  
              name="password"  
              required  
              autoComplete="current-password"  
              className="w-full px-3 py-3 rounded-md border border-gray-300 bg-white text-gray-900 mt-1 outline-none transition-all duration-200 ease-in-out focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed pr-10"  
              disabled={loading}  
            />  
          </div>  
          <button  
            type="button"  
            onClick={() => setShowPassword(!showPassword)}  
            aria-label={showPassword ? 'Hide password' : 'Show password'}  
            className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-none border-none cursor-pointer p-1 text-gray-400 hover:text-gray-600"  
          >  
            {showPassword ? (  
              <EyeOff size={20} />  
            ) : (  
              <Eye size={20} />  
            )}  
          </button>  
        </div>  
      </div>  

      {error && (  
        <div className="text-red-600 text-sm transition-opacity duration-300 ease-in-out">  
          {error}  
        </div>  
      )}  

      <button  
        type="submit"  
        disabled={loading}  
        className={`w-full px-4 py-3 rounded-md font-medium border-none cursor-pointer flex justify-center items-center transition-all duration-200 ease-in-out transform ${
          loading 
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-indigo-600 hover:bg-indigo-700 active:scale-95'
        } text-white`}  
      >  
        {loading ? (  
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />  
        ) : (  
          'Sign In'  
        )}  
      </button>  

    </form>  
  );  
}  