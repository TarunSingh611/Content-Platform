// src/components/dashboard/Sidebar.tsx  
'use client';  

import { useState } from 'react';  
import Link from 'next/link';  
import { usePathname } from 'next/navigation';  
import { motion } from 'framer-motion';  
import {  
  LayoutDashboard,  
  FileText,  
  BarChart2,  
  Settings,  
  Users,  
  Calendar,  
  MessageSquare,  
  Image,  
  FolderOpen,  
  ChevronLeft,  
  ChevronRight,  
} from 'lucide-react';  

const menuItems = [  
  {  
    title: 'Dashboard',  
    icon: LayoutDashboard,  
    path: '/dashboard',  
    badge: null,  
  },  
  {  
    title: 'Content',  
    icon: FileText,  
    path: '/dashboard/content',  
    badge: null,  
  },  
  {  
    title: 'Analytics',  
    icon: BarChart2,  
    path: '/dashboard/analytics',  
    badge: null,  
  },  
  {  
    title: 'Media',  
    icon: Image,  
    path: '/dashboard/media',  
    badge: null,  
  },  
  {  
    title: 'Team',  
    icon: Users,  
    path: '/dashboard/team',  
    badge: null,  
  },  
  {  
    title: 'Calendar',  
    icon: Calendar,  
    path: '/dashboard/calendar',  
    badge: null,  
  },  
  {  
    title: 'Messages',  
    icon: MessageSquare,  
    path: '/dashboard/messages',  
    badge: null,  
  },  
  {  
    title: 'Documents',  
    icon: FolderOpen,  
    path: '/dashboard/documents',  
    badge: null,  
  },  
  {  
    title: 'Settings',  
    icon: Settings,  
    path: '/dashboard/settings',  
    badge: null,  
  },  
];  

export default function Sidebar() {  
  const [isCollapsed, setIsCollapsed] = useState(false);  
  const pathname = usePathname();  

  return (  
    <motion.div  
      initial={{ width: 256 , position: 'sticky', left: 0, top: 0, height: '100vh', backgroundColor: 'white', borderRight: '1px solid #e5e7eb' }}  
      animate={{ width: isCollapsed ? 80 : 256 , position: 'sticky', left: 0, top: 0, height: '100vh', backgroundColor: 'white', borderRight: '1px solid #e5e7eb'}}
    >  
      <div className="flex flex-col h-full no-scrollbar sticky top-0">  
        {/* Logo Section */}  
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">  
          {!isCollapsed && (  
            <Link href="/dashboard" className="flex items-center space-x-2">  
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">  
                <span className="text-white font-bold text-xl">A</span>  
              </div>  
              <span className="text-xl font-semibold">Admin</span>  
            </Link>  
          )}  
          <button  
            onClick={() => setIsCollapsed(!isCollapsed)}  
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"  
          >  
            {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}  
          </button>  
        </div>  

        {/* Navigation Items */}  
        <nav className="flex-1 overflow-y-auto py-4">  
          <ul className="space-y-1 px-3">  
            {menuItems.map((item) => {  
              const isActive = pathname === item.path;  
              const Icon = item.icon;  

              return (  
                <li key={item.path}>  
                  <Link  
                    href={item.path}  
                    className={`flex items-center ${  
                      isCollapsed ? 'justify-center' : 'justify-between'  
                    } px-3 py-2 rounded-lg transition-colors ${  
                      isActive  
                        ? 'bg-indigo-50 text-indigo-600'  
                        : 'text-gray-600 hover:bg-gray-50'  
                    }`}  
                  >  
                    <div className="flex items-center space-x-3">  
                      <Icon size={20} />  
                      {!isCollapsed && <span>{item.title}</span>}  
                    </div>  
                    {!isCollapsed && item.badge && (  
                      <span className="bg-indigo-100 text-indigo-600 px-2 py-1 rounded-full text-xs">  
                        {item.badge}  
                      </span>  
                    )}  
                  </Link>  
                </li>  
              );  
            })}  
          </ul>  
        </nav>  

        {/* User Profile Section */}  
        {/* <div className="border-t border-gray-200 p-4">    
          <div className={`flex ${isCollapsed ? 'justify-center' : 'items-center space-x-3'}`}>    
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">    
              <span className="text-sm font-medium text-gray-600">JD</span>    
            </div>    
            {!isCollapsed && (    
              <div className="flex-1">    
                <h4 className="text-sm font-medium text-gray-900">John Doe</h4>    
                <p className="text-xs text-gray-500">admin@example.com</p>    
              </div>    
            )}    
          </div>    
        </div>   */}  
      </div>  
    </motion.div>  
  );  
}  