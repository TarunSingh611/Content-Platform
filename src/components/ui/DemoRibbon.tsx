import { AlertCircle } from 'lucide-react';

interface DemoRibbonProps {
  message?: string;
  className?: string;
}

export default function DemoRibbon({ 
  message = "Demo Feature - Coming Soon!", 
  className = "" 
}: DemoRibbonProps) {
  return (
    <div className={`bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 ${className}`}>
      <AlertCircle className="h-4 w-4" />
      <span className="text-sm font-medium">{message}</span>
    </div>
  );
} 