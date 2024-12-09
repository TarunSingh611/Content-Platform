
export default function TestimonialCard({ name, role, feedback }: { name: string; role: string; feedback: string }) {  
    return (  
      <div className="bg-white rounded-lg shadow-lg p-6">  
        <p className="text-gray-600 italic">"{feedback}"</p>  
        <div className="mt-4">  
          <h4 className="text-lg font-semibold text-gray-800">{name}</h4>  
          <p className="text-sm text-gray-500">{role}</p>  
        </div>  
      </div>  
    );  
  }  