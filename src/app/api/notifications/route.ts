import { NextRequest, NextResponse } from 'next/server'
import { getServerAuthSession } from '@/lib/auth-utils'
import prisma from '@/lib/utils/db'

export async function GET(req: NextRequest) {
  try {
    const session = await getServerAuthSession()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Parse URL parameters safely
    let filter = 'all'
    let limit = 50
    let page = 1

    try {
      const url = new URL(req.url)
      filter = url.searchParams.get('filter') || 'all'
      limit = parseInt(url.searchParams.get('limit') || '50')
      page = parseInt(url.searchParams.get('page') || '1')
    } catch (error) {
      console.error('Error parsing URL parameters:', error)
      // Use defaults if URL parsing fails
    }

    const where: any = {
      userId: session.user.id
    }

    if (filter === 'unread') {
      where.isRead = false
    } else if (filter === 'read') {
      where.isRead = true
    }

    // Ensure limit and page are valid
    limit = Math.max(1, Math.min(limit, 100)) // Limit between 1 and 100
    page = Math.max(1, page)

    const notifications = await prisma.notification.findMany({
      where,
      orderBy: {
        createdAt: 'desc'
      },
      take: limit,
      skip: (page - 1) * limit
    })

    const total = await prisma.notification.count({ where })
    const unreadCount = await prisma.notification.count({
      where: {
        userId: session.user.id,
        isRead: false
      }
    })

    return NextResponse.json({
      notifications,
      total,
      unreadCount,
      page,
      limit
    })
  } catch (error) {
    console.error('Error fetching notifications:', error)
    return NextResponse.json(
      { error: 'Failed to fetch notifications', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerAuthSession()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await req.json()
    const { type, title, message, data: notificationData } = data

    if (!type || !title || !message) {
      return NextResponse.json(
        { error: 'Type, title, and message are required' },
        { status: 400 }
      )
    }

    const notification = await prisma.notification.create({
      data: {
        type,
        title,
        message,
        data: notificationData || {},
        userId: session.user.id,
        isRead: false
      }
    })

    return NextResponse.json({
      message: 'Notification created successfully',
      notification
    })
  } catch (error) {
    console.error('Error creating notification:', error)
    return NextResponse.json(
      { error: 'Failed to create notification', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerAuthSession()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await req.json()
    const { action, notificationIds } = data

    if (action === 'markAllAsRead') {
      await prisma.notification.updateMany({
        where: {
          userId: session.user.id,
          isRead: false
        },
        data: {
          isRead: true
        }
      })

      return NextResponse.json({
        message: 'All notifications marked as read'
      })
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Error updating notifications:', error)
    return NextResponse.json(
      { error: 'Failed to update notifications', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
