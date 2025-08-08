import { NextRequest, NextResponse } from 'next/server'
import { getServerAuthSession } from '@/lib/auth-utils'
import prisma from '@/lib/utils/db'

export async function GET(req: NextRequest) {
  try {
    const session = await getServerAuthSession()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const events = await prisma.event.findMany({
      where: {
        userId: session.user.id
      },
      orderBy: {
        startDate: 'asc'
      }
    })

    return NextResponse.json({
      events,
      total: events.length
    })
  } catch (error) {
    console.error('Error fetching events:', error)
    return NextResponse.json(
      { error: 'Failed to fetch events' },
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
    const { title, description, startDate, endDate, allDay, color } = data

    if (!title || !startDate || !endDate) {
      return NextResponse.json(
        { error: 'Title, start date, and end date are required' },
        { status: 400 }
      )
    }

    const event = await prisma.event.create({
      data: {
        title,
        description: description || '',
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        allDay: allDay || false,
        color: color || '#4F46E5',
        userId: session.user.id
      }
    })

    return NextResponse.json({
      message: 'Event created successfully',
      event
    })
  } catch (error) {
    console.error('Event creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create event' },
      { status: 500 }
    )
  }
}