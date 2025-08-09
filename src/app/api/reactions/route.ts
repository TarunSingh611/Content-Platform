import { NextResponse } from 'next/server'
import { getServerAuthSession } from '@/lib/auth-utils'
import prisma from '@/lib/utils/db'

// Toggle reaction (UPVOTE, DOWNVOTE, FAVORITE)
export async function POST(req: Request) {
  try {
    const session = await getServerAuthSession()
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { contentId, type } = await req.json() as { contentId: string; type: 'UPVOTE' | 'DOWNVOTE' | 'FAVORITE' }
    if (!contentId || !type) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

    // Find existing reaction of the same type
    const existing = await prisma.reaction.findUnique({
      where: { contentId_userId_type: { contentId, userId: session.user.id, type } },
    })

    // Prepare the day key for AnalyticsDaily
    const day = new Date(); day.setUTCHours(0, 0, 0, 0)

    if (existing) {
      // Remove existing reaction (toggle off)
      await prisma.$transaction(async (tx) => {
        await tx.reaction.delete({ where: { id: existing.id } })
        // Keep content.likes in sync for UPVOTE
        if (type === 'UPVOTE') {
          await tx.content.update({ where: { id: contentId }, data: { likes: { decrement: 1 } } })
        }
        // Update AnalyticsDaily counters
        const daily = await tx.analyticsDaily.upsert({
          where: { contentId_day: { contentId, day } },
          update: {},
          create: { contentId, day, tagsSnapshot: [], recentNextContentIds: [] },
        })
        if (type === 'UPVOTE') await tx.analyticsDaily.update({ where: { id: daily.id }, data: { upvotes: { decrement: 1 } } })
        if (type === 'DOWNVOTE') await tx.analyticsDaily.update({ where: { id: daily.id }, data: { downvotes: { decrement: 1 } } })
        if (type === 'FAVORITE') await tx.analyticsDaily.update({ where: { id: daily.id }, data: { favorites: { decrement: 1 } } })
      })
    } else {
      await prisma.$transaction(async (tx) => {
        // If UPVOTE or DOWNVOTE, enforce exclusivity and adjust likes counter appropriately
        if (type === 'UPVOTE' || type === 'DOWNVOTE') {
          const opposite = type === 'UPVOTE' ? 'UPVOTE' : 'DOWNVOTE'
          // If switching from UPVOTE -> DOWNVOTE or vice versa, remove opposite and adjust likes
          const removed = await tx.reaction.deleteMany({
            where: { contentId, userId: session.user.id, type: (type === 'UPVOTE' ? 'DOWNVOTE' : 'UPVOTE') as any },
          })
          if (removed.count > 0) {
            // If removed an UPVOTE due to switching to DOWNVOTE, decrement likes
            if (type === 'DOWNVOTE') {
              await tx.content.update({ where: { id: contentId }, data: { likes: { decrement: 1 } } })
            }
            // If removed a DOWNVOTE due to switching to UPVOTE, increment likes
            if (type === 'UPVOTE') {
              await tx.content.update({ where: { id: contentId }, data: { likes: { increment: 1 } } })
            }
          }
        }

        await tx.reaction.create({ data: { contentId, userId: session.user.id, type } })

        // Update content.likes for direct UPVOTE add
        if (type === 'UPVOTE') {
          await tx.content.update({ where: { id: contentId }, data: { likes: { increment: 1 } } })
        }

        // Update AnalyticsDaily counters
        const daily = await tx.analyticsDaily.upsert({
          where: { contentId_day: { contentId, day } },
          update: {},
          create: { contentId, day, tagsSnapshot: [], recentNextContentIds: [] },
        })
        if (type === 'UPVOTE') await tx.analyticsDaily.update({ where: { id: daily.id }, data: { upvotes: { increment: 1 } } })
        if (type === 'DOWNVOTE') await tx.analyticsDaily.update({ where: { id: daily.id }, data: { downvotes: { increment: 1 } } })
        if (type === 'FAVORITE') await tx.analyticsDaily.update({ where: { id: daily.id }, data: { favorites: { increment: 1 } } })
      })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Error toggling reaction:', err)
    return NextResponse.json({ error: 'Failed to toggle reaction' }, { status: 500 })
  }
}


