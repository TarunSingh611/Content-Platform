'use client';  
  
import { useState } from 'react';  
import { useRouter } from 'next/navigation';  
import { Eye, EyeOff } from 'lucide-react';  
  
interface FormErrors {  
  name?: string;  
  email?: string;  
  password?: string;  
}  
  
export default function SignupForm() {  
  const router = useRouter();  
  const [formData, setFormData] = useState({  
    name: '',  
    email: '',  
    password: ''  
  });  
  const [errors, setErrors] = useState<FormErrors>({});  
  const [loading, setLoading] = useState(false);  
  const [showPassword, setShowPassword] = useState(false);  
  
  const validateForm = (): boolean => {  
    const newErrors: FormErrors = {};  
  
    // Name validation  
    if (!formData.name.trim()) {  
      newErrors.name = 'Name is required';  
    } else if (formData.name.length < 2) {  
      newErrors.name = 'Name must be at least 2 characters long';  
    }  
  
    // Email validation  
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;  
    if (!formData.email.trim()) {  
      newErrors.email = 'Email is required';  
    } else if (!emailRegex.test(formData.email)) {  
      newErrors.email = 'Please enter a valid email address';  
    }  
  
    // Password validation  
    if (!formData.password) {  
      newErrors.password = 'Password is required';  
    } else if (formData.password.length < 8) {  
      newErrors.password = 'Password must be at least 8 characters long';  
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {  
      newErrors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';  
    }  
  
    setErrors(newErrors);  
    return Object.keys(newErrors).length === 0;  
  };  
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {  
    const { name, value } = e.target;  
    setFormData(prev => ({  
      ...prev,  
      [name]: value  
    }));  
    // Clear error when user starts typing  
    if (errors[name as keyof FormErrors]) {  
      setErrors(prev => ({  
        ...prev,  
        [name]: undefined  
      }));  
    }  
  };  
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {  
    e.preventDefault();  
      
    if (!validateForm()) {  
      return;  
    }  
    setLoading(true);  

    try {  
      const response = await fetch('/api/auth/signup', {  
        method: 'POST',  
        headers: { 'Content-Type': 'application/json' },  
        body: JSON.stringify(formData),  
      });  
  
      const data = await response.json();  
  
      if (!response.ok) {  
        throw new Error(data.error || 'Something went wrong');  
      }  
  
      router.push('/auth');  
    } catch (error) {  
      setErrors(prev => ({  
        ...prev,  
        submit: error instanceof Error ? error.message : 'An error occurred'  
      }));  
    } finally {  
      setLoading(false);  
    }  
  };  
  
    
  
      return (  
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">  
        <div>  
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">  
            Name  
          </label>  
          <input  
            type="text"  
            id="name"  
            name="name"  
            value={formData.name}  
            onChange={handleChange}  
            className="w-full px-3 py-3 rounded-md border border-gray-300 bg-white text-gray-900 outline-none transition-all duration-200 ease-in-out focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"  
            disabled={loading}  
          />  
          {errors.name && <div className="text-red-600 text-sm mt-1">{errors.name}</div>}  
        </div>  

        <div>  
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">  
            Email  
          </label>  
          <input  
            type="email"  
            id="email"  
            name="email"  
            value={formData.email}  
            onChange={handleChange}  
            className="w-full px-3 py-3 rounded-md border border-gray-300 bg-white text-gray-900 outline-none transition-all duration-200 ease-in-out focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"  
            disabled={loading}  
          />  
          {errors.email && <div className="text-red-600 text-sm mt-1">{errors.email}</div>}  
        </div>  

        <div>  
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">  
            Password  
          </label>  
          <div className="relative">  
            <input  
              type={showPassword ? 'text' : 'password'}  
              id="password"  
              name="password"  
              value={formData.password}  
              onChange={handleChange}  
              className="w-full px-3 py-3 rounded-md border border-gray-300 bg-white text-gray-900 outline-none transition-all duration-200 ease-in-out focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed pr-10"  
              disabled={loading}  
            />  
            <button  
              type="button"  
              onClick={() => setShowPassword(!showPassword)}  
              className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-none border-none cursor-pointer p-1 text-gray-400 hover:text-gray-600"  
            >  
              {showPassword ? (  
                <EyeOff size={20} />  
              ) : (  
                <Eye size={20} />  
              )}  
            </button>  
          </div>  
          {errors.password && <div className="text-red-600 text-sm mt-1">{errors.password}</div>}  
        </div>  
  
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
          'Sign Up'  
        )}  
      </button>  
    </form>  
  );  
}  