
export default function TestimonialCard({ name, role, feedback }: { name: string; role: string; feedback: string }) {  
    return (  
      <div className="mobile-card hover:shadow-lg transition-shadow duration-200 touch-target">  
        <p className="mobile-text text-gray-600 italic">"{feedback}"</p>  
        <div className="mt-4">  
          <h4 className="mobile-text-lg font-semibold text-gray-800">{name}</h4>  
          <p className="mobile-text-sm text-gray-500">{role}</p>  
        </div>  
      </div>  
    );  
  }  