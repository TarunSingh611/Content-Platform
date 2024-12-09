// lib/utils/init-db.ts  
import prisma from './db';  

export async function initDatabase() {  
  try {  
    // Create indexes  
    await prisma.$runCommandRaw({  
      createIndexes: 'User',  
      indexes: [  
        {  
          key: { email: 1 },  
          name: 'email_idx',  
          unique: true,  
        },  
      ],  
    });  

    console.log('Database initialized successfully');  
  } catch (error) {  
    console.error('Error initializing database:', error);  
    throw error;  
  }  
}  