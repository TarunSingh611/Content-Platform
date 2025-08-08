import { ComponentType } from 'react';

interface FeatureCardProps {
  icon: ComponentType<{ className?: string }>;
  title: string;
  description: string;
}

function FeatureCard({ icon: Icon, title, description }: FeatureCardProps) {  
    return (  
      <div className="mobile-card text-center hover:shadow-lg transition-shadow duration-200 touch-target">  
        <div className="flex justify-center items-center w-12 h-12 sm:w-16 sm:h-16 bg-indigo-100 text-indigo-600 rounded-full mx-auto">  
          <Icon className="h-6 w-6 sm:h-8 sm:w-8" />  
        </div>  
        <h3 className="mt-4 mobile-text-lg font-semibold text-gray-800">{title}</h3>  
        <p className="mt-2 mobile-text text-gray-600">{description}</p>  
      </div>  
    );  
  }  
  
export default FeatureCard