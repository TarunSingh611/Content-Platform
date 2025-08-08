import { NextRequest, NextResponse } from 'next/server'
import { getServerAuthSession } from '@/lib/auth-utils'
import prisma from '@/lib/utils/db'

export async function GET(req: NextRequest) {
  try {
    const session = await getServerAuthSession()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Test if we can connect to the database
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, name: true, email: true }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Test if we can query notifications
    const notificationCount = await prisma.notification.count({
      where: { userId: session.user.id }
    })

    return NextResponse.json({
      message: 'Notifications API is working',
      user: user,
      notificationCount: notificationCount
    })
  } catch (error) {
    console.error('Error in notifications test:', error)
    return NextResponse.json(
      { error: 'Notifications API error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
