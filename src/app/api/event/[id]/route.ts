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
    const { title, description, startDate, endDate, allDay, color } = data

    if (!title || !startDate || !endDate) {
      return NextResponse.json(
        { error: 'Title, start date, and end date are required' },
        { status: 400 }
      )
    }

    // Verify event belongs to user
    const existingEvent = await prisma.event.findFirst({
      where: {
        id,
        userId: session.user.id
      }
    })

    if (!existingEvent) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    const updatedEvent = await prisma.event.update({
      where: { id },
      data: {
        title,
        description: description || '',
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        allDay: allDay || false,
        color: color || '#4F46E5'
      }
    })

    return NextResponse.json({
      message: 'Event updated successfully',
      event: updatedEvent
    })
  } catch (error) {
    console.error('Error updating event:', error)
    return NextResponse.json(
      { error: 'Failed to update event' },
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

    // Verify event belongs to user
    const existingEvent = await prisma.event.findFirst({
      where: {
        id,
        userId: session.user.id
      }
    })

    if (!existingEvent) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    await prisma.event.delete({
      where: { id }
    })

    return NextResponse.json({
      message: 'Event deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting event:', error)
    return NextResponse.json(
      { error: 'Failed to delete event' },
      { status: 500 }
    )
  }
}
