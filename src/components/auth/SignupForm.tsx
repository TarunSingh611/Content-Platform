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
  
      router.push('/login');  
    } catch (error) {  
      setErrors(prev => ({  
        ...prev,  
        submit: error instanceof Error ? error.message : 'An error occurred'  
      }));  
    } finally {  
      setLoading(false);  
    }  
  };  
  
  const inputStyles = {  
    width: '100%',  
    padding: '0.75rem',  
    borderRadius: '0.375rem',  
    border: '1px solid #D1D5DB',  
    marginTop: '0.25rem',  
    outline: 'none',  
    transition: 'all 0.2s ease',  
  };  
  
  const errorStyles = {  
    color: '#DC2626',  
    fontSize: '0.875rem',  
    marginTop: '0.25rem',  
  };  
  
  return (  
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>  
      <div>  
        <label htmlFor="name" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>  
          Name  
        </label>  
        <input  
          type="text"  
          id="name"  
          name="name"  
          value={formData.name}  
          onChange={handleChange}  
          style={inputStyles}  
          disabled={loading}  
        />  
        {errors.name && <div style={errorStyles}>{errors.name}</div>}  
      </div>  
  
      <div>  
        <label htmlFor="email" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>  
          Email  
        </label>  
        <input  
          type="email"  
          id="email"  
          name="email"  
          value={formData.email}  
          onChange={handleChange}  
          style={inputStyles}  
          disabled={loading}  
        />  
        {errors.email && <div style={errorStyles}>{errors.email}</div>}  
      </div>  
  
      <div>  
        <label htmlFor="password" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>  
          Password  
        </label>  
        <div style={{ position: 'relative' }}>  
          <input  
            type={showPassword ? 'text' : 'password'}  
            id="password"  
            name="password"  
            value={formData.password}  
            onChange={handleChange}  
            style={inputStyles}  
            disabled={loading}  
          />  
          <button  
            type="button"  
            onClick={() => setShowPassword(!showPassword)}  
            style={{  
              position: 'absolute',  
              right: '0.75rem',  
              top: '50%',  
              transform: 'translateY(-50%)',  
              background: 'none',  
              border: 'none',  
              cursor: 'pointer',  
              padding: '0.25rem',  
            }}  
          >  
            {showPassword ? (  
              <EyeOff size={20} color="#9CA3AF" />  
            ) : (  
              <Eye size={20} color="#9CA3AF" />  
            )}  
          </button>  
        </div>  
        {errors.password && <div style={errorStyles}>{errors.password}</div>}  
      </div>  
  
      <button  
        type="submit"  
        disabled={loading}  
        style={{  
          width: '100%',  
          padding: '0.75rem',  
          backgroundColor: loading ? '#6B7280' : '#4F46E5',  
          color: 'white',  
          border: 'none',  
          borderRadius: '0.375rem',  
          cursor: loading ? 'not-allowed' : 'pointer',  
          transition: 'all 0.2s ease',  
        }}  
      >  
        {loading ? (  
          <div  
            style={{  
              width: '1.25rem',  
              height: '1.25rem',  
              border: '2px solid white',  
              borderTopColor: 'transparent',  
              borderRadius: '50%',  
              margin: '0 auto',  
              animation: 'spin 1s linear infinite',  
            }}  
          />  
        ) : (  
          'Sign up'  
        )}  
      </button>  
  
      <style jsx>{`  
        @keyframes spin {  
          from { transform: rotate(0deg); }  
          to { transform: rotate(360deg); }  
        }  
  
        input:focus {  
          border-color: #4F46E5;  
          box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.1);  
        }  
  
        button:hover:not(:disabled) {  
          background-color: #4338CA;  
        }  
  
        input:disabled, button:disabled {  
          opacity: 0.7;  
          cursor: not-allowed;  
        }  
      `}</style>  
    </form>  
  );  
}  