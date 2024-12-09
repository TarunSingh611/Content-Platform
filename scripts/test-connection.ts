// scripts/test-connection.ts  
import { PrismaClient } from '@prisma/client'  

const prisma = new PrismaClient({  
  log: ['query', 'info', 'warn', 'error'],  
})  

async function testConnection() {  
  try {  
    console.log('Attempting to connect to MongoDB...')  
    await prisma.$connect()  
    console.log('Successfully connected to MongoDB')  

    // Test query  
    const userCount = await prisma.user.count()  
    console.log(`Number of users in database: ${userCount}`)  

    // Test database operations  
    console.log('Testing database operations...')  

    // Create a test user  
    const testUser = await prisma.user.create({  
      data: {  
        email: 'test@example.com',  
        name: 'Test User',  
        password: 'test-password',  
        role: 'USER',  
      },  
    })  
    console.log('Created test user:', testUser)  

    // Delete the test user  
    await prisma.user.delete({  
      where: { email: 'test@example.com' },  
    })  
    console.log('Deleted test user')  

  } catch (error) {  
    console.error('Database connection error:', error)  
  } finally {  
    await prisma.$disconnect()  
    console.log('Disconnected from database')  
  }  
}  

// Run the test  
testConnection()  
  .catch((error) => {  
    console.error('Script execution error:', error)  
    process.exit(1)  
  })  