// app/api/register/route.ts  
import { NextResponse } from 'next/server';    
import { hash } from 'bcrypt';    
import { prisma } from '@/lib/utils/db';  // Update this import path based on your project structure  

export async function POST(req: Request) {    
  try {    
    const data = await req.json()  
    const { email, password, name } = data  

    // Add input validation  
    if (!email || !email.includes('@')) {  
      return NextResponse.json(  
        { error: 'Invalid email address' },  
        { status: 400 }  
      );  
    }  

    if (!password || password.length < 6) {  
      return NextResponse.json(  
        { error: 'Password must be at least 6 characters long' },  
        { status: 400 }  
      );  
    }  

    if (!name || name.length < 2) {  
      return NextResponse.json(  
        { error: 'Name must be at least 2 characters long' },  
        { status: 400 }  
      );  
    }  

    // Check for existing user  
    const existingUser = await prisma.user.findUnique({    
      where: { email },    
    });    

    if (existingUser) {    
      return NextResponse.json(    
        { error: 'User already exists' },    
        { status: 400 }    
      );    
    }    

    // Create new user  
    const hashedPassword = await hash(password, 10);    

    const user = await prisma.user.create({    
      data: {    
        email,    
        name,    
        password: hashedPassword,  
        role: 'USER',    
      },  
    });    

    // Return safe user object  
    const safeUser = {    
      id: user.id,    
      email: user.email,    
      name: user.name,    
      role: user.role,    
      image: user.image,    
    };    

    return NextResponse.json(    
      {    
        message: 'User created successfully',    
        user: safeUser,  
      },    
      { status: 201 }    
    );    
  } catch (error: any) {    
    console.error('Registration error:', error);  

    // Better error handling  
    if (error.code === 'P2002') {  
      return NextResponse.json(  
        { error: 'Email already exists' },  
        { status: 400 }  
      );  
    }  

    return NextResponse.json(    
      {   
        error: process.env.NODE_ENV === 'development'   
          ? `Registration failed: ${error.message}`   
          : 'Internal server error'  
      },  
      { status: 500 }    
    );    
  } finally {  
    // Optional: Disconnect Prisma in development  
    if (process.env.NODE_ENV === 'development') {  
      await prisma.$disconnect()  
    }  
  }  
}  