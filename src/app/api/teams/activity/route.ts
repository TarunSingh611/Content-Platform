import { NextRequest, NextResponse } from 'next/server'
import { getServerAuthSession } from '@/lib/auth-utils'
import prisma from '@/lib/utils/db'

export async function GET(req: NextRequest) {
  try {
    const session = await getServerAuthSession()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user's teams
    const userTeams = await prisma.team.findMany({
      where: {
        members: {
          some: {
            userId: session.user.id
          }
        }
      },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        }
      }
    })

    // Generate mock activity data
    const activities: Array<{
      id: string;
      type: string;
      description: string;
      userId: string;
      userName: string;
      teamId: string;
      teamName: string;
      timestamp: string;
    }> = []
    
    const activityTypes = [
      'team_created',
      'member_joined', 
      'member_left',
      'role_changed',
      'content_published'
    ]

    const descriptions: Record<string, string> = {
      team_created: 'created a new team',
      member_joined: 'joined the team',
      member_left: 'left the team',
      role_changed: 'was promoted to admin',
      content_published: 'published new content'
    }

    // Generate activities for each team
    userTeams.forEach(team => {
             // Add team creation activity
       activities.push({
         id: `activity-${team.id}-created`,
         type: 'team_created' as const,
         description: descriptions.team_created,
         userId: team.members[0]?.user.id || 'unknown',
         userName: (team.members[0]?.user.name as string) || 'Unknown User',
         teamId: team.id,
         teamName: team.name,
         timestamp: team.createdAt.toISOString()
       })

      // Add member activities
      team.members.forEach((member, index) => {
        if (index > 0) { // Skip the first member (team creator)
          const activityType = activityTypes[Math.floor(Math.random() * activityTypes.length)]
          const daysAgo = Math.floor(Math.random() * 30) // Random activity in last 30 days
          const timestamp = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString()

                     activities.push({
             id: `activity-${team.id}-${member.user.id}-${index}`,
             type: activityType as any,
             description: descriptions[activityType as keyof typeof descriptions],
             userId: member.user.id,
             userName: (member.user.name as string) || 'Unknown User',
             teamId: team.id,
             teamName: team.name,
             timestamp
           })
        }
      })
    })

    // Sort activities by timestamp (newest first)
    activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

    // Limit to 20 most recent activities
    const recentActivities = activities.slice(0, 20)

    return NextResponse.json({
      message: 'Team activity data fetched successfully',
      activities: recentActivities
    })
  } catch (error) {
    console.error('Error fetching team activities:', error)
    return NextResponse.json(
      { error: 'Failed to fetch team activities' },
      { status: 500 }
    )
  }
}
