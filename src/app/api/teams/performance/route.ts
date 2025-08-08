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

    // Generate mock performance data for each team
    const performance = userTeams.map(team => {
      const memberCount = team.members.length
      const activeMembers = Math.floor(memberCount * (0.7 + Math.random() * 0.3)) // 70-100% active
      
      return {
        teamId: team.id,
        teamName: team.name,
        productivity: Math.floor(75 + Math.random() * 25), // 75-100%
        contentQuality: Math.floor(80 + Math.random() * 20), // 80-100%
        collaborationScore: Math.floor(70 + Math.random() * 30), // 70-100%
        memberCount,
        activeMembers,
        lastActivity: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(), // Random time in last 7 days
        totalContent: Math.floor(Math.random() * 50) + 10, // 10-60 content pieces
        totalViews: Math.floor(Math.random() * 1000) + 100, // 100-1100 views
        totalLikes: Math.floor(Math.random() * 200) + 20, // 20-220 likes
        totalShares: Math.floor(Math.random() * 50) + 5, // 5-55 shares
        totalComments: Math.floor(Math.random() * 100) + 10 // 10-110 comments
      }
    })

    return NextResponse.json({
      message: 'Team performance data fetched successfully',
      performance
    })
  } catch (error) {
    console.error('Error fetching team performance:', error)
    return NextResponse.json(
      { error: 'Failed to fetch team performance' },
      { status: 500 }
    )
  }
}
