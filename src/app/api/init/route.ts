// app/api/init/route.ts  
import { initDatabase } from '@/lib/utils/init-db';  
import { NextResponse } from 'next/server';  

export async function GET() {  
  try {  
    await initDatabase();  
    return NextResponse.json({ message: 'Database initialized successfully' });  
  } catch (error) {  
    return NextResponse.json(  
      { error: 'Failed to initialize database' },  
      { status: 500 }  
    );  
  }  
}  