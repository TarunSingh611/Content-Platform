import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';

const prisma = new PrismaClient();

async function createDemoUser() {
  try {
    // Check if demo user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: 'demo@example.com' }
    });

    if (existingUser) {
      console.log('Demo user already exists');
      return;
    }

    // Hash the demo password
    const hashedPassword = await hash('demo123456', 12);

    // Create demo user
    const demoUser = await prisma.user.create({
      data: {
        email: 'demo@example.com',
        name: 'Demo User',
        password: hashedPassword,
        emailVerified: new Date(), // Mark email as verified
        role: 'USER'
      }
    });

    console.log('Demo user created successfully:', demoUser.email);
  } catch (error) {
    console.error('Error creating demo user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createDemoUser(); 