// app/home/page.tsx  
import Link from 'next/link';  
import FeatureCard from '@/components/ui/FeatureCard';
import TestimonialCard from '@/components/ui/TestimonialCard';
import { FileText, BarChart2, Users, CheckCircle, Twitter, Facebook, Instagram } from 'lucide-react';  

export default function HomePage() {  
  return (  
    <div className="bg-gray-50">  
      {/* Hero Section */}  
      <section className="relative bg-gradient-to-r from-indigo-600 to-purple-600 text-white">  
        <div className="container mx-auto px-6 py-20 text-left">  
          <h1 className="text-5xl font-extrabold leading-tight">  
            Revolutionize Your Content Management  
          </h1>  
          <p className="mt-4 text-lg text-gray-200">  
            AI-powered tools to create, manage, and analyze your content with ease.  
            This Project has two parts:
            <ul>
              <li>1. A blog website</li>
              <li>2. A content management system</li>
            </ul>
            The content in blog is genrated by AI using our other project called "AI Content Generator"
           </p>  
          <div className="mt-8 flex justify-center space-x-4">  
            <a target='_blank' href="/dashboard" rel="noopener noreferrer">  
              <button className="px-6 py-3 bg-white text-indigo-600 font-semibold rounded-lg shadow-lg hover:bg-gray-100">  
                View AI Content Generator
              </button>  
            </a>  
            <a href="https://blogg-ed.vercel.app/" target="_blank" rel="noopener noreferrer">  
              <button className="px-6 py-3 bg-indigo-700 text-white font-semibold rounded-lg shadow-lg hover:bg-indigo-800">  
                View Our Blog website 
              </button>  
            </a>  
          </div>  
        </div>   
      </section>  

      {/* Features Section */}  
      <section className="container mx-auto px-6 py-16">  
        <h2 className="text-4xl font-bold text-center text-gray-800">Features</h2>  
        <p className="mt-4 text-center text-gray-600">  
          Everything you need to create, manage, and grow your content.  
        </p>  
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">  
          <FeatureCard  
            icon={FileText}  
            title="Content Creation"  
            description="AI-powered tools to help you create engaging content effortlessly."  
          />  
          <FeatureCard  
            icon={BarChart2}  
            title="Analytics Dashboard"  
            description="Track your content's performance with real-time analytics."  
          />  
          <FeatureCard  
            icon={Users}  
            title="Collaboration"  
            description="Work with your team in real-time with collaborative editing."  
          />  
        </div>  
      </section>  

      {/* Testimonials Section */}  
      <section className="bg-gray-100 py-16">  
        <div className="container mx-auto px-6">  
          <h2 className="text-4xl font-bold text-center text-gray-800">What Our Users Say</h2>  
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">  
            <TestimonialCard  
              name="Jane Doe"  
              role="Content Strategist"  
              feedback="This platform has completely transformed the way I manage my content. The AI tools are a game-changer!"  
            />  
            <TestimonialCard  
              name="John Smith"  
              role="Marketing Manager"  
              feedback="The analytics dashboard is incredibly insightful. I can track everything in one place!"  
            />  
            <TestimonialCard  
              name="Emily Johnson"  
              role="Freelance Writer"  
              feedback="Collaborating with my clients has never been easier. Highly recommend this platform!"  
            />  
          </div>  
        </div>  
      </section>  

      {/* Footer */}  
      <footer className="bg-gray-800 text-white py-8">  
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center">  
          <p className="text-sm">&copy; 2024 AI Content Platform. All rights reserved.</p>  
          <div className="flex space-x-4 mt-4 md:mt-0">  
            <a href="#" className="text-gray-400 hover:text-white">  
              <Twitter className="h-5 w-5" />  
            </a>  
            <a href="#" className="text-gray-400 hover:text-white">  
              <Facebook className="h-5 w-5" />  
            </a>  
            <a href="#" className="text-gray-400 hover:text-white">  
              <Instagram className="h-5 w-5" />  
            </a>  
          </div>  
        </div>  
      </footer>  
    </div>  
  );  
}  
