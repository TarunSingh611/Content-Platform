import { NextRequest, NextResponse } from 'next/server'
import { getServerAuthSession } from '@/lib/auth-utils'
import prisma from '@/lib/utils/db'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerAuthSession()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Sample notifications
    const sampleNotifications = [
      {
        type: 'like',
        title: 'New Like',
        message: 'John Smith liked your article "Golang vs Rust: Choosing the Right Language"',
        data: { contentId: '1', contentTitle: 'Golang vs Rust: Choosing the Right Language' }
      },
      {
        type: 'comment',
        title: 'New Comment',
        message: 'Sarah Johnson commented on your article "Django vs Flask: Python Framework Comparison"',
        data: { contentId: '2', contentTitle: 'Django vs Flask: Python Framework Comparison' }
      },
      {
        type: 'share',
        title: 'Content Shared',
        message: 'Your article "MongoDB vs MySQL: Database Selection Guide" was shared 5 times today',
        data: { contentId: '3', contentTitle: 'MongoDB vs MySQL: Database Selection Guide', shares: 5 }
      },
      {
        type: 'view',
        title: 'Milestone Reached',
        message: 'Your content reached 10,000 total views!',
        data: { milestone: '10,000 views' }
      },
      {
        type: 'system',
        title: 'System Update',
        message: 'New analytics features are now available. Check out the enhanced dashboard!',
        data: { feature: 'Enhanced Analytics' }
      },
      {
        type: 'team',
        title: 'Team Invitation',
        message: 'You have been invited to join the "Content Creation Team"',
        data: { teamId: '1', teamName: 'Content Creation Team' }
      },
      {
        type: 'content',
        title: 'Content Published',
        message: 'Your article "Advanced React Patterns" has been successfully published',
        data: { contentId: '4', contentTitle: 'Advanced React Patterns' }
      }
    ]

    // Create notifications
    const createdNotifications = await Promise.all(
      sampleNotifications.map(notification =>
        prisma.notification.create({
          data: {
            ...notification,
            userId: session.user.id
          }
        })
      )
    )

    return NextResponse.json({
      message: 'Sample notifications created successfully',
      count: createdNotifications.length
    })
  } catch (error) {
    console.error('Error creating sample notifications:', error)
    return NextResponse.json(
      { error: 'Failed to create sample notifications' },
      { status: 500 }
    )
  }
}
