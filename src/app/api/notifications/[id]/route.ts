import { NextRequest, NextResponse } from 'next/server'
import { getServerAuthSession } from '@/lib/auth-utils'
import prisma from '@/lib/utils/db'

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerAuthSession()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const data = await req.json()
    const { isRead } = data

    // Verify notification belongs to user
    const existingNotification = await prisma.notification.findFirst({
      where: {
        id,
        userId: session.user.id
      }
    })

    if (!existingNotification) {
      return NextResponse.json({ error: 'Notification not found' }, { status: 404 })
    }

    const updatedNotification = await prisma.notification.update({
      where: { id },
      data: {
        isRead: isRead !== undefined ? isRead : existingNotification.isRead
      }
    })

    return NextResponse.json({
      message: 'Notification updated successfully',
      notification: updatedNotification
    })
  } catch (error) {
    console.error('Error updating notification:', error)
    return NextResponse.json(
      { error: 'Failed to update notification' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerAuthSession()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    // Verify notification belongs to user
    const existingNotification = await prisma.notification.findFirst({
      where: {
        id,
        userId: session.user.id
      }
    })

    if (!existingNotification) {
      return NextResponse.json({ error: 'Notification not found' }, { status: 404 })
    }

    await prisma.notification.delete({
      where: { id }
    })

    return NextResponse.json({
      message: 'Notification deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting notification:', error)
    return NextResponse.json(
      { error: 'Failed to delete notification' },
      { status: 500 }
    )
  }
}
