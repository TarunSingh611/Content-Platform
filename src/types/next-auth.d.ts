import 'next-auth';  
import { Role } from '@prisma/client';  

declare module 'next-auth' {  
  interface User {  
    id: string;  
    email: string;  
    name?: string | null; 
    password?: string | null; 
    image?: string | null;  
    bio?: string | null;
    websiteUrl?: string | null;
    role: Role;  
  }  

  interface Session {  
    user: User & {  
      id: string;  
      role: Role;  
    };  
  }  
}  

declare module 'next-auth/jwt' {  
  interface JWT {  
    id: string;  
    role: Role;  
  }  
}  