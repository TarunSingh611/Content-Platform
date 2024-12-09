'use client';  

import LoginForm from '@/components/auth/LoginForm';  
import Link from 'next/link';  
import Image from 'next/image';  
import { motion } from 'framer-motion';  

export default function LoginPage() {  
  return (  
    <div style={{   
      minHeight: '100vh',  
      background: 'linear-gradient(to bottom right, #EEF2FF, #FFFFFF, #E0F2FE)',  
      display: 'flex',  
      alignItems: 'center',  
      justifyContent: 'center',  
      padding: '1rem'  
    }}>  
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
        <div style={{ padding: '2rem' }}>  
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>  
            <Image  
              src="/AILogo.jpeg"  
              alt="Logo"  
              width={60}  
              height={60}  
              style={{ margin: '0 auto', marginBottom: '1rem' }}  
            />  
            <h2 style={{   
              fontSize: '1.5rem',  
              fontWeight: 'bold',  
              color: '#1F2937'  
            }}>Welcome back</h2>  
            <p style={{   
              color: '#4B5563',  
              marginTop: '0.5rem'  
            }}>Please sign in to your account</p>  
          </div>  

          <LoginForm />  

          <div style={{   
            marginTop: '1.5rem',  
            textAlign: 'center'  
          }}>  
            <p style={{ fontSize: '0.875rem', color: '#4B5563' }}>  
              Don't have an account?{' '}  
              <Link   
                href="/signup"   
                style={{  
                  color: '#4F46E5',  
                  fontWeight: '600',  
                  textDecoration: 'none'  
                }}  
              >  
                Sign up  
              </Link>  
            </p>  
          </div>  
        </div>  
      </motion.div>  
    </div>  
  );  
}  