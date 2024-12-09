function FeatureCard({ icon: Icon, title, description }: { icon: any; title: string; description: string }) {  
    return (  
      <div className="bg-white rounded-lg shadow-lg p-6 text-center">  
        <div className="flex justify-center items-center w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full mx-auto">  
          <Icon className="h-8 w-8" />  
        </div>  
        <h3 className="mt-4 text-xl font-semibold text-gray-800">{title}</h3>  
        <p className="mt-2 text-gray-600">{description}</p>  
      </div>  
    );  
  }  
  
export default FeatureCard