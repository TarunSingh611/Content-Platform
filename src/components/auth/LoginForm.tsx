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
        setError('Invalid email or password');  
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

  const inputStyles = {  
    width: '100%',  
    padding: '0.75rem',  
    borderRadius: '0.375rem',  
    border: '1px solid #D1D5DB',  
    marginTop: '0.25rem',  
    outline: 'none',  
    transition: 'border-color 0.2s ease',  
  };  

  const buttonStyles = {  
    width: '100%',  
    padding: '0.75rem 1rem',  
    borderRadius: '0.375rem',  
    backgroundColor: loading ? '#6B7280' : '#4F46E5',  
    color: 'white',  
    fontWeight: '500',  
    border: 'none',  
    cursor: loading ? 'not-allowed' : 'pointer',  
    display: 'flex',  
    justifyContent: 'center',  
    alignItems: 'center',  
    transition: 'background-color 0.2s ease',  
  };  

  const labelStyles = {  
    display: 'block',  
    fontSize: '0.875rem',  
    fontWeight: '500',  
    color: '#374151',  
    marginBottom: '0.25rem',  
  };  

  return (  
    <form  
      onSubmit={handleSubmit}  
      style={{   
        display: 'flex',   
        flexDirection: 'column',   
        gap: '1.25rem',  
        opacity: 1,  
        transition: 'opacity 0.3s ease'  
      }}  
    >  
      <div>  
        <label htmlFor="email" style={labelStyles}>  
          Email  
        </label>  
        <div style={{ width: '100%' }}>  
          <input  
            id="email"  
            type="email"  
            name="email"  
            required  
            autoComplete="email"  
            style={{  
              ...inputStyles,  
              transition: 'transform 0.2s ease',  
            }}  
            disabled={loading}  
          />  
        </div>  
      </div>  

      <div>  
        <label htmlFor="password" style={labelStyles}>  
          Password  
        </label>  
        <div style={{ position: 'relative' }}>  
          <div style={{ width: '100%' }}>  
            <input  
              id="password"  
              type={showPassword ? 'text' : 'password'}  
              name="password"  
              required  
              autoComplete="current-password"  
              style={{  
                ...inputStyles,  
                transition: 'transform 0.2s ease',  
              }}  
              disabled={loading}  
            />  
          </div>  
          <button  
            type="button"  
            onClick={() => setShowPassword(!showPassword)}  
            aria-label={showPassword ? 'Hide password' : 'Show password'}  
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
      </div>  

      {error && (  
        <div  
          style={{   
            color: '#DC2626',   
            fontSize: '0.875rem',  
            transition: 'opacity 0.3s ease'  
          }}  
        >  
          {error}  
        </div>  
      )}  

      <button  
        type="submit"  
        disabled={loading}  
        style={{  
          ...buttonStyles,  
          transform: loading ? 'none' : 'scale(1)',  
          transition: 'transform 0.2s ease, background-color 0.2s ease',  
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
              animation: 'spin 1s linear infinite',  
            }}  
          />  
        ) : (  
          'Sign in'  
        )}  
      </button>  

      <style jsx>{`  
        @keyframes spin {  
          from {  
            transform: rotate(0deg);  
          }  
          to {  
            transform: rotate(360deg);  
          }  
        }  

        input:hover, button:hover:not(:disabled) {  
          transform: scale(1.01);  
        }  

        input:focus {  
          border-color: #4F46E5;  
          box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.1);  
        }  

        button:active:not(:disabled) {  
          transform: scale(0.99);  
        }  
      `}</style>  
    </form>  
  );  
}  