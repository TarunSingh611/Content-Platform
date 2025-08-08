import { NextResponse } from 'next/server'
import prisma from '@/lib/utils/db'

export async function GET() {
  try {
    // Test if Notification model is accessible
    const notificationCount = await prisma.notification.count()
    
    return NextResponse.json({
      message: 'Notification model is accessible',
      notificationCount: notificationCount,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Notification test error:', error)
    return NextResponse.json(
      { 
        error: 'Notification model error', 
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}
