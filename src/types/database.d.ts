// types/database.d.ts  
import { User, Content, Role } from '@prisma/client';  

export interface DatabaseUser extends User {  
  contents?: Content[];  
}  

export interface DatabaseContent extends Content {  
  author?: DatabaseUser;  
}  

export { Role };  